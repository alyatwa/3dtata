import { Button, Card, CardFooter, Image, Link } from "@nextui-org/react";
import { NavLink } from "react-router-dom";

const ClassCard = ({ classData }: { classData: any }) => {
	return (
        <NavLink
				to={classData.slug}>
	
			<Card
				radius="lg"
				key={classData.slug}
				className="border-none mx-1 p-3 hover:bg-white/20 bg-transparent shadow-none hover:drop-shadow-md hover:backdrop-blur-xl"
			>
				<Image
					radius="lg"
					className="object-cover h-[180px]"
					height={200}
					shadow="sm"
					src={classData.img}
					width={180}
				/>
				<CardFooter className="inline-flex justify-center items-start overflow-hidden w-full p-2 z-[10] flex-col">
					<p className="text-white font-semibold text-base">{classData.title}</p>
					{classData.modules && <p className="text-white/80 font-medium text-xs">
						{classData.modules.length + " Lesson"}
					</p>}
				</CardFooter>
			</Card>
	</NavLink>
	);
};

export default ClassCard