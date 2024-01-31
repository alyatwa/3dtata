import type { Tags } from "@tryghost/content-api";
import Link from "next/link";

const PostTags = ({ tags }: { tags: Tags }) => {
	return (
		<div className="inline-flex gap-3 flex-row items-start my-4 w-full">
			{tags.map((tag) => (
				<Link
					href={`/classes/${tag.slug}`}
					key={tag.id}
					className="px-4 py-2 rounded-full bg-slate-300 hover:bg-rose-400"
				>
					{tag.name}
				</Link>
			))}
		</div>
	);
};
export default PostTags;
