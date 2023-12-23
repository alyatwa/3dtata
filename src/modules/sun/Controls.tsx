import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";

const Controls = () => {
	/* const cam = useControls("Camera", {
		far: { value: 1000, min: 10, max: 2000, step: 5 },
		fov: { value: 75, min: 0, max: 300, step: 10 },
		alpha: { value: 30, min: -90, max: 360, step: 0.01 },
		beta: { value: 27, min: -90, max: 360, step: 0.01 },
		gamma: { value: -100, min: -90, max: 360, step: 0.01 },
		x: { value: 0, min: -20, max: 100, step: 0.01 },
		y: { value: 0, min: -20, max: 100, step: 0.01 },
		z: { value: 0, min: -20, max: 100, step: 0.01 },
		minZoom: { value: 77, min: 0, max: 100, step: 1 },
		maxZoom: { value: 400, min: 0, max: 400, step: 1 },
		//cameraPosition: { value: [0, 0, 5], step: 0.1 },
	});*/
 
	const { gl, camera, scene, size } = useThree();
	//camera.position.set(-50, 90, 150)
	//camera.far = cam.far;
	// @ts-ignore
	///camera.fov = cam.fov;
	// @ts-ignore 
	camera.aspect=window.innerWidth/window.innerHeight;

	camera.updateProjectionMatrix();

	return (
		<OrbitControls
		maxPolarAngle={Math.PI / 2} 
        minPolarAngle={Math.PI / 2}
			makeDefault
			args={[camera, gl.domElement]} 
		/>
	);
};
export default Controls;
