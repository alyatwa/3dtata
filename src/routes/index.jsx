import Home from "../pages/Home";
import Course from "../pages/Course";
import Module from "../pages/Module";
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
        element: <Module />,
      }
      /*,
       {
        path: ":moduleId",
        element: <Module />,
      },*/
    ],
  },
]);

export default mainRoutes;
