import { Link, Outlet, useParams } from "react-router-dom";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";

import * as React from "react";
import data from "../../data/data.json";
import ClassCard from "../../components/ClassCard";

export default function Classes() {
	
	return (
		<>
		<div className="gap-2 grid grid-cols-2 sm:grid-cols-3">
			{data.map((_class) => (
				<ClassCard key={_class.id} classData={_class} />
			))}
			
		</div>
		</>
	);
}
