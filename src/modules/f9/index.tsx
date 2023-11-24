import { useFrame, useGraph, useLoader, useThree } from "@react-three/fiber";
import Resources from "../../Logic/Resources";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import Materials from "../../Logic/World/Materials";
import * as THREE from "three";
import FloorComponent from "../../Logic/World/FloorComponent";
import { usePanel } from "../../context/panel-context";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";
import { useEffect, useMemo, useRef, useState } from "react";
import Controls from "./Controls";
import { Stats, useAnimations, useFBX } from "@react-three/drei"; 

export default function ModelGLB(props: any) {
	const ref = useRef<any>(); 

	const resources = new Resources();
	const mats = new Materials({ resources, debug: false });

	const scene = useFBX('./../models/f9.fbx')
	const [mixer] = useState(() => new THREE.AnimationMixer(scene));
	useFrame((state, delta) => mixer.update(0.01));

	/*useLoader(
		FBXLoader,
		"./../models/f9.fbx" ,
		(loader) => {
			const dracoLoader = new DRACOLoader();
			dracoLoader.setDecoderPath("/gltf/");
			loader.setDRACOLoader(dracoLoader);
		} 
	);*/
	 
	const { actions, names } = useAnimations(scene.animations, ref)
	resources.on("ready", () => {
		 scene.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				if (child.name.includes("steel") || child.name.includes("metal")) {
					child.material = mats.items.metal;
				}

				if (child.name.includes("copper")) {
					child.material = mats.items.copper;
				}
				if (child.name.includes("blue")) {
					child.material = mats.items.blue;
				}
				if (
					child.name.includes("white_plastic") ||
					child.name.includes("plastic_white")
				) {
					child.material = mats.items.plasticWhite;
				}
				if (child.name.includes("red")) {
					child.material = mats.items.red;
				}
				if (child.name.includes("orange")) {
					child.material = mats.items.orange;
				}

				if (child.name.includes("frame")) {
					child.material = mats.items.emeraldGreen; 
				}
				if (child.name.includes("whitesteel_body")) {
					child.material = mats.items.white;
				}
			}
		});  
		//playAnimation()
		console.log("ready");
	}); 
	useEffect(() => {
		scene.animations.forEach((clip) => {
			const action = mixer.clipAction(clip);
			action.play();
		}); 
		//return () => scene.animations.forEach((clip) => mixer.uncacheClip(clip));
	  }, [mixer]); 
	  
	 
	return (
		<><primitive object={new THREE.AxesHelper(2000)} />
			<primitive ref={ref} object={scene} scale={0.1} position={[0,0,-15000]} rotation={[0, Math.PI/2, 0]} > 
			</primitive>  
			<Controls />
			<FloorComponent /> 
			<Stats />
			
		</>
	);
}
