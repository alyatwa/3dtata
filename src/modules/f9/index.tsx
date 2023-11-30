import {
	useFrame,
	useGraph,
	useLoader,
	useThree,
	extend,
} from "@react-three/fiber";
import Resources from "../../Logic/Resources";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import Materials from "../../Logic/World/Materials";
import * as THREE from "three";
import FloorComponent from "../../Logic/World/FloorComponent";
import { usePanel } from "../../context/panel-context";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Controls from "./Controls";
import { Effects, Stats, useAnimations, useFBX } from "@react-three/drei";
import FlameMaterial from "../../Logic/Materials/Flame";
import { LevaInputs, useControls } from "leva";
//import { EffectComposer, Bloom, ToneMapping, SelectiveBloom } from "@react-three/postprocessing";
import BloomFX from "../../Logic/Passes/Bloom";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

extend({ EffectComposer, RenderPass, UnrealBloomPass });

export default function ModelGLB(props: any) {
	const { camera, gl, scene: _scene, size } = useThree();
	const ref = useRef<any>();
	const ref2 = useRef<any>();

	const resources = new Resources();
	const mats = new Materials({ resources, debug: false });
	const BLOOM_SCENE = 1;

	const scene = useFBX("./../models/f9.fbx");
	const [mixer] = useState(() => new THREE.AnimationMixer(scene));
	let flameMat = new FlameMaterial();
	let BloomF = new BloomFX(gl, _scene, _scene.getObjectByName("ortho"), size);

	const flame = useControls(
		"Bloom",
		{
			intensity: { value: 0.5, min: 0, max: 5, step: 0.01 },
			flameColor: { value: "red", type: LevaInputs.COLOR },
			vec3: { value: [600, 250, 0], type: LevaInputs.VECTOR3D },
			flameHeight: { value: 223, min: 222, max: 225, step: 0.01 },
			segment: { value: 45, min: 0, max: 500, type: LevaInputs.NUMBER },
			radius: { value: 0.4, min: 0, max: 5, step: 0.01 },
			rotateX: { value: -300, min: -360, max: 360, step: 10 },
		},
		{ collapsed: true }
	);
	BloomF.config = {
		bloomStrength: flame.intensity,
		bloomRadius: flame.radius,
	};
	var rotation = new THREE.Euler(flame.rotateX, 0, 0);
	useFrame((state, delta) => {
		gl.clear();
		camera.layers.enable(1);
		BloomF.updateIntensity(flame.intensity);
		scene.getObjectByName("flame")?.rotation.copy(rotation);
		flameMat.uniforms.time.value -= 0.008;
		flameMat.uniforms.color4.value = new THREE.Vector3(...flame.vec3);
		BloomF.render();
		camera.layers.enable(0); 
		mixer.update(0.01);
	}, 1);

	resources.on("ready", () => {
		scene.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				if (child.name.includes("white_plastic_falcon9")) {
					child.material = mats.items.plasticWhite;
				}
				if (child.name.includes("flame")) {
					child.layers.set(BLOOM_SCENE);

					ref2.current = child;
					let box = new THREE.CylinderGeometry(
						100,
						0,
						flame.flameHeight,
						flame.segment,
						flame.segment,
						true
					);
					child.rotation.copy(rotation);
					child.geometry = box;
					child.material = flameMat;
				}
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
		_scene.getObjectByName("flame")!.visible = true;
		scene.animations.forEach((clip) => {
			const action = mixer.clipAction(clip);
			action.setLoop(THREE.LoopOnce, 0);
			action.clampWhenFinished = true;
			action.play();
		});
		return () => scene.animations.forEach((clip) => mixer.uncacheClip(clip));
	}, [mixer]);

	const onFinish = () => {
		_scene.getObjectByName("flame")!.visible = false;
		mixer.removeEventListener("finished", onFinish);
	};
	mixer.addEventListener("finished", onFinish);

	return (
		<>
			<primitive object={new THREE.AxesHelper(2000)} />
			<primitive
				ref={ref}
				object={scene}
				scale={0.1}
				position={[0, 0, -27000]}
				rotation={[0, Math.PI / 2, 0]}
			></primitive>
			<Controls />
			<FloorComponent />
			<Stats />
		</>
	);
}
