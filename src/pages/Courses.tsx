import { Link } from "react-router-dom";
import { Image } from "@fluentui/react-components";
import * as React from "react";
import fake from "../data/data.json";

export default function Courses(props: any) {
	//console.log(props)
	return (
		<ul className="courses">
			{props.courses.map((course: any) => (
				<li key={course.id}>
					<Link to={course.slug} state={course.modules}>
						<Image shape="rounded" src={course.img} height={200} width={200} />
						<p>{course.title}</p>
					</Link>
				</li>
			))}
		</ul>
	);
}
