import { Card, CardBody, Image, Button, Slider } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "react-feather";
import { LineMaterial } from "three-stdlib";

type cardType ={
	infoAr: string
	infoEn: string
}[]
const InfoPanel = ({cards}:{cards:cardType}) => {
	const colors = [
		"mint",
		"violet",
		"lightGreen",
		"yellow",
		"softBlue",
		"orange",
		"pink",
		"lime",
	];
	const data = new Array(5).fill("o");
	
	const getRandomBoolean = (num:number) => {
		return num % 2 === 0;
	};
	
	return (
		<>
			<div className="flex flex-col gap-4 fixed my-4 ml-4 h-[calc(100vh-30px)] overflow-y-scroll no-scrollbar scroll-smooth">
				{cards.map((info, i) => (
					<div
						key={i}
						 
						className={`rounded-2xl w-80 border-none backdrop-filter backdrop-blur-lg bg-opacity-50 ${
							getRandomBoolean(i) ? "animate-float-slow" : "animate-float-up"
						}`} 
					>
						<div className={`bg-${colors[i]}/60 p-4 rounded-2xl`}>
							<p className="text-lg font-normal text-white">
								{info.infoEn}
							</p>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default InfoPanel;
