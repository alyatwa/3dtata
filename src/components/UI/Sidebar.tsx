// Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Layers, MoreHorizontal } from "react-feather";
import { Button } from "@nextui-org/react";

const Sidebar = () => {
	const list = [
		{
			label: "Home",
			link: "/classes",
			icon: Home,
		},
		{
			label: "Games",
			link: "games",
			icon: Layers,
		},
	];
	return (
		<aside className="w-64 h-full text-white rounded-tl-3xl rounded-bl-3xl backdrop-blur-xl bg-zinc-600/50 p-4">
			<div className="w-full inline-flex justify-between items-center mb-7">
				<p className="text-xl font-bold">Library</p>
				<Button isIconOnly className="bg-white/20" radius="full">
					<MoreHorizontal color="white" />
				</Button>
			</div>
			<nav className="">
				<ul className="flex flex-col gap-2">
					{list.map((item) => (
						<SidebarItem
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
}: {
	link: string;
	label: string;
	Icon: any;
}) => {
	return (
		<li>
			<NavLink
				to={link}
				className={({ isActive }) =>
					`w-full mb-2 inline-flex items-center p-3 rounded-lg hover:bg-white/20 ${
						isActive ? "bg-white/20" : ""
					}`
				}
			>
				<Icon /> <span className="ml-2">{label}</span>
			</NavLink>
		</li>
	);
};
