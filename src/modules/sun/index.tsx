"use client";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";

import { useControls } from "leva";
import { state } from "../../context/panel-proxy";
import { useSnapshot } from "valtio";
import PlanetMaterial from "../../Logic/Materials/Planet";
import useWindowSize from "../../utils/useWindowSize";
import vertexShaderPerlinCube from "raw-loader!glslify-loader!../../Logic/shaders/planet/perlinCube/perlinCube.vs.glsl";
import fragmentShaderPerlinCube from "raw-loader!glslify-loader!../../Logic/shaders/planet/perlinCube/perlinCube.fs.glsl";
import fragmentShaderSun from "raw-loader!glslify-loader!../../Logic/shaders/planet/sunSphere/sunSphere.fs.glsl";
import vertexShaderSun from "raw-loader!glslify-loader!../../Logic/shaders/planet/sunSphere/sunSphere.vs.glsl";

import fragmentShaderSunFlare from "raw-loader!glslify-loader!../../Logic/shaders/planet/sunFlares/sunFlares.fs.glsl";
import vertexShaderSunFlare from "raw-loader!glslify-loader!../../Logic/shaders/planet/sunFlares/sunFlares.vs.glsl";

import fragmentShaderSunGlow from "raw-loader!glslify-loader!../../Logic/shaders/planet/sunGlow/glow.fs.glsl";
import vertexShaderSunGlow from "raw-loader!glslify-loader!../../Logic/shaders/planet/sunGlow/glow.vs.glsl";

import fragmentShaderSunRay from "raw-loader!glslify-loader!../../Logic/shaders/planet/sunRays/sunRays.fs.glsl";
import vertexShaderSunRay from "raw-loader!glslify-loader!../../Logic/shaders/planet/sunRays/sunRays.vs.glsl";

import Controls from "./Controls";
import useTextures from "../../hooks/useTextures";
export default function ModelGLB(props: any) {
	const { enableAnimationLoop, playAnimation } = useSnapshot(state);
	const { camera, gl, scene: _scene } = useThree();
	gl.physicallyCorrectLights = true;
	gl.outputEncoding = THREE.sRGBEncoding;
	/* gl.toneMapping = THREE.NoToneMapping; */

	const size = useWindowSize();

	//uPlanet.encoding = THREE.sRGBEncoding;

	const pointRef = useRef<any>();

	/* 	useEffect(() => {
		console.log(size);
		if (size.width != 0) {
			const quality = uniforms.uQuality.value;
			gl.setSize(size.width * quality, size.height * quality);
			uniforms.uResolution.value = [size.width, size.height];
		}
	}, [size]); */

	return (
		<>
			<color attach="background" args={[0x000000]} />

			<SunSphere />
			<BG />
			<Controls />
		</>
	);
}

