import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";

const Controls = () => {
	const cam = useControls("Camera", {
		far: { value: 85, min: 10, max: 100, step: 5 },
		fov: { value: 110, min: 0, max: 300, step: 10 },
		alpha: { value: 30, min: -90, max: 360, step: 0.01 },
		beta: { value: 27, min: -90, max: 360, step: 0.01 },
		gamma: { value: -100, min: -90, max: 360, step: 0.01 },
		x: { value: 0, min: -20, max: 100, step: 0.01 },
		y: { value: 4, min: -20, max: 100, step: 0.01 },
		z: { value: 0, min: -20, max: 100, step: 0.01 },
		//cameraPosition: { value: [0, 0, 5], step: 0.1 },
	});

	const { gl, camera, scene, size } = useThree();
	camera.position.x = 50 * Math.cos(THREE.MathUtils.degToRad(cam.alpha));
	camera.position.z = 50 * Math.sin(THREE.MathUtils.degToRad(cam.beta));
	camera.far = cam.far;
	camera.updateProjectionMatrix();

	return (
		<OrbitControls
			target={[cam.x, cam.y, cam.z]}
			makeDefault
			args={[camera, gl.domElement]}
			maxDistance={10}
			minDistance={3}
			// vertical angle of the orbit
			minPolarAngle={THREE.MathUtils.degToRad(0)}
			maxPolarAngle={THREE.MathUtils.degToRad(180)}
			// horizontal angle of the orbit
			minAzimuthAngle={THREE.MathUtils.degToRad(-180)}
			maxAzimuthAngle={THREE.MathUtils.degToRad(180)}
		/>
	);
};
export default Controls;
