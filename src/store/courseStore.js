import create from 'zustand';
import { stringify } from 'query-string';
import { persist } from 'zustand/middleware';

import methods from 'services/github';
const initialState = {
    data: undefined,
    userDetails: undefined,
    cached_users_details: [],
    query: { page: 1, per_page: 20 },
    isLoading: false,
    error: undefined,
};

export const courseStore = create(
  persist(
    (set, get) => ({
        ...initialState,
      search: async (query) => {
        try {
          set(() => ({ isLoading: true }));
          window.history.pushState('', '', `?${stringify(query)}`);
          const data = await methods.get({
            url: '/search/users',
            query,
          });
          set(() => ({ data, query, isLoading: false }));
        } catch (err) {
          const error =
            err?.message || err?.data?.message || 'Unexpected network error.';
          set(() => ({ isLoading: false, error }));
        }
      },
      getUser: async (username) => {
        try {
          set(() => ({ isLoading: true }));
          // check if user is already cached
          const userDetails = get().cached_users_details.find(
            (u) => u.login === username
          );
          if (userDetails) {
            set(() => ({ userDetails, isLoading: false }));
          } else {
            const userInfo = await methods.get({
              url: `/users/${username}`,
            });

            set((state) => ({
              cached_users_details: [...state.cached_users_details, userInfo],
              userDetails: userInfo,
              isLoading: false,
            }));
          }
        } catch (err) {
          const error =
            err?.message || err?.data?.message || 'Unexpected network error.';
          set(() => ({ isLoading: false, error }));
        }
      },
      clear: () => {
        set(() => (initialState));
        sessionStorage.clear(); // or localStorage.clear();
    },
    }),
    {
      name: 'course-storage',
      getStorage: () => sessionStorage,
    }
  )
);