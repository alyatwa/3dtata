'use client';
import { useLoader, useThree } from "@react-three/fiber";
import Resources from "../../Logic/Resources";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Materials from "../../Logic/World/Materials";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ReactElement, memo, useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import returnCurve from "./data/curves/ReturnCurve.json";
import inCurve from "./data/curves/InCurve.json";
import outCurve from "./data/curves/OutCurve.json";
import { createCurveFromJSON } from "../../Logic/Utils/CurveMethods";
import FloorComponent from "../../Logic/World/FloorComponent";
import data from "./data/annotation.json";
import { usePanel } from "../../context/panel-context";
import React from "react";
import Annotations from "../../components/Annotations";
import Controls from "./Controls";

export default function ModelGLB(props: any) {
	const { viewParticles } = usePanel();
	const { camera, gl, scene: _scene } = useThree();
	const resources = new Resources();
	const mats = new Materials({ resources, debug: false });

	const ref = useRef<any>();

	const { scene, nodes } = useLoader(
		GLTFLoader,
		"./../models/ahu.glb",
		(loader) => {
			const dracoLoader = new DRACOLoader();
			dracoLoader.setDecoderPath("/gltf/");
			loader.setDRACOLoader(dracoLoader);
		}
	);

	useFrame(({ clock }) => {
		if (ref.current) {
			ref.current.children.find(
				(x: { name: string }) => x.name == "steel_fan2"
			).rotation.z += 0.04;
			ref.current.children.find(
				(x: { name: string }) => x.name == "steel_fan"
			).rotation.z += 0.04;
		}
	});

	resources.on("ready", () => {
		/*  scene.traverse((object) => {
		if (object instanceof THREE.Mesh ) {
			const textureDetails = resources.items.bakeTexture as THREE.Texture
			textureDetails.flipY=false
			console.log(textureDetails)
	 let materialMudacDetails = new THREE.MeshBasicMaterial({ map: textureDetails })
		  object.material = materialMudacDetails; 
		}
	  }); */
		scene.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				if (child.name.includes("steel") || child.name.includes("blade")) {
					child.material = mats.items.metal;
				}

				if (child.name.includes("copper")) {
					child.material = mats.items.copper;
				}
				if (child.name.includes("blue")) {
					child.material = mats.items.blue;
				}
				if (child.name.includes("white_plastic")) {
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
					child.castShadow = false;
				}
				if (child.name.includes("whitesteel_body")) {
					child.material = mats.items.white;
				}
			}
		});
		console.log("ready");
	});

	return (
		<>
			{viewParticles && (
				<>
					<Particles
						clockwise={true}
						color1="orange"
						color2="orange"
						curvePath={outCurve}
						mat={mats}
						speed={0.18}
						maxOffset={1.3}
						totalParticles={150}
					/>
					<Particles
						clockwise={false}
						color1="blue"
						color2="red"
						curvePath={inCurve}
						mat={mats}
						speed={0.18}
						maxOffset={1.3}
						totalParticles={150}
					/>
					<Particles
						clockwise={false}
						color1="blue"
						color2="orange"
						curvePath={returnCurve}
						mat={mats}
						speed={0.15}
						maxOffset={1.3}
						totalParticles={150}
					/>
				</>
			)}

			<primitive ref={ref} object={scene}>
				<Annotations scene={scene} data={data} />
			</primitive>
<Controls/>
			<FloorComponent />
		</>
	);
}

