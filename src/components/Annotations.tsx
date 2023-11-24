import * as THREE from "three";
import { ReactElement, memo, useRef } from "react";
import { Html } from "@react-three/drei";
import React from "react";

type annotationType = {
    [key: string]:{
        position: string,
        text: string
    }
}

const Annotations = memo(({ scene, data }: { data:annotationType, scene: THREE.Group }) => {
	const annotations = useRef<ReactElement<any, any>[]>([]);
	const addAnnotation = (
		position: THREE.Vector3,
		uuid: string,
		annotation: keyof typeof data
	) => {
		const positionTarget = data[annotation].position == "top" ? 1 : -1;
		const annotationObj = (
			<Html
				key={uuid}
				position={
					new THREE.Vector3(
						position.x,
						positionTarget * (position.y + 0.9),
						position.z
					)
				}
				center
				zIndexRange={[100, 0]}
			>
				<div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 select-none line-clamp-2 w-[100px] max-h-32 ">
					<p className="text-sm text-center">{data[annotation].text}</p>
				</div>
			</Html>
		);
		annotations.current.push(annotationObj);
	};
	scene.traverse((child) => {
		if (child.userData.hasOwnProperty("annotation")) {
			addAnnotation(child.position, child.uuid, child.userData.annotation);
		}
	});
	return <React.Fragment>{annotations.current}</React.Fragment>;
});
export default Annotations