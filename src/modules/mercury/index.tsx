import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";

import { useControls } from "leva";
import { state } from "../../context/panel-proxy";
import { useSnapshot } from "valtio";
import PlanetMaterial from "../../Logic/Materials/Planet";
import useWindowSize from "../../utils/useWindowSize";
import { addRotationControls } from "../mars/rotation.controls";

export default function ModelGLB(props: any) {
	const { enableAnimationLoop, playAnimation } = useSnapshot(state);
	const { camera, gl, scene: _scene } = useThree();
	gl.outputEncoding = THREE.sRGBEncoding;
	gl.toneMapping = THREE.NoToneMapping;
	
	const size = useWindowSize();
	const uStars = new THREE.TextureLoader().load(
		"../../texture/mars/8k_stars.jpg"
	);
	//uStars.encoding = THREE.sRGBEncoding;

	const uPlanet = new THREE.TextureLoader().load(
		"../../texture/mercury/2k_mercury.jpg"
	);
	//uPlanet.encoding = THREE.sRGBEncoding;

	const mercuryRef = useRef<any>();
	const pointRef = useRef<any>();

	const [mercury, set] = useControls(
		"Main",
		() => ({
			uSunIntensity: {label:"Sun Intensity", value: 0.9, min: 0, max: 5, step: 0.01 },
			uAmbientLight: {label:"Amb Light", value: 0.11, min: 0, max: 5, step: 0.01 },
			intensityPoint: { value: 1, min: 0, max: 6, step: 0.1 },
		}),

		{ collapsed: true }
	);
	const uniforms = useMemo(
		() => ({
			uSunIntensity: {value: mercury.uSunIntensity},
			uAtmosphereDensity: {value: 0.05},
			uAtmosphereColor: {value: [1, 1, 1]},
			uAmbientLight: {value: mercury.uAmbientLight},
			uRotationOffset: {value: 0.6},
			uRotationSpeed: { value: 0.1 },
			uTime: { value: 0 },
			uStars: { value: uStars },
			uPlanetColor: { value: uPlanet },
			uQuality: { value: Math.min(window.devicePixelRatio, 2) },
			uResolution: { value: [window.innerWidth, window.innerHeight] },
		}),
		[]
	);
	addRotationControls(uniforms, gl.domElement);
	let mercuryMat = new PlanetMaterial(uniforms);
	useFrame((state, delta) => {
		uniforms.uSunIntensity.value = mercury.uSunIntensity;
		uniforms.uAmbientLight.value = mercury.uAmbientLight;
		uniforms.uTime.value += playAnimation ? (uniforms.uRotationSpeed.value as number) * 0.1 : 0;
	});
	useEffect(() => {
		if (mercuryRef.current) {
			console.log("mercury ready");
			mercuryRef.current!.material = mercuryMat;
		}
	}, []);
	useEffect(() => {
		console.log(size);
		if (size.width != 0) {
			const quality = uniforms.uQuality.value;
			gl.setSize(size.width * quality, size.height * quality);
			uniforms.uResolution.value = [size.width, size.height];
		}
	}, [size]);
	const positions = new Float32Array(
		flatten([
			[0, 0, 0],
			[1, 0, 0],
			[0, 1, 0],
			[0, 1, 0],
			[1, 0, 0],
			[1, 1, 0],
		])
	);
	return (
		<>
			<mesh ref={mercuryRef}>
				<bufferGeometry>
					<float32BufferAttribute
						attach="attributes-position"
						array={positions}
						count={positions.length / 3}
						itemSize={3}
					/>
				</bufferGeometry>
			</mesh>
			{/* <Controls /> */}
		</>
	);
}

function flatten<T>(array: T[][]): T[] {
	return array.reduce((acc, val) => acc.concat(val), []);
}
