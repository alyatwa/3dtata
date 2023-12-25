import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "@trendyol-js/react-carousel";
import { ArrowLeftCircle, ArrowRightCircle } from "react-feather";
import { Button, Card, CardFooter, Image } from "@nextui-org/react";

/* const useStyles = makeStyles({
	arrows: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyItems: "center",
	},
	text: {
		...shorthands.overflow("hidden"),
		width: "100px",
		display: "block",
	},
	item: {
		display: "flex",
		width: "105px",
		flexDirection: "column",
		alignItems: "center",
		justifyItems: "center",
	},
	card: {
		display: "flex",
		justifyContent: "center",
		width: "115px",
	},
}); */
export default function Modules(props: any) {
	//const Styles = useStyles();
	//className={Styles.arrows}
	return (
		<div className="bg-white/90 p-4 rounded-xl">
		<Carousel
		className="flex items-center"
			leftArrow={<ArrowLeftCircle  size={25} />}
			rightArrow={<ArrowRightCircle size={25} />}
			show={4}
			slide={1}
			swiping={true}
		>
			{props.data.modules.map((module: any) => ( 
					<Card radius="lg" key={module.slug} className="border-none mx-1">
						<Image
						
							className="object-cover"
							height={200}
							src={module.img}
							width={200}
						/>
						<CardFooter className="justify-center overflow-hidden bottom-0 absolute w-full shadow-small p-1 z-[10]">
							<Button
								className="text-tiny text-white bg-black/70"
								variant="flat"
								color="default"
								radius="lg"
								size="sm" onClick={()=>window.open('http://127.0.0.1:5173/courses/'+props.data.slug+'/'+module.slug)}
							>
								{module.title}
							</Button>
						</CardFooter>
					</Card>
			))}
		</Carousel></div>
	);
}
