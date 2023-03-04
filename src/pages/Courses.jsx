import { Link } from "react-router-dom";
import { Image } from "@fluentui/react-components";
import * as React from "react";
import fake from '../data/data'

export default function Courses() {
  //console.log(fake)
  return (
    <ul className="courses">
      {fake.map((course)=>
      <li key={course.id}>
      <Link to={course.slug} state={course.modules}>
      <Image
    shape="rounded"
    src={course.img}
    height={200}
    width={200}
  />
        <p>{course.title}</p>
        </Link>
    </li>
      )}
    </ul>
  );
}
