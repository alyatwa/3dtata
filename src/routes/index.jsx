import Home from "../pages/Home";
import Course from "../pages/Course";
import Lesson from "../pages/Lesson";
import Courses from "../pages/Courses";
import {useRoutes} from 'react-router-dom';

const mainRoutes = useRoutes([
  {
    path: "/",
    element: <Home />,
  },

  {
    path: "courses",
    children: [
      {
        index: true,
        element: <Courses />,
      },
      {
        path: ":courseId",
        element: <Course />,
      },
       {
        path: ":lessonId",
        element: <Lesson />,
      },
    ],
  },
]);

export default mainRoutes;
