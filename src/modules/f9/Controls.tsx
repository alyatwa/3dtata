import {
	CameraShake,
	OrbitControls,
	OrthographicCamera,
	PerspectiveCamera,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { Ref, useEffect, useRef } from "react";
import * as THREE from "three";

const Controls = () => {
	const { gl, scene, size, camera: _camera } = useThree();

	const camRef = useRef<THREE.OrthographicCamera>();

	const cam = useControls("Camera", {
		far: { value: 41000, min: 10, max: 50000, step: 1000 },
		fov: { value: 110, min: 0, max: 300, step: 10 },
		maxDistance: { value: 40000, min: 0, max: 50000, step: 1000 },
		minDistance: { value: 3, min: 0, max: 300, step: 10 },
		near: { value: 1, min: 0, max: 100, step: 0.5 },
		alpha: { value: 25000, min: 10, max: 50000, step: 1000 },
		beta: { value: 0, min: 10, max: 50000, step: 1000 },
		gamma: { value: 0, min: 10, max: 50000, step: 1000 },
		x: { value: 0, min: 0, max: 2000, step: 50 },
		y: { value: 14000, min: 0, max: 50000, step: 1000 },
		z: { value: 0, min: 0, max: 2000, step: 50 },
		zoom: { value: 0.02, min: 0, max: 0.2, step: 0.005 },
		lockCamZ: { value: true },
		//cameraPosition: { value: [0, 0, 5], step: 0.1 },
	},{collapsed:true});

	const camera = camRef.current as THREE.OrthographicCamera;
	if (camRef.current) {
		console.log(camera);
		camera.lookAt(new THREE.Vector3(cam.x, cam.y, cam.z));
		camera.position.x = cam.alpha;
		camera.position.y = cam.beta;
		camera.position.z = cam.lockCamZ ? 0 : cam.gamma;
		camera.far = cam.far;
		camera.near = cam.near;

		camera.updateProjectionMatrix();
	}
	return (
		<>
			<OrbitControls 
				target={[cam.x, cam.y, cam.z]}
				/* onChange={()=>console.log(_camera.zoom)} */
				position={[cam.alpha, cam.beta, cam.gamma]}
				args={[camera, gl.domElement]}
				maxDistance={cam.maxDistance}
				minDistance={cam.minDistance}
				// vertical angle of the orbit
				minPolarAngle={THREE.MathUtils.degToRad(90)}
				maxPolarAngle={THREE.MathUtils.degToRad(90)}
				// horizontal angle of the orbit
				minAzimuthAngle={THREE.MathUtils.degToRad(90)}
				maxAzimuthAngle={THREE.MathUtils.degToRad(90)}
			/>
		 <OrthographicCamera
				makeDefault
				name="ortho"
				top={window.innerHeight / 2}
				bottom={-window.innerHeight / 2}
				left={-window.innerWidth / 2}
				right={window.innerWidth / 2}
				near={cam.near}
				far={cam.far}
				zoom={cam.zoom}
				position={[cam.alpha, cam.beta, cam.gamma]}
			/> 
			{/* <PerspectiveCamera	
				makeDefault
				name="perspective"
				fov={cam.fov}
				near={cam.near}
				far={cam.far}
				zoom={cam.zoom}
				position={[cam.alpha, cam.beta, cam.gamma]}
			/> */}
		</>
	);
};
export default Controls;
