import { redirect } from "react-router-dom";

export default function Home() {
  redirect("/courses/classic-control");
  return <h1>Hello Home</h1>
}