const SunSphere = () => {
	const { scene, gl, camera } = useThree();
	const sunSphereRef = useRef<THREE.Mesh>();
	const sunRef = useRef<THREE.Group>();

	const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
		format: THREE.RGBAFormat,
		generateMipmaps: true,
		encoding: THREE.sRGBEncoding,
		minFilter: THREE.LinearMipmapLinearFilter,
	});

	const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget);
	const [sun, set] = useControls(
		"Sun Sphere",
		() => ({
			uTint: { value: 0.3, min: 0, max: 6, step: 0.1 },
			uBrightness: { value: 0.3, min: 0, max: 2, step: 0.1 },
			uBrightnessOffset: { value: 1.3, min: 0, max: 2, step: 0.1 },
			uFresnelPower: { value: 1, min: 0, max: 2, step: 0.1 },
			uFresnelInfluence: { value: 1.4, min: 0, max: 3, step: 0.1 },
			uBase: { value: 3.5, min: 0, max: 8, step: 0.1 },

			uVisibility: { value: 0.6, min: 0, max: 2, step: 0.1 },
			uLightView: { x: 0, y: 0, z: 0 },
			uDirection: { value: 0.6, min: 0, max: 2, step: 0.1 },
		}),

		{ collapsed: true }
	);
	const uniforms = useMemo(
		() => ({
			uDirection: { value: 0.5 },
			uLightView: { value: new THREE.Vector3() },
			uVisibility: { value: 0.5 },

			uTime: { value: 0.1 },
			uPerlinCube: { value: new THREE.CubeTexture() },
			uFresnelPower: { value: 1 },
			uFresnelInfluence: { value: 1.2 },
			uTint: { value: 0.26 },
			uBase: { value: 4 },
			uBrightnessOffset: { value: 1 },
			uBrightness: { value: 0.6 },
			uCamPos: { value: new THREE.Vector3() },
		}),
		[]
	);

	useFrame(() => {
		uniforms.uDirection.value = sun.uDirection;
		uniforms.uLightView.value = new THREE.Vector3(
			sun.uLightView.x,
			sun.uLightView.y,
			sun.uLightView.z
		);
		uniforms.uVisibility.value = sun.uVisibility;

		//uniforms.uCamPos.value = camera.position;
		uniforms.uPerlinCube.value = cubeCamera.renderTarget.texture;
		uniforms.uTime.value += 0.05;
		uniforms.uFresnelPower.value = sun.uFresnelPower;
		uniforms.uBrightnessOffset.value = sun.uBrightnessOffset;
		uniforms.uBase.value = sun.uBase;
		uniforms.uTint.value = sun.uTint;
		uniforms.uFresnelInfluence.value = sun.uFresnelInfluence;

		if (sunSphereRef.current) {
			//sunSphereRef.current.rotation.y += 0.005;
			sunSphereRef.current.visible = false;
			cubeCamera.update(gl, scene);
			sunSphereRef.current.visible = true;
		}
		if (sunRef.current) {
			sunRef.current.rotation.y += 0.0005;
		}
	});
	return (
		<>
			<SunGlow
				uVisibility={sun.uVisibility}
				uDirection={sun.uDirection}
				uLightView={sun.uLightView}
			/>
			<group ref={sunRef as any}>
				<PerlinCube />

				<mesh ref={sunSphereRef as any}>
					<sphereGeometry args={[2, 30, 30]} />
					<shaderMaterial
						transparent={false}
						depthWrite
						blending={THREE.NormalBlending}
						side={THREE.DoubleSide}
						wireframe={false}
						uniforms={uniforms}
						vertexShader={vertexShaderSun}
						fragmentShader={fragmentShaderSun}
					/>
				</mesh>
			</group>
		</>
	);
};

const PerlinCube = () => {
	const PerlinRef = useRef<any>();
	const { camera, gl, scene: _scene } = useThree();
	const [per, set] = useControls(
		"Perlin",
		() => ({
			uTemporalFrequency: { value: 0.1, min: 0, max: 2, step: 0.1 },
			uContrast: { value: 0.25, min: 0, max: 2, step: 0.1 },
			uH: { value: 0.8, min: 0, max: 2, step: 0.1 },
			uFlatten: { value: 0.72, min: 0, max: 2, step: 0.1 },
			uSpatialFrequency: { value: 6, min: 0, max: 8, step: 0.1 },
		}),

		{ collapsed: true }
	);
	const uniforms = useMemo(
		() => ({
			uSpatialFrequency: { value: 6 },
			uFlatten: { value: 0.72 },
			uContrast: { value: 0.25 },
			uH: { value: 0.8 },
			uTemporalFrequency: { value: 0.1 },
			uTime: { value: 0 },
		}),
		[]
	);

	//let sunMat = new PlanetMaterial(uniforms);
	useFrame((state, delta) => {
		uniforms.uTime.value += 0.05;
		uniforms.uTemporalFrequency.value = per.uTemporalFrequency;
		uniforms.uContrast.value = per.uContrast;
		uniforms.uH.value = per.uH;
		uniforms.uFlatten.value = per.uFlatten;
		uniforms.uSpatialFrequency.value = per.uSpatialFrequency;
	});
	useEffect(() => {
		if (PerlinRef.current) {
			console.log("PerlinCube ready");
			//sunRef.current!.material = sunMat;
		}
	}, []);
	return (
		<>
			<mesh ref={PerlinRef}>
				<sphereGeometry args={[2, 30, 30]} />
				<shaderMaterial
					side={THREE.DoubleSide}
					transparent
					wireframe={false}
					uniforms={uniforms}
					vertexShader={vertexShaderPerlinCube}
					fragmentShader={fragmentShaderPerlinCube}
				/>
			</mesh>
		</>
	);
};

