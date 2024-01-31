import type { PostOrPage } from "@tryghost/content-api";

const PostHeader = ({ post }: { post: PostOrPage }) => {
	return (
		<>
			<div className="bg-[url('https://littledino.wgl-demo.net/wp-content/uploads/2019/08/page_title_bg.png')] bg-transparent bg-center bg-cover bg-scroll z-10 relative pt-[12px] pb-[88px] h-[348px] overflow-hidden w-full flex flex-col justify-center items-center gap-3">
				<p className="text-5xl font-bold text-indigo-950">
					{post?.primary_tag?.name ?? ""}
				</p>
				<p className="font-semibold text-base">
					<span className="text-indigo-950/70">Home</span>
					<span className="text-cyan-600"> • </span>{" "}
					<span className="text-indigo-950">{post?.primary_tag?.name}</span>
				</p>
			</div>
			<h1 className="my-2 text-center font-bold text-6xl text-indigo-950 ">
				<span className="px-3 bg-[length:100%_0.521em] bg-[0%_74%] inline bg-[linear-gradient(to_top,rgba(250,157,183,0.5),rgba(250,157,183,0.5))] bg-no-repeat">
					{post?.title}
				</span>
			</h1>
		</>
	);
};
export default PostHeader;
