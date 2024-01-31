import dynamic from "next/dynamic";

export async function generateStaticParams() {
  const _class = [
    { class: "space", lesson: ["earth", "jupiter", "solar-system"] },
    { class: "math", lesson: ["square", "triangle"] },
  ];

  return _class.flatMap((item) =>
    item.lesson.map((lesson) => ({
      classslug: item.class,
      lesson: lesson,
    }))
  );
}

const ContentPage = ({
  params: { lesson, classslug },
}: {
  params: { lesson: string; classslug: string };
}) => {
  const ClientContent = dynamic(
    () => import("./canvas"),
    { ssr: false } // This option will only render the component on the client-side
  );
  return <ClientContent lesson={lesson} />;
};
export default ContentPage;