/* const SunFlares = ({ uVisibility, uDirection, uLightView }: any) => {
	const flareRef = useRef<any>();
	const { camera, gl, scene: _scene } = useThree();
	const [flare, set] = useControls(
		"flare",
		() => ({
			uAlphaBlended: { value: 0.65, min: 0, max: 2, step: 0.1 },
			uHueSpread: { value: 0.16, min: 0, max: 2, step: 0.1 },
			uHue: { value: 0, min: 0, max: 2, step: 0.1 },
			uNoiseFrequency: { value: 4, min: 0, max: 8, step: 0.1 },
			uWidth: { value: 0.05, min: 0, max: 0.05, step: 0.001 },
			uOpacity: { value: 0.3, min: 0, max: 1, step: 0.01 },
			uNoiseAmplitude: { value: 0.2, min: 0, max: 2, step: 0.1 },
			uAmp: { value: 0.5, min: 0, max: 2, step: 0.1 },
		}),

		{ collapsed: true }
	);

	const uniforms = useMemo(
		() => ({
			uDirection: { value: 0.5 },
			uLightView: { value: new THREE.Vector3() },
			uVisibility: { value: 0.5 },

			uAmp: { value: 0.5 },
			uCamPos: { value: new THREE.Vector3() },
			uNoiseAmplitude: { value: 0.5 },
			uOpacity: { value: 0.5 },
			uAlphaBlended: { value: 0.5 },
			uWidth: { value: 0.72 },
			uNoiseFrequency: { value: 0.25 },
			uHue: { value: 0.8 },
			uHueSpread: { value: 0.1 },
			uTime: { value: 0 },
		}),
		[]
	);
	useFrame((state, delta) => {
		uniforms.uVisibility.value =  uVisibility;
		uniforms.uDirection.value = uDirection;
		uniforms.uLightView.value = new THREE.Vector3(
			uLightView.x,
			uLightView.y,
			uLightView.z
		);

		uniforms.uTime.value += 0.05;
		uniforms.uCamPos.value = camera.position;
		uniforms.uAmp.value = flare.uAmp;
		uniforms.uNoiseAmplitude.value = flare.uNoiseAmplitude;
		uniforms.uOpacity.value = flare.uOpacity;
		uniforms.uAlphaBlended.value = flare.uAlphaBlended;
		uniforms.uWidth.value = flare.uWidth;
		uniforms.uNoiseFrequency.value = flare.uNoiseFrequency;
		uniforms.uHue.value = flare.uHue;
		uniforms.uHueSpread.value = flare.uHueSpread;
	});
	useEffect(() => {
		if (flareRef.current) {
			console.log("flare ready");
			//sunRef.current!.material = sunMat;
		}
	}, []);
	const e = 1024;
	const t = 4;
	return (
		<>
			<mesh ref={flareRef}>
		 <sphereGeometry args={[2.5, 30, 30]} />
			
				<shaderMaterial
					side={THREE.BackSide}
					transparent
					blending={THREE.MultiplyBlending}
					wireframe={false}
					uniforms={uniforms}
					vertexShader={vertexShaderSunFlare}
					fragmentShader={fragmentShaderSunFlare}
				/>
			</mesh>
		</>
	);
} */
const SunGlow = ({ uVisibility, uDirection, uLightView }: any) => {
	const glowRef = useRef<any>();
	const { camera, gl, scene: _scene } = useThree();
	const [glow, set] = useControls(
		"glow",
		() => ({
			uTint: { value: 0.46, min: 0, max: 2, step: 0.1 },
			uBrightness: { value: 0.8, min: 0, max: 2, step: 0.1 },

			/* uVisibility: { value: 0.6, min: 0, max: 2, step: 0.1 },
			uLightView:{x:0,y:0,z:0},
			uDirection: { value: 0.6, min: 0, max: 2, step: 0.1 }, */

			uFalloffColor: { value: 0.2, min: 0, max: 2, step: 0.1 },
			uRadius: { value: 0.4, min: 0, max: 2, step: 0.1 },
		}),

		{ collapsed: true }
	);

	const uniforms = useMemo(
		() => ({
			uCamUp: { value: camera.up },
			uCamPos: { value: camera.position },
			uTint: { value: 0.46 },

			uDirection: { value: 0.5 },
			uLightView: { value: new THREE.Vector3() },
			uVisibility: { value: 0.5 },

			uBrightness: { value: 0.0 },
			uFalloffColor: { value: 0.2 },
			uRadius: { value: 0.4 },
		}),
		[]
	);

	useFrame((state, delta) => {
		uniforms.uCamUp.value.copy(camera.up);
		uniforms.uCamPos.value.copy(camera.position);
		uniforms.uTint.value = glow.uTint;
		uniforms.uFalloffColor.value = glow.uFalloffColor;
		uniforms.uRadius.value = glow.uRadius;
		uniforms.uBrightness.value = glow.uBrightness;
		uniforms.uVisibility.value = uVisibility;
		uniforms.uDirection.value = uDirection;
		uniforms.uLightView.value = new THREE.Vector3(
			uLightView.x,
			uLightView.y,
			uLightView.z
		);
	});
	useEffect(() => {
		if (glowRef.current) {
			console.log("glow ready");
		}
	}, []);
	return (
		<>
			<mesh ref={glowRef}>
				<sphereGeometry args={[2.2, 30, 30]} />
				<shaderMaterial
					side={THREE.BackSide}
					transparent
					depthTest
					wireframe={false}
					uniforms={uniforms}
					vertexShader={vertexShaderSunGlow}
					fragmentShader={fragmentShaderSunGlow}
				/>
			</mesh>
		</>
	);
};

