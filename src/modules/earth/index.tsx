import {
	useFrame,
	useLoader,
	useThree,
} from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

import { useControls } from "leva";
import { state } from "../../context/panel-proxy";
import { useSnapshot } from "valtio";
import Controls from "./Controls";

export default function ModelGLB(props: any) {
	const { enableAnimationLoop, playAnimation } = useSnapshot(state);
	const { camera, gl, scene: _scene, size } = useThree();
	gl.outputEncoding = THREE.sRGBEncoding;
	gl.toneMapping = THREE.NoToneMapping;
	const earthMat =  useLoader(THREE.TextureLoader, "../../texture/earth/earthmap1k.jpg");

	//earthMat.encoding = THREE.sRGBEncoding;

	const cloudMat = new THREE.TextureLoader().load(
		"../../texture/earth/earthCloud.png"
	);
	cloudMat.encoding = THREE.sRGBEncoding;

	const earthbumpMat = useLoader(THREE.TextureLoader, "../../texture/earth/earthbump.jpg");

	//earthbumpMat.encoding = THREE.sRGBEncoding;

	const ref = useRef<any>();
	const pointRef = useRef<any>();
	const starMesh = useRef<any>();
	const earthMesh = useRef<any>();
	const cloudMesh = useRef<any>();

	const [earth, set] = useControls(
		"Main",
		() => ({
			intensityAmbient: { value: 0.57, min: 0, max: 5, step: 0.01 },
			intensityPoint: { value: 1, min: 0, max: 6, step: 0.1 },
			bumpScale: { value: 3, min: 0, max: 6, step: 0.1 },
			x: { value: 0, min: 0, max: 2000, step: 50 },
			y: { value: 14000, min: 0, max: 50000, step: 1000 },
			z: { value: 0, min: 0, max: 2000, step: 50 },
		}),

		{ collapsed: true }
	);
	useFrame((state, delta) => {
		starMesh.current!.rotation.y -= 0.002;
		earthMesh.current!.rotation.y -= 0.0015;
		cloudMesh.current!.rotation.y -= 0.001;
	});
	return (
		<>
			<mesh ref={earthMesh} visible>
				<sphereGeometry args={[0.6, 32, 32]} />
				<meshPhongMaterial
					bumpScale={earth.bumpScale}
					bumpMap={earthbumpMat}
					map={earthMat}
				/>
			</mesh>
			<mesh ref={cloudMesh} visible>
				<sphereGeometry args={[0.63, 32, 32]} />
				<meshPhongMaterial map={cloudMat} transparent />
			</mesh>
			<mesh ref={starMesh} visible>
				<sphereGeometry args={[80, 64, 64]} />
				<meshBasicMaterial
					map={new THREE.TextureLoader().load("../../texture/earth/galaxy.png")}
					side={THREE.BackSide}
				/>
			</mesh>
			<ambientLight color={0xffffff} intensity={earth.intensityAmbient} />
			<pointLight
				ref={pointRef}
				position={[5, 3, 5]}
				color={0xffffff}
				intensity={earth.intensityPoint}
			/>
			<Controls target={new THREE.Vector3(earth.x, earth.y, earth.z)} />
			{/* */}
		</>
	);
}
