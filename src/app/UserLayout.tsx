import React, { FC } from "react";
import Sidebar from "../components/UI/Sidebar";
import Header from "../components/UI/Header";

const UserLayout: FC<{ tag?: string; children: any; breadcrumbs: any[] }> = ({
  children,
  tag,
  breadcrumbs,
}) => {
  return (
    <>
      {/* <div className="fixed w-full h-full z-0 bg-primary">
						<div className="bg-white/10 backdrop-blur-lg  w-full h-full "></div>
					</div> */}
      <div className="flex h-screen items-center justify-center bg-primary">
        <div className="flex flex-row h-[94%] w-full mx-4">
          <>
            <Sidebar tag={tag} />
          </>

          <main className="flex flex-col h-full w-full min-w-[600px] bg-white text-secondary rounded-3xl backdrop-blur-2xl px-4 no-scrollbar overflow-y-auto overflow-x-hidden">
            <Header tag={tag} breadcrumbs={breadcrumbs} />
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default UserLayout;