/* const SunRays = ({ uVisibility, uDirection, uLightView }: any) => {
	const rayRef = useRef<any>();
	const { camera, gl, scene: _scene } = useThree();
	const [ray, set] = useControls(
		"ray",
		() => ({
			
			uLength: { value: 0.5, min: 0, max: 10, step: 0.1 },

			uAlphaBlended: { value: 0.65, min: 0, max: 2, step: 0.1 },
			uHueSpread: { value: 0.16, min: 0, max: 2, step: 0.1 },
			uHue: { value: 0, min: 0, max: 2, step: 0.1 },
			uNoiseFrequency: { value: 4, min: 0, max: 8, step: 0.1 },
			uWidth: { value: 0.05, min: 0, max: 0.05, step: 0.001 },
			uOpacity: { value: 0.3, min: 0, max: 1, step: 0.01 },
			uNoiseAmplitude: { value: 0.2, min: 0, max: 2, step: 0.1 },
			uAmp: { value: 0.5, min: 0, max: 2, step: 0.1 },
		}),

		{ collapsed: true }
	);
	const uniforms = useMemo(
		() => ({
			uDirection: { value: 0.5 },
			uLightView: { value: new THREE.Vector3() },
			uVisibility: { value: 0.5 },
			
			uCamPos: { value: new THREE.Vector3() },
			uHueSpread: { value: 0.5 },
			uNoiseAmplitude: { value: 0.5 },
			uWidth: { value: 0.5 },
			uAlphaBlended: { value: 0.5 },
			uNoiseFrequency: { value: 0.25 },
			uHue: { value: 0.8 },
			uLength: { value: 8 },
			uOpacity: { value: 0.1 },
			uTime: { value: 0 },
		}),
		[]
	);
	useFrame((state, delta) => {
		uniforms.uVisibility.value =  uVisibility;
		uniforms.uDirection.value =  uDirection;
		uniforms.uLightView.value = new THREE.Vector3(
			uLightView.x,
			uLightView.y,
			uLightView.z
		);
        uniforms.uCamPos.value = camera.position;
		uniforms.uTime.value += 0.05;
		uniforms.uOpacity.value = ray.uOpacity;
		uniforms.uHueSpread.value = ray.uHueSpread;
		uniforms.uNoiseAmplitude.value = ray.uNoiseAmplitude;
		uniforms.uLength.value = ray.uLength;
		uniforms.uWidth.value = ray.uWidth;
		uniforms.uAlphaBlended.value = ray.uAlphaBlended;
		uniforms.uNoiseFrequency.value = ray.uNoiseFrequency;
		uniforms.uHue.value = ray.uHue;
	});
	useEffect(() => {
		if (rayRef.current) {
			console.log("ray ready");
			//sunRef.current!.material = sunMat;
		}
	}, []);
	const e = 1024;
	const t = 4;
	return (
		<>
			<mesh ref={rayRef}>
				
				<bufferGeometry>
					<bufferAttribute
					args={[new Uint16Array(e * (t - 1) * 2 * 3),1]}
						attach="index"
					/>
					<bufferAttribute
					name="attributes-position"
						attach="aPos"
						count={1024}
						array={new Float32Array(e * t * 2 * 3)}
						itemSize={3}
					/>
					<bufferAttribute
					name="attributes-position"
						attach="aPos0"
						count={1024}
						array={new Float32Array(e * t * 2 * 3)}
						itemSize={3}
					/>
					<bufferAttribute
					name="attributes-position"
						attach="aWireRandom"
						count={1024}
						array={new Float32Array(e * t * 2 * 4)}
						itemSize={4}
					/>
				</bufferGeometry>
				<shaderMaterial
					side={THREE.DoubleSide}
					transparent
					blending={THREE.MultiplyBlending}
					wireframe={false}
					uniforms={uniforms}
					vertexShader={vertexShaderSunRay}
					fragmentShader={fragmentShaderSunRay}
				/>
			</mesh>
		</>
	);
} */

