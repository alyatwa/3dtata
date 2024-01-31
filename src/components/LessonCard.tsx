import { Button, Card, CardFooter, Image, Link } from "@nextui-org/react";
import type { PostOrPage } from "@tryghost/content-api";
import { headers } from "next/headers";

const LessonCard = ({
  lesson,
  baseURL = "",
}: {
  baseURL?: string;
  lesson: PostOrPage;
}) => {
  return (
    <Link href={`${baseURL}${lesson.slug}`}>
      <Card
        radius="lg"
        key={lesson.slug}
        className="border-none mx-1 p-3 hover:bg-primary/40 bg-transparent shadow-none hover:drop-shadow-md "
      >
        <Image
          radius="lg"
          className="object-cover h-[180px]"
          height={200}
          shadow="sm"
          src={lesson.feature_image ?? ""}
          width={180}
        />
        <CardFooter className="inline-flex justify-center items-start overflow-hidden w-full p-2 z-[10] flex-col">
          <p className="text-black font-semibold text-base">{lesson.title}</p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default LessonCard;