const Particles = ({
	mat,
	speed,
	maxOffset,
	totalParticles,
	curvePath,
	color1,
	color2,
	clockwise,
}: {
	totalParticles: number;
	maxOffset: number;
	mat: Materials;
	speed: number;
	curvePath: any;
	color1: string;
	color2: string;
	clockwise: boolean;
}) => {
	const length = 20;
	const PointOnCurve = new CustomCurve(
		1,
		length,
		createCurveFromJSON(curvePath)
	);
	const material = mat.pures.items.blue;
	const positions = new Float32Array(totalParticles * 3);
	const colors = new Float32Array(totalParticles * 3);
	let color = new THREE.Color("red").convertLinearToSRGB();
	const geometry = new THREE.BufferGeometry();
	const geometryL = new THREE.BufferGeometry();
	const offsets = new Float32Array(totalParticles * 3);

	for (let i = 0; i < totalParticles; i++) {
		const xOffset = (Math.random() - 0.5) * maxOffset;
		const zOffset = (Math.random() - 0.5) * maxOffset;
		offsets[i * 2] = xOffset;
		offsets[i * 2 + 1] = zOffset;

		colors[i * 3] = color.r; // Red component
		colors[i * 3 + 1] = color.g; // Green component
		colors[i * 3 + 2] = color.b;
	}
	geometryL.setFromPoints(PointOnCurve.getPoints(50));
	geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
	geometry.setAttribute("offset", new THREE.BufferAttribute(offsets, 3));

	useFrame(({ clock }) => {
		const time = clock.getElapsedTime();
		// @ts-ignore
		const offsetsArray = geometry.attributes.offset.array;
		for (let i = 0; i < totalParticles; i++) {
			let t = clockwise
				? (i / totalParticles) * (i + time * speed)
				: 1 - (((i / totalParticles) * (i + time * speed)) % 1);
			if (t > 1) {
				t = t % 1;
			}

			const point = PointOnCurve.getPoint(t);

			const offsetX = offsetsArray[i * 2];
			const offsetY = offsetsArray[i * 2 + 1];
			const offsetZ = offsetsArray[i * 2 + 2];

			if (
				positions[i * 3 + 2] <= 0.5 &&
				positions[i * 3 + 2] <= -0.4 &&
				positions[i * 3 + 1] < 3.4
			) {
				color = new THREE.Color(color1).convertLinearToSRGB();
				colors[i * 3] = color.r;
				colors[i * 3 + 1] = color.g;
				colors[i * 3 + 2] = color.b;
			} else {
				color = new THREE.Color(color2).convertLinearToSRGB();
				colors[i * 3] = color.r;
				colors[i * 3 + 1] = color.g;
				colors[i * 3 + 2] = color.b;
			}

			positions[i * 3] = point.x + offsetX;
			positions[i * 3 + 1] = point.y + offsetY;
			positions[i * 3 + 2] = point.z + offsetZ;

			// Check if particle reached the end point of the curve
			if (t >= 1) {
				// Move the particle back to the start point instantly
				positions[i * 3] = PointOnCurve.getPoint(0).x + offsetX;
				positions[i * 3 + 1] = PointOnCurve.getPoint(0).y + offsetY;
				positions[i * 3 + 2] = PointOnCurve.getPoint(0).z + offsetZ;
			}
		}
		geometry.attributes.position.needsUpdate = true;
		geometry.attributes.color.needsUpdate = true;
	});

	return (
		<>
			{/*   <line ref={Line}>
        <bufferGeometry  attach="geometry" attributes={{ position: geometryL.attributes.position}} />
        <lineBasicMaterial attach="material" color={0xff0000} />
		<Html distanceFactor={10}>
        <div className="content">
          hello <br /> world
        </div>
      </Html>
      </line>  */}
			<points args={[geometry, material]} />
		</>
	);
};

class CustomCurve extends THREE.Curve<THREE.Vector3> {
	scale: number;
	length: number;
	rotation: any;
	curve: THREE.CatmullRomCurve3;
	constructor(scale = 0, length = 10, curveJSON: THREE.CatmullRomCurve3) {
		super();
		this.scale = scale;
		this.length = length;
		this.curve = curveJSON;
	}

	getPoint(t: number) {
		const pointOnCurve = this.curve.getPoint(t);
		const point = pointOnCurve.multiplyScalar(this.scale);
		return point;
	}
}
