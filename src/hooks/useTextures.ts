import { useEffect, useState } from "react";
import * as THREE from "three";
import { state } from "../context/panel-proxy";

// Custom hook for loading textures
function useTextures(
	paths: string[],
	callback?: (textures: THREE.Texture[]) => void
) {
	const [textures, setTextures] = useState<THREE.Texture[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => { 
		let isMounted = true;

		loadTextures(paths)
			.then((loadedTextures) => {
				if (isMounted) {
					setTextures(loadedTextures);
					setLoading(false);
					state.isCanvasLoading = false 
					if (callback) {
						callback(loadedTextures);
					}
				}
			})
			.catch((error) => {
				if (isMounted) {
					console.error("An error occurred while loading textures:", error);
					setLoading(false);
				}
			});

		return () => {
			isMounted = false;
		};
	}, [paths]);

	return [textures, loading] as const;
}

export default useTextures;

function loadTextures(
	paths: string[],
	callback?: () => void
): Promise<THREE.Texture[]> {
	const loader = new THREE.TextureLoader();
	const promises = paths.map((path) => {
		return new Promise((resolve, reject) => {
			loader.load(
				path,
				(texture) => resolve(texture),
				undefined,
				(error) => reject(error)
			);
		});
	});
	const promiseAll = Promise.all(promises) as Promise<THREE.Texture[]>;
	if (callback) promiseAll.then(() => callback());
	return promiseAll;
}
