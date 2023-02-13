import { Route, Routes as BaseRoutes } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Course from "./pages/Course";

export default function Routes() {
  return (
    <BaseRoutes>
      <Route path="/" element={<Home />} />
      <Route path="courses">
        <Route index element={<Courses />} />
        <Route path=":courseId" element={<Course />} />
      </Route>
    </BaseRoutes>
  );
}
