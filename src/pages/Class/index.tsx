import { Link } from "react-router-dom";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

import * as React from "react";
import data from "../../data/data.json";
import ClassCard from "../../components/ClassCard";

const Class =()=> {
    
    console.log("class", data[0].modules)
	return (
		<div className="gap-2 grid grid-cols-2 sm:grid-cols-3 overflow-hidden overflow-y-scroll no-scrollbar scroll-smooth">
			{data[0].modules.map((course) => (
				<ClassCard key={course.id} classData={course} />
			))}
		</div>
	);
}
export default Class
