import { Button } from "@nextui-org/react";
import React from "react"; 
import { Menu } from "react-feather";
import { Link as RouterLink, Outlet } from "react-router-dom"; 


const Header = () => {
	return (
		<div className="w-full inline-flex justify-between items-center mb-1 px-3">
			<div className="flex flex-col gap-1">
				<p className="text-xl font-bold">Good Morning</p>
				<p className="text-sm font-light text-white/60">12 Class</p>
			</div>
				<Button isIconOnly className="bg-white/20" radius="full">
					<Menu color="white" />
				</Button>
			</div>
	);
};

export default Header;
