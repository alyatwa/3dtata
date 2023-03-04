import { Route,Navigate, Routes as BaseRoutes } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Course from "./pages/Course";
import Module from "./pages/Module";
import fake from './data/data'
import { Spinner } from "@fluentui/react-components";

import React, { Suspense } from 'react'

export default function Routes() {
  return (<Suspense fallback={<Spinner />}>
    <BaseRoutes>
      <Route path="/" element={<Navigate to='/courses/classic-control' />} />
      <Route path="courses">
        <Route index element={<Courses courses={fake} />} />
        <Route path=":courseId" element={<Module />}>
          <Route path=":moduleId" element={<Module />}/>
        </Route>
        {/*<Route path=":moduleId" element={<Module />} />*/}
      </Route>
    </BaseRoutes>
    </Suspense>
  );
}
