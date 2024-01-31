"use client"
import {
	useFrame,
	useGraph,
	useLoader,
	useThree,
	extend,
} from "@react-three/fiber";
import Resources from "../../Logic/Resources";
import Materials from "../../Logic/World/Materials";
import * as THREE from "three";
import FloorComponent from "../../Logic/World/FloorComponent";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Controls from "./Controls";
import { Effects, Stats, useAnimations, useFBX } from "@react-three/drei";
import FlameMaterial from "../../Logic/Materials/Flame";
import { LevaInputs, folder, useControls } from "leva";
import BloomFX from "../../Logic/Passes/Bloom";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { state } from "../../context/panel-proxy";
import { useSnapshot } from "valtio";

extend({ EffectComposer, RenderPass, UnrealBloomPass });

export default function ModelGLB(props: any) {
	const { enableAnimationLoop, playAnimation } = useSnapshot(state);
	const { camera, gl, scene: _scene, size } = useThree();
	const currentScene = useRef<string>('animation');

	const ref = useRef<any>();
	const ref2 = useRef<any>();

	const resources = new Resources();
	const mats = new Materials({ resources, debug: false });
	const BLOOM_SCENE = 1;

	const scene = useFBX("./../../models/f9.fbx");
	const [mixer] = useState(() => new THREE.AnimationMixer(scene));
	let flameMat = new FlameMaterial();
	let BloomF = new BloomFX(gl, _scene, _scene.getObjectByName("ortho"), size);

	const [flame, set] = useControls(
		"Main",
		() => ({
			intensity: { value: 0.5, min: 0, max: 5, step: 0.01 },
			flameColor: { value: "red", type: LevaInputs.COLOR },
			vec3: { value: [600, 250, 0], type: LevaInputs.VECTOR3D },
			flameHeight: { value: 223, min: 222, max: 225, step: 0.01 },
			segment: { value: 45, min: 0, max: 500, type: LevaInputs.NUMBER },
			radius: { value: 0.4, min: 0, max: 5, step: 0.01 },
			rotateX: { value: -300, min: -360, max: 360, step: 10 },
			x: { value: 0, min: 0, max: 2000, step: 50 },
			y: { value: 14000, min: 0, max: 50000, step: 1000 },
			z: { value: 0, min: 0, max: 2000, step: 50 },
		}),

		{ collapsed: true }
	);

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
		if (playAnimation) {
			mixer.update(0.01);
		}
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

		console.log("ready");
	});

	useEffect(() => {
		startAnimations();
	}, [mixer, enableAnimationLoop]);

	useEffect(() => {
		console.log('currentScene: ', currentScene.current)
		console.log('playAnimation: ', playAnimation)
		if (currentScene.current == 'zoom') {
			onFinish(true)
			ref.current.position.z = -27000;
			set({ y: 14000 });
			camera.zoom = 0.02;
			
		} else{
		//startAnimations()
	}
	}, [mixer, playAnimation]);

	const startAnimations = () => {
		mixer.stopAllAction();
		_scene.getObjectByName("flame")!.visible = true;
		scene.animations.forEach((clip) => {
			const action = mixer.clipAction(clip);
			action.reset();
			action.setLoop(
				enableAnimationLoop ? THREE.LoopRepeat : THREE.LoopOnce,
				enableAnimationLoop ? 1000 : 0
			);
			action.clampWhenFinished = true;
			action.play();
		});
		mixer.update(0.01);
		return () => scene.animations.forEach((clip) => mixer.uncacheClip(clip));
	};

	const onFinish = (reset?: boolean) => {
		_scene.getObjectByName("flame")!.visible = false;
		if (!enableAnimationLoop || reset) {
			state.playAnimation = false;
			_scene.getObjectByName("flame")!.visible = true;
			mixer.stopAllAction();
		}
		mixer.removeEventListener("finished", () => onFinish());
	};

	mixer.addEventListener("finished", () => onFinish());
	const onModelClick = () => {
		currentScene.current =='zoom'? currentScene.current = 'animation': currentScene.current ='zoom';
		onFinish(true);
		state.playAnimation = false;
		if (currentScene.current == 'zoom') {
			ref.current.position.z = 0;
			set({ y: 4500 });
			camera.zoom = 0.07;
		} else {
			ref.current.position.z = -27000;
			set({ y: 14000 });
			camera.zoom = 0.02;
			startAnimations()
		}
	};
	return (
		<>
			<primitive
				onPointerOver={() => (document.body.style.cursor = "pointer")}
				onPointerOut={() => (document.body.style.cursor = "auto")}
				onClick={() => {
					onModelClick();
				}}
				ref={ref}
				object={scene}
				scale={0.1}
				position={[0, 0, -27000]}
				rotation={[0, Math.PI / 2, 0]}
			></primitive>
			<Controls target={new THREE.Vector3(flame.x, flame.y, flame.z)} />
			<FloorComponent />
			{/* <primitive object={new THREE.AxesHelper(2000)} />
				<Stats /> */}
		</>
	);
}
