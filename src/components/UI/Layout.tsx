import React from "react";
import { Outlet, useMatch } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
	const match = useMatch("/classes/:classId/:lessonId");
	return (
		<>
			{!match ? (
				<>
					<div className="fixed w-full h-full z-0 bg-[url('/bg1.jpg')] bg-cover bg-no-repeat bg-center">
						<div className="bg-white/10 backdrop-blur-lg  w-full h-full "></div>
					</div>
					<div className="flex h-screen items-center justify-center z-1">
						<div className="flex flex-row h-[500px]">
							<>
								<Sidebar />
							</>

							<main className="flex flex-col h-full min-w-[600px] bg-white/10 text-white rounded-tr-3xl rounded-br-3xl  backdrop-blur-2xl p-4">
								<Header />
								<Outlet />
							</main>
						</div>
					</div>
				</>
			) : (<>
				<Outlet /></>
			)}
		</>
	);
};

export default Layout;
