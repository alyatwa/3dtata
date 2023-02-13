import { Link } from "react-router-dom";

export default function Courses() {
  return (
    <ul className="courses">
      <li>
        <Link to="course1">course 1</Link>
      </li>
      <li>
        <Link to="course2">course 2</Link>
      </li>
    </ul>
  );
}
