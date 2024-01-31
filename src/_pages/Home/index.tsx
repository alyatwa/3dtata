import { Button, Card, CardFooter, Image, Link } from "@nextui-org/react";
import data from "../../data/data.json";
import ClassCard from "../../components/ClassCard";
//https://www.figma.com/file/O9rRa2XuQWd58vfGFEaSkx/Apple-Vision-Pro-Ui-(Community)?type=design&node-id=3-704&mode=design&t=KSBPL3DqPF8qD1V1-0
export default function Home() {
	return (
		<div className="p-4">
			<div className="flex ">
				{data.map((item) => (
					<ClassCard key={item.id} classData={item} />
				))}
			</div>
		</div>
	);
}
