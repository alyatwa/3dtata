"use client";

import React, { FC } from "react";
import { Home, Layers, MoreHorizontal } from "react-feather";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import AR from "@/i18n/ar";

const Sidebar: FC<{ tag?: string }> = ({ tag }) => {
  const list = [
    {
      label: AR.home,
      id: "home",
      link: "/",
      icon: Home,
    },
    {
      label: AR.classes,
      link: "/classes",
      id: "classes",
      icon: Layers,
    },
  ];
  return (
    <aside className="w-64 h-full text-secondary rounded-tl-3xl rounded-bl-3xl backdrop-blur-xl bg-primary ">
      {/* <div className="w-full inline-flex justify-between items-center mb-7">
        <p className="text-xl font-bold">Library</p>
        <Button isIconOnly className="bg-white/20" radius="full">
          <MoreHorizontal color="white" />
        </Button>
      </div> */}
      <nav className="">
        <ul className="flex flex-col mt-10">
          {list.map((item) => (
            <SidebarItemAR
              tag={tag}
              id={item.id}
              Icon={item.icon}
              key={item.label}
              label={item.label}
              link={item.link}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

const SidebarItem = ({
  link,
  label,
  Icon,
  tag,
  id,
}: {
  link: string;
  label: string;
  Icon: any;
  tag?: string;
  id: string;
}) => {
  const isActive = id == tag;
  return (
    <li
      className={`flex flex-col items-end my-2 -mt-[22px] ${
        isActive ? "" : "w-[90%]"
      }`}
    >
      <div
        className={`${
          isActive
            ? "w-[40px] h-[40px] relative bg-primary overflow-hidden before:absolute before:-top-[40px] before:-left-[40px] before:block before:rounded-full before:content-[''] before:w-[80px] before:h-[80px] before:shadow-[0_0_0_2000px_#fff] -z-[10]"
            : ""
        }`}
      ></div>
      <Link
        className={`${
          isActive
            ? "bg-white rounded-l-full"
            : "text-white hover:bg-white/20 rounded-full pr-3"
        } w-full inline-flex items-center p-3 
					`}
        href={link}
      >
        <Icon /> <span className="ml-2">{label}</span>
      </Link>
      <div
        className={`${
          isActive
            ? "before:shadow-[0_0_0_2000px_#fff] w-[40px] h-[40px] relative bg-primary overflow-hidden before:absolute before:-bottom-[40px] before:-right-[0px] before:block before:rounded-full before:content-[''] before:w-[80px] before:h-[80px] -z-[10]"
            : ""
        }`}
      ></div>
    </li>
  );
};

const SidebarItemAR = ({
  link,
  label,
  Icon,
  tag,
  id,
}: {
  link: string;
  label: string;
  Icon: any;
  tag?: string;
  id: string;
}) => {
  const isActive = id == tag;
  return (
    <li
      className={`flex flex-col items-end my-2 -mt-[22px] ${
        isActive ? "" : "w-[90%]"
      }`}
    >
      <div
        className={`${
          isActive
            ? "w-[40px] h-[40px] relative bg-primary overflow-hidden before:absolute before:-top-[40px] before:-right-[40px] before:block before:rounded-full before:content-[''] before:w-[80px] before:h-[80px] before:shadow-[0_0_0_2000px_#fff] -z-[10]"
            : ""
        }`}
      ></div>
      <Link
        className={`${
          isActive
            ? "bg-white rounded-r-full"
            : "text-white hover:bg-white/20 rounded-full pl-3"
        } w-full inline-flex items-center p-3 
					`}
        href={link}
      >
        <Icon /> <span className="mr-2">{label}</span>
      </Link>
      <div
        className={`${
          isActive
            ? "before:shadow-[0_0_0_2000px_#fff] w-[40px] h-[40px] relative bg-primary overflow-hidden before:absolute before:-bottom-[40px] before:-left-[0px] before:block before:rounded-full before:content-[''] before:w-[80px] before:h-[80px] -z-[10]"
            : ""
        }`}
      ></div>
    </li>
  );
};
