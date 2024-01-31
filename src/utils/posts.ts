import GhostContentAPI from "@tryghost/content-api";
import { unstable_noStore as noStore } from "next/cache";

// Create API instance with site credentials
const api = new GhostContentAPI({
  url: "https://ali-atwa.digitalpress.blog",
  key: "bef5171833fd701e51903f181e",
  // @ts-ignore
  makeRequest: ({ url, method, params, headers }) => {
    const apiUrl = new URL(url);
    // @ts-ignore
    Object.keys(params).map((key) => apiUrl.searchParams.set(key, params[key]));

    return fetch(apiUrl.toString(), {
      method,
      headers,
      cache: "no-cache",
    })
      .then(async (res) => {
        // Check if the response was successful.
        if (!res.ok) {
          // You can handle HTTP errors here
          throw new Error(`HTTP error! status: ${res.status} ${res.url}`);
        }
        return { data: await res.json() };
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  },
  version: "v5.0",
});

export async function getSinglePost(postSlug: string) {
  return await api.posts
    .read(
      {
        slug: postSlug,
      },
      {
        include: ["tags"],
      }
    )
    .catch((err) => {
      console.error(err);
    });
}
export async function getPosts() {
  return await api.posts
    .browse({
      include: ["tags"],
      limit: "all",
    })
    .catch((err) => {
      console.error("getPosts:: ", err);
    });
}
export async function getPostsByTag(tagSlug: string) {
  return await api.posts
    .browse({
      filter: [`tag:${tagSlug}`],
      include: ["tags"],
      limit: "all",
    })
    .catch((err) => {
      console.error("getPosts:: ", err);
    });
}
export async function getTags() {
  return await api.tags
    .browse({
      include: ["count.posts"],
      limit: "all",
      filter: "visibility:public",
    })
    .catch((err) => {
      console.error("getTags:: ", err);
    });
}
export async function getPages() {
  return await api.pages
    .browse({
      limit: "all",
    })
    .catch((err) => {
      console.error(err);
    });
}
