import { Button, Card, CardFooter, Image, Link } from "@nextui-org/react";
import type { Tag } from "@tryghost/content-api";
import AR from "@/i18n/ar";

const ClassCard = ({
  classData,
  baseURL = "",
}: {
  baseURL?: string;
  classData: Tag;
}) => {
  return (
    <Link href={`${baseURL}${classData.slug}`}>
      <Card
        radius="lg"
        key={classData.slug}
        className="border-none mx-1 p-3 hover:bg-primary/20 bg-transparent shadow-none hover:drop-shadow-md hover:backdrop-blur-xl"
      >
        <Image
          radius="lg"
          className="object-cover h-[180px]"
          height={200}
          shadow="sm"
          src={classData.feature_image ?? ""}
          width={180}
        />
        <CardFooter className="inline-flex justify-center items-start overflow-hidden w-full p-2 z-[10] flex-col">
          <p className="text-black font-semibold text-base">{classData.name}</p>
          {classData.count?.posts && (
            <p className="text-black font-medium text-xs">
              {classData.count?.posts + " " + AR.lessons}
            </p>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ClassCard;
