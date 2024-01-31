import type { PostOrPage, PostsOrPages } from "@tryghost/content-api";
import { getPosts, getSinglePost } from "@/utils/posts";
import AR from "@/i18n/ar";
import PostTags from "@/components/UI/Post/PostTags";
import UserLayout from "@/app/UserLayout";
import Image from "next/image";

export async function generateStaticParams({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const allPosts = (await getPosts()) as PostsOrPages;

  return allPosts?.map((post) => ({
    slug: post.primary_tag?.slug,
    lessonslug: post.slug,
  }));
}
export default async function Page({
  params,
}: {
  params: { lessonslug: string; slug: string };
}) {
  const post = (await getSinglePost(params.lessonslug)) as PostOrPage;
  const breadcrumbs = [
    { title: AR.home, link: "/" },
    {
      title: post.primary_tag?.name,
      link: "/classes/" + post.primary_tag?.slug,
    },
    {
      title: post.title,
      link: "/classes/" + post.primary_tag?.slug + "/" + post.slug,
    },
  ];
  return (
    <UserLayout tag="classes" breadcrumbs={breadcrumbs}>
      <div className="flex items-center justify-center w-full">
        {/* <div className="absolute inset-0 z-0 h-screen w-full bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]">
         */}
        <div className="flex items-center justify-center flex-col gap-3">
          <Image
            src={post.feature_image ?? ""}
            className="rounded-2xl my-2"
            width={500}
            height={450}
            alt={post.feature_image_alt ?? ""}
          />
          <h1 className="font-semibold text-2xl">{post.title}</h1>
          <div
            className="prose lg:prose-lg"
            dangerouslySetInnerHTML={{ __html: post.html ?? "" }}
          />
          <PostTags tags={(post.tags as any) ?? []} />
        </div>
      </div>
    </UserLayout>
  );
}
