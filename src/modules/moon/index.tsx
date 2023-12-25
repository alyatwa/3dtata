import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";

import { useControls } from "leva";
import { state } from "../../context/panel-proxy";
import { useSnapshot } from "valtio";
import PlanetMaterial from "../../Logic/Materials/Planet";
import useWindowSize from "../../utils/useWindowSize";
import { addRotationControls } from "../mars/rotation.controls";
import useTextures from "../../hooks/useTextures";
import { useDynamicStates } from "../../components/Panel";

export default function ModelGLB(props: any) {
	const { enableAnimationLoop, playAnimation } = useSnapshot(state);
	const { camera, gl, scene: _scene } = useThree();
	gl.outputEncoding = THREE.sRGBEncoding;
	gl.toneMapping = THREE.NoToneMapping;
	const { stateP } = useDynamicStates({
		play: {
			type: "playButton",
			value: true,
			label: "Play",
		},
	});
	const size = useWindowSize();
	const paths = useMemo(
		() => ["../../texture/mars/8k_stars.jpg", "../../texture/moon/2k_moon.jpg"],
		[]
	);

	const [textures, isLoading] = useTextures(paths, (loadedTextures) => {
		console.log("All textures are loaded");
	});
	const [uStars, uPlanet] = textures;
 

	const moonRef = useRef<any>();
	const pointRef = useRef<any>();

	const [moon, set] = useControls(
		"Main",
		() => ({
			uAmbientLight: {
				label: "Ambient Light",
				value: 0.11,
				min: 0,
				max: 5,
				step: 0.01,
			},
			intensityPoint: { value: 1, min: 0, max: 6, step: 0.1 },
			planetRadius: { value: 2, min: 1, max: 6, step: 0.5 },
			x: { value: 0, min: 0, max: 2000, step: 50 },
			y: { value: 14000, min: 0, max: 50000, step: 1000 },
			z: { value: 0, min: 0, max: 2000, step: 50 },
		}),

		{ collapsed: true }
	);
	const uniforms = useMemo(
		() => ({
			uSunIntensity: { value: 3 },
			uAtmosphereDensity: { value: 0.05 },
			uAtmosphereColor: { value: [1, 1, 1] },
			uAmbientLight: { value: moon.uAmbientLight },
			uRotationOffset: { value: 0.6 },
			uRotationSpeed: { value: 0.1 },
			uTime: { value: 0 },
			uStars: { value: uStars },
			uPlanetColor: { value: uPlanet },
			uQuality: { value: Math.min(window.devicePixelRatio, 2) },
			uResolution: { value: [window.innerWidth, window.innerHeight] },
		}),
		[textures]
	);
	addRotationControls(uniforms, gl.domElement);
	let moonMat = new PlanetMaterial(uniforms);
	useFrame((state, delta) => {
		uniforms.uAmbientLight.value = moon.uAmbientLight;
		uniforms.uTime.value +=
			stateP.play?.value ?? true
				? (uniforms.uRotationSpeed.value as number) * 0.1
				: 0;
	});
	useEffect(() => {
		if (moonRef.current) {
			console.log("moon ready");
			moonRef.current!.material = moonMat;
		}
	}, [textures]);
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
			<mesh ref={moonRef}>
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
