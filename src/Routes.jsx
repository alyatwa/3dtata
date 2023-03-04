import { Route, Routes as BaseRoutes } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Course from "./pages/Course";
import Module from "./pages/Module";

import { Spinner } from "@fluentui/react-components";

import React, { Suspense } from 'react'

export default function Routes() {
  return (<Suspense fallback={<Spinner />}>
    <BaseRoutes>
      <Route path="/" element={<Home />} />
      <Route path="courses">
        <Route index element={<Courses />} />
        
        <Route path=":moduleId" element={<Module />} />
         
      </Route>
    </BaseRoutes></Suspense>
  );
}
