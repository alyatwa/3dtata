import type { PostsOrPages, Tags } from "@tryghost/content-api";
import { getPostsByTag, getTags } from "../../../utils/posts";
import LessonCard from "../../../components/LessonCard";
import UserLayout from "@/app/UserLayout";
import AR from "@/i18n/ar";

export async function generateStaticParams() {
  const allTags = (await getTags()) as Tags;

  let allTagsItem: { slug: string }[] = [];

  // generate the slug for static site

  allTags?.map((item) => {
    allTagsItem.push({
      slug: item.slug,
    });
  });

  return allTagsItem;
}
export default async function IndexPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const posts = ((await getPostsByTag(slug)) ?? []) as PostsOrPages;
  const breadcrumbs = [
    { title: AR.home, link: "/" },
    { title: posts[0]?.primary_tag?.name ?? "", link: "/classes/" + slug },
  ];
  return (
    <UserLayout tag={"classes"} breadcrumbs={breadcrumbs}>
      <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
        {posts.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} baseURL={`${slug}/`} />
        ))}
      </div>
    </UserLayout>
  );
}
