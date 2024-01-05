import React, { Suspense, lazy } from "react";
import {
	Route,
	Navigate,
	Routes as BaseRoutes,
	useNavigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Classes from "./pages/Classes";
//import Module from "./pages/Module";
import Header from "./components/UI/Header";
// @ts-ignore
import fake from "./data/data";
//const Module = React.lazy(() => import("./pages/Module"));
import Module from "./pages/Module";
import { Spinner, NextUIProvider } from "@nextui-org/react";
import Layout from "./components/UI/Layout";
import Class from "./pages/Class";

export default function Routes() {
	const navigate = useNavigate();
	return (
		<NextUIProvider navigate={navigate}>
			<BaseRoutes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="/classes" element={<Classes />} />
					<Route path="/classes/:classId" element={<Class />} />
					<Route
						path="/classes/:classId/:moduleId"
						element={
							<Suspense fallback={<Spinner />}>
								<Module />
							</Suspense>
						}
					/>
					<Route path="*" element={<p>There's nothing here: 404!</p>} />
				</Route>
			</BaseRoutes>
		</NextUIProvider>
	);
}
