import React, { useState } from "react"; 
import { Link } from "react-router-dom";
import { Carousel } from "@trendyol-js/react-carousel";
import { ArrowLeftCircle, ArrowRightCircle } from "react-feather";
import { Button, Image } from "@nextui-org/react";

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
		<Carousel
			
			leftArrow={<ArrowLeftCircle size={25} />}
			rightArrow={<ArrowRightCircle size={25} />}
			show={4}
			slide={1}
			swiping={true}
		>
			{props.data.modules.map((module: any) => (
				<div className="flex" key={module.id}>
					<Button >
						<Image src={module.img} height={100} width={100} />
						<p className="truncate">
							{module.title}
						</p>
					</Button>
				</div>
			))}
		</Carousel>
	);
}