const BG = () => {
	const paths = useMemo(() => ["../../texture/mars/8k_stars.jpg"], []);

	const [textures, isLoading] = useTextures(paths, (loadedTextures) => {
		console.log("All textures are loaded");
	});
	const [uStars] = textures;
	const starsRef = useRef<any>();
	const uniforms = useMemo(
		() => ({
			uRotationOffset: { value: 0.6 },
			uRotationSpeed: { value: 0.1 },
			uTime: { value: 0 },
			uStars: { value: uStars },
			uQuality: { value: Math.min(window.devicePixelRatio, 2) },
			uResolution: { value: [window.innerWidth, window.innerHeight] },
		}),
		[uStars]
	);
	useFrame((state) => {
		if (starsRef.current) {
			starsRef.current.rotation.y += 0.0001;
		}
	});

	return (
		<>
			{isLoading ? (
				<color attach="background" args={[0x000000]} />
			) : (
				<mesh rotation={[0, 0, 0, "XZY"]} ref={starsRef} renderOrder={1000}>
					<sphereGeometry args={[500, 60, 60]} />
					<shaderMaterial
						side={THREE.BackSide}
						glslVersion={THREE.GLSL3}
						wireframe={false}
						uniforms={uniforms}
						vertexShader={`varying vec2 vUV;

						void main() {
						  vUV = uv;
						  vec4 pos = vec4(position, 1.0);
						  gl_Position = projectionMatrix * modelViewMatrix * pos;
						}`}
						fragmentShader={`uniform sampler2D uStars;
						in vec2 vUV;
						out vec4 fragColor;
						
						void main() {
						  vec4 sampleX = texture(uStars, vUV);
						  fragColor = vec4(sampleX.xyz, sampleX.w);
						
						}`}
					/>
				</mesh>
			)}
		</>
	);
};
