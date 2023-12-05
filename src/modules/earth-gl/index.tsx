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
	//gl.outputEncoding = THREE.sRGBEncoding;
	gl.toneMapping = THREE.NoToneMapping;
	
	const size = useWindowSize();
	const uStars = new THREE.TextureLoader().load(
		"../../texture/mars/8k_stars.jpg"
	);
	//uStars.encoding = THREE.sRGBEncoding;

	const uEarthColor = new THREE.TextureLoader().load(
		"../../texture/earth-gl/2k_earth_color.jpg"
	);
	
	const uEarthBump = new THREE.TextureLoader().load(
		"../../texture/earth-gl/2k_earth_bump.jpg"
	);
	const uEarthClouds = new THREE.TextureLoader().load(
		"../../texture/earth-gl/2k_earth_clouds.jpg"
	);
	const uEarthSpecular = new THREE.TextureLoader().load(
		"../../texture/earth-gl/2k_earth_specular.jpg"
	);
	const uEarthNight = new THREE.TextureLoader().load(
		"../../texture/earth-gl/2k_earth_night.jpg"
	);
	//uPlanet.encoding = THREE.sRGBEncoding;

	const earthRef = useRef<any>();
	const pointRef = useRef<any>();

	const [earth, set] = useControls(
		"Main",
		() => ({
			uAmbientLight: {label:"Amb Light", value: 0.05, min: 0, max: 5, step: 0.001 },
			uSunIntensity: {label:"Sun Intensity", value: 1, min: 0, max: 5, step: 0.01 },
			uCloudsScale: {label:"Clouds Scale", value: -1, min: -1, max: 5, step: 0.1 },
			uCloudsSpeed: {label:"Clouds Speed", value: -1, min: -1, max: 5, step: 0.1 },
			uCloudsDensity: {label:"Clouds density", value: 0.3, min: 0.1, max: 1, step: 0.01 },
			uAtmosphereDensity: {label:"Atmo density", value: 0.3, min: 0.1, max: 5, step: 0.1 },
		}),

		{ collapsed: true }
	);
	const uniforms = useMemo(
		() => ({
		 uCloudsSpeed: {value:earth.uCloudsSpeed},
		 uCloudsScale: {value: earth.uCloudsScale},
		 uCloudsDensity: {value: earth.uCloudsDensity},
			uSunIntensity: {value: 3},
			uBumpStrength: {value: 0.005},
			uAtmosphereDensity: {value: earth.uAtmosphereDensity},
			uAtmosphereColor: {value: [0.05, 0.3, 0.9]},
			uAmbientLight: {value: earth.uAmbientLight},
			uRotationOffset: {value: 0.6},
			uRotationSpeed: { value: 0.1 },
			uTime: { value: 0 },
			uStars: { value: uStars },
			uEarthSpecular: { value: uEarthSpecular },
			uEarthClouds: { value: uEarthClouds },
			uEarthNight: { value: uEarthNight },
			uEarthColor: { value: uEarthColor },
			uEarthBump: { value: uEarthBump },
			uQuality: { value: Math.min(window.devicePixelRatio, 2) },
			uResolution: { value: [window.innerWidth, window.innerHeight] },
		}),
		[]
	);
	addRotationControls(uniforms, gl.domElement);
	let earthMat = new PlanetMaterial(uniforms, true);
	useFrame((state, delta) => {
		uniforms.uAtmosphereDensity.value = earth.uAtmosphereDensity;
		uniforms.uCloudsDensity.value = earth.uCloudsDensity;
		uniforms.uCloudsSpeed.value = earth.uCloudsSpeed;
		uniforms.uCloudsScale.value = earth.uCloudsScale;
		uniforms.uSunIntensity.value = earth.uSunIntensity;
		uniforms.uAmbientLight.value = earth.uAmbientLight;
		uniforms.uTime.value += playAnimation ? (uniforms.uRotationSpeed.value as number) * 0.1 : 0;
	});
	useEffect(() => {
		if (earthRef.current) {
			console.log("earth ready");
			earthRef.current!.material = earthMat;
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
			<mesh ref={earthRef}>
				<bufferGeometry>
					<float32BufferAttribute
						attach="attributes-position"
						array={positions}
						count={positions.length / 3}
						itemSize={3}
					/>
				</bufferGeometry>
			</mesh> 
		</>
	);
}

function flatten<T>(array: T[][]): T[] {
	return array.reduce((acc, val) => acc.concat(val), []);
}
