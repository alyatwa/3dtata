import { getTags } from "../utils/posts";
import type { Tags } from "@tryghost/content-api";
import ClassCard from "../components/ClassCard";
import UserLayout from "./UserLayout";
import AR from "@/i18n/ar";

/* export async function generateStaticParams({ params: { lang } }: any) {
  await serverSideTranslations(lang, ["common"]);
} */
export default async function Home() {
  const classes = ((await getTags()) as Tags) ?? [];
  return (
    <UserLayout tag="home" breadcrumbs={[]}>
      <div className="p-4">
        <div className="flex ">
          {classes.map((tag) => (
            <ClassCard key={tag.id} baseURL="/classes/" classData={tag} />
          ))}
        </div>
      </div>
    </UserLayout>
  );
}
