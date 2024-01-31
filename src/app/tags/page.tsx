import type { Tags } from "@tryghost/content-api";
import { getTags } from "../../utils/posts";
import Link from "next/link";

export default async function IndexPage() {
  const tags = (await getTags()) as Tags;
  console.log(tags.length);
  return (
    <ul>
      {tags?.map((tag) => (
        <li key={tag.id}>
          <Link href={`/${tag.slug}`}>{tag.name}</Link>
        </li>
      ))}
    </ul>
  );
}
