"use client";
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

const Controls = ({ target }: { target?: THREE.Vector3 }) => {
	const { gl, scene, size, camera: _camera } = useThree();

	const camRef = useRef<THREE.OrthographicCamera>();

	const cam = useControls(
		"Camera",
		{
			far: { value: 1000, min: 10, max: 10000, step: 1000 },
			fov: { value: 60, min: 0, max: 300, step: 10 },
			near: { value: 0.1, min: 0, max: 100, step: 0.5 },
			alpha: { value: 0, min: 0, max: 50000, step: 1000 },
			beta: { value: 0, min: 0, max: 50000, step: 1000 },
			gamma: { value: 2, min: 0, max: 100, step: 1 },

			zoom: { value: 1, min: 0, max: 10, step: 0.005 },
		},
		{ collapsed: true }
	);

	const camera = camRef.current as THREE.OrthographicCamera;
	return (
		<>
			<OrbitControls
				position={[cam.alpha, cam.beta, cam.gamma]}
				args={[camera, gl.domElement]}
			/>
			<PerspectiveCamera
				makeDefault
				name="perspective"
				fov={cam.fov}
				near={cam.near}
				far={cam.far}
				zoom={cam.zoom}
				position={[cam.alpha, cam.beta, cam.gamma]}
			/>
		</>
	);
};
export default Controls;
