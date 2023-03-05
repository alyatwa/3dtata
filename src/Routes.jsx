import React, { Suspense, lazy } from 'react'
import { Route,Navigate, Routes as BaseRoutes } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
//import Module from "./pages/Module";
import Header from './pages/Home/Header'
import fake from './data/data'
import { Spinner } from "@fluentui/react-components";
//const Module = React.lazy(() => import("./pages/Module"));
import Module from "./pages/Module";


export default function Routes() {
  return (
    <BaseRoutes>
      <Route path="/" element={<Header />}>
      <Route index element={<Navigate to='/courses/classic-control' />} />
      <Route path="courses">
        <Route index element={<Courses courses={fake} />} />
        <Route path=":courseId" element={<Suspense fallback={<Spinner />}><Module /></Suspense>} />
        {/*<Route path=":moduleId" element={<Module />} />*/}
      </Route>
      <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Route>
    </BaseRoutes>
    
  );
}
