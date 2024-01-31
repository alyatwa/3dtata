import { useParams } from "react-router-dom";
import fake from "../../data/data.json";
import Article from "./Article";
import ThreeD from "./3D";

const Lesson = () => {
	const { classId, lessonId } = useParams();
	const _class = fake.find((x) => x.slug === classId);

	// @ts-ignore
	const lesson = _class?.modules.find((x) => x.slug! === lessonId);
	if (!lesson) {
		console.error("lesson not found");
		return <p>lesson not found</p>;
	}

	return <ContentPage contentType={lesson.contentType} currentLesson={lesson} _class={_class} />;
};

const ContentPage = ({ contentType, currentLesson, _class }: { _class:any;currentLesson:any; contentType: string }) => {
	switch (contentType) {
		case "article":
			return <Article currentLesson={currentLesson} _class={_class} />;
		case "3d":
			return <ThreeD currentLesson={currentLesson}  _class={_class} />;
		default:
			return <div>Default case: No component found for this type.</div>;
	}
};

export default Lesson;
