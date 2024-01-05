import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";

import { useControls } from "leva";
import { state } from "../../context/panel-proxy";
import { useSnapshot } from "valtio";
import PlanetMaterial from "../../Logic/Materials/Planet";
import useWindowSize from "../../utils/useWindowSize";
import Controls from "./Controls";
import shaderFragment from "../../Logic/shaders/planet/BG.fragment.glsl";
import shaderVertex from "../../Logic/shaders/planet/vertex.glsl";
import { Bounds, Html, OrthographicCamera } from "@react-three/drei";
import SelectToZoom from "../../utils/SelectToZoom";
import { useDynamicStates } from "../../components/Panel";
import TextureLoaderManager from "../../utils/texture.loader";
import useTextures from "../../hooks/useTextures";
//import { addRotationControls } from "../mars/rotation.controls";

export default function ModelGLB(props: any) {
	//const [loaded, setLoaded] = useState(false);
	const { camera, gl, scene: _scene } = useThree();
	gl.outputEncoding = THREE.sRGBEncoding;
	gl.toneMapping = THREE.NoToneMapping;

	gl.autoClear = false;
	gl.clear();
	const earthRef = useRef<any>();
	const pointRef = useRef<any>();

	const [earth, set] = useControls(
		"Main",
		() => ({
			uAmbientLight: {
				label: "Amb Light",
				value: 0.05,
				min: 0,
				max: 5,
				step: 0.001,
			},
			uSunIntensity: {
				label: "Sun Intensity",
				value: 1,
				min: 0,
				max: 5,
				step: 0.01,
			},
			uCloudsScale: {
				label: "Clouds Scale",
				value: -1,
				min: -1,
				max: 5,
				step: 0.1,
			},
			uCloudsSpeed: {
				label: "Clouds Speed",
				value: -1,
				min: -1,
				max: 5,
				step: 0.1,
			},
			uCloudsDensity: {
				label: "Clouds density",
				value: 0.3,
				min: 0.1,
				max: 1,
				step: 0.01,
			},
			uAtmosphereDensity: {
				label: "Atmo density",
				value: 0.3,
				min: 0.1,
				max: 5,
				step: 0.1,
			},
		}),

		{ collapsed: true }
	);
	/* const uniforms = useMemo(
		() => ({
			uCloudsSpeed: { value: earth.uCloudsSpeed },
			uQuality: { value: Math.min(window.devicePixelRatio, 2) },
			uResolution: { value: [window.innerWidth, window.innerHeight] },
		}),
		[]
	);
	//addRotationControls(uniforms, gl.domElement);
	let earthMat = new PlanetMaterial(uniforms, true);
	
	useEffect(() => {
		if (earthRef.current) {
			console.log("earth ready");
			earthRef.current!.material = earthMat;
		}
	}, []); */

	//const path_of_planets = [];
	/* 	const textureLoader = new THREE.TextureLoader();

	const sunTexture = textureLoader.load("../../texture/sun/2k_sun.jpg");
	sunTexture.encoding = THREE.sRGBEncoding;
	const mercuryTexture = textureLoader.load(
		"../../texture/mercury/2k_mercury.jpg"
	);
	const venusTexture = textureLoader.load("../../texture/venus/2k_venus.jpg");
	const earthTexture = textureLoader.load(
		"../../texture/earth-gl/2k_earth_color.jpg"
	);
	const marsTexture = textureLoader.load("../../texture/mars/2k_mars.jpg");
	const jupiterTexture = textureLoader.load(
		"../../texture/jupiter/2k_jupiter.jpg"
	);
	const saturnTexture = textureLoader.load(
		"../../texture/saturn/2k_saturn.jpg"
	);
	const uranusTexture = textureLoader.load(
		"../../texture/uranus/2k_uranus.jpg"
	);
	const neptuneTexture = textureLoader.load(
		"../../texture/neptune/2k_neptune.jpg"
	);
	const plutoTexture = textureLoader.load("../../texture/pluto/plutomap2k.jpg");
	const saturnRingTexture = textureLoader.load(
		"../../texture/saturn/2k_saturn_ring_alpha.png"
	);
	const uranusRingTexture = textureLoader.load(
		"../../texture/uranus/uranus_ring.png"
	);
	const moonTexture = textureLoader.load("../../texture/moon/2k_moon.jpg");
	const uStars = textureLoader.load("../../texture/mars/8k_stars.jpg"); */
	const paths = useMemo(() =>["../../texture/mars/8k_stars.jpg",
		
		"../../texture/mercury/2k_mercury.jpg",
		"../../texture/venus/2k_venus.jpg",
		"../../texture/earth-gl/2k_earth_color.jpg",
		"../../texture/mars/2k_mars.jpg",
		"../../texture/jupiter/2k_jupiter.jpg",
		"../../texture/saturn/2k_saturn.jpg",
		"../../texture/uranus/2k_uranus.jpg",
		"../../texture/neptune/2k_neptune.jpg",
		"../../texture/pluto/plutomap2k.jpg",
		"../../texture/saturn/2k_saturn_ring_alpha.png",
		"../../texture/uranus/uranus_ring.png",
		"../../texture/moon/2k_moon.jpg",
		"../../texture/sun/2k_sun.jpg",
	], []);
	
	const [textures, isLoading] = useTextures(paths, (loadedTextures) => {
		console.log('All textures are loaded:');
	  }); 
	const [
		uStars,
		mercuryTexture,
		venusTexture,
		earthTexture,
		marsTexture,
		jupiterTexture,
		saturnTexture,
		uranusTexture,
		neptuneTexture,
		plutoTexture,
		saturnRingTexture,
		uranusRingTexture,
		moonTexture,
		sunTexture,
	] =  textures;
	
	const planets = useMemo(() => [
		{
			name: "sun",
			rotatingSpeedAroundSun: 0,
			selfRotationSpeed: 0,
			radius: 15,
			posX: 0,
			texture: sunTexture,
			diameter: "1,392,000 km",
			moon: null,
		},
		{
			name: "jupiter",
			rotatingSpeedAroundSun: 0.002,
			selfRotationSpeed: 0.04,
			radius: 12,
			posX: 100,
			texture: jupiterTexture,
			diameter: "143,000 km",
			moon: null,
		},
		{
			name: "mercury",
			rotatingSpeedAroundSun: 0.004,
			selfRotationSpeed: 0.004,
			radius: 3.2,
			posX: 28,
			texture: mercuryTexture,
			diameter: "4,900 km",
			moon: null,
		},
		{
			name: "earth",
			rotatingSpeedAroundSun: 0.01,
			selfRotationSpeed: 0.02,
			radius: 6,
			posX: 62,
			texture: earthTexture,
			diameter: "12,760 km",
			moon: {
				texture: moonTexture,
			},
		},
		{
			name: "venus",
			rotatingSpeedAroundSun: 0.015,
			selfRotationSpeed: 0.002,
			radius: 5.8,
			posX: 44,
			texture: venusTexture,
			diameter: "12,100 km",
			moon: null,
		},
		{
			name: "mars",
			rotatingSpeedAroundSun: 0.008,
			selfRotationSpeed: 0.018,
			radius: 4,
			posX: 78,
			texture: marsTexture,
			diameter: "6,800 km",
			moon: null,
		},
		{
			name: "neptune",
			rotatingSpeedAroundSun: 0.0001,
			selfRotationSpeed: 0.032,
			radius: 7,
			posX: 200,
			texture: neptuneTexture,
			diameter: "50,000 km",
			moon: null,
		},
		{
			name: "pluto",
			rotatingSpeedAroundSun: 0.0007,
			selfRotationSpeed: 0.008,
			radius: 2.8,
			posX: 216,
			texture: plutoTexture,
			diameter: "1,151 km",
			moon: null,
		},
		{
			name: "saturn",
			rotatingSpeedAroundSun: 0.0009,
			selfRotationSpeed: 0.038,
			radius: 10,
			posX: 138,
			texture: saturnTexture,
			diameter: "120,600 km",
			moon: null,
			ring: {
				innerRadius: 10,
				outerRadius: 20,
				ringmat: saturnRingTexture,
			},
		},
		{
			name: "uranus",
			rotatingSpeedAroundSun: 0.0004,
			selfRotationSpeed: 0.03,
			radius: 7,
			posX: 176,
			texture: uranusTexture,
			diameter: "51,000 km",
			moon: null,
			ring: {
				innerRadius: 7,
				outerRadius: 12,
				ringmat: uranusRingTexture,
			},
		},
	], [textures]);
	
	return (
		<>
			<color attach="background" args={[0x000000]} />
			<ambientLight color={0xffffff} intensity={0} />
			<pointLight color={0xffffff} intensity={4} distance={300} />
			<Controls />
			{isLoading ? <ambientLight color={0xffffff} intensity={0} /> : (
				<>
					<BG uStars={uStars} />
					<Bounds fit clip observe margin={1.2}>
						<SelectToZoom>
							{planets.map((x) => (
								<Planet
									key={x.name}
									data={{
										size: x.diameter,
									}}
									name={x.name}
									rotatingSpeedAroundSun={x.rotatingSpeedAroundSun}
									selfRotationSpeed={x.selfRotationSpeed}
									texture={x.texture}
									radius={x.radius}
									posX={x.posX}
									moon={
										x.moon ? { texture: x?.moon.texture as any } : ({} as any)
									}
									ring={
										x.hasOwnProperty("ring")
											? {
													innerRadius: x.ring?.innerRadius,
													outerRadius: x.ring?.outerRadius,
													ringmat: x.ring?.ringmat,
											  }
											: ({} as any)
									}
								/>
							))}
						</SelectToZoom>
					</Bounds>
				</>
			)}
		</>
	);
}

const Planet = ({
	data,
	name,
	texture,
	moon,
	radius,
	posX,
	ring,
	selfRotationSpeed,
	rotatingSpeedAroundSun,
}: {
	data: {
		size: string;
	};
	name?: string;
	ring?: {
		innerRadius: number;
		outerRadius: number;
		ringmat: THREE.Texture;
	};
	moon?: {
		texture: THREE.Texture;
	};
	posX: number;
	radius: number;
	selfRotationSpeed: number;
	texture: THREE.Texture;
	rotatingSpeedAroundSun: number;
}) => { 
	const { stateP } = useDynamicStates({
		play: {
			type: "playButton",
			value: true,
			label: "Play",
		},
		speed: {
			label: "Speed",
			type: "slider",
			value: 1,
			initialValue: 4,
			min: 0,
			max: 10,
			step: 0.5,
		},
		annotation: {
			label: "Show Planet Name",
			type: "switch",
			value: false,
		},
		infoCards: {
			label: "Show Cards",
			type: "switch",
			value: false,
		},
		audio: {
			type: "audioPlayer",
			value:
				"https://res.cloudinary.com/recapdataebse/video/upload/v1703282023/3dtata/solarsystemcut_qmf9ez.mp3",
		},
	});
	//let speed = stateP.speed?.value/10   // 0.5;
	const planet = useRef<THREE.Group>(null);
	const groupRef = useRef<THREE.Group>(null);
	const moonRef = useRef<THREE.Group>(null);
	const html = useRef<any>(null);
	useFrame((state) => {
		if (planet.current && (stateP.play?.value ?? true)) {
			groupRef.current!.rotation.y +=
				(stateP.speed?.value ?? 0 / 100) * rotatingSpeedAroundSun;
			planet.current!.rotation.y +=
				(stateP.speed?.value ?? 0 / 100) * selfRotationSpeed;
		}
		if (moonRef.current) {
			moonRef.current.rotation.y += 0.02;
		}
		if (html.current) {
			html.current.hidden = !stateP.annotation?.value;
		}
	});

	return (
		<>
			<LineCircle radius={posX} posX={posX} />
			<group ref={groupRef}>
				{ring && (
					<mesh position={[posX, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
						<ringGeometry args={[ring.innerRadius, ring.outerRadius, 32]} />
						<meshStandardMaterial map={ring.ringmat} side={THREE.DoubleSide} />
					</mesh>
				)}
				<group ref={planet} position={[posX, 0, 0]}>
					{moon?.hasOwnProperty("texture") && (
						<>
							<LineCircle radius={10} posX={10} />
							<mesh position={[10, 0, 0]}>
								<sphereGeometry args={[2.4, 50, 50]} />
								<meshStandardMaterial
									map={moon.texture}
									side={THREE.DoubleSide}
								/>
							</mesh>
						</>
					)}
					<Html
						key={name}
						ref={html}
						center
						zIndexRange={[100, 0]}
						position={[0, radius * 2, 0]}
					>
						<div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 select-none line-clamp-2 w-[120px] max-h-32 ">
							<p className="text-xs text-center">
								Name: {name} <br />
								Size: {data.size}
							</p>
						</div>
					</Html>
					<mesh>
						<sphereGeometry args={[radius, 50, 50]} />
						<meshStandardMaterial map={texture} />
					</mesh>
				</group>
			</group>
		</>
	);
};

const LineCircle = ({ radius, posX }: { radius: number; posX: number }) => {
	const line = useRef<any>();
	const segments = 100;

	const points = useMemo(() => {
		const points = [];
		for (let i = 0; i <= segments; i++) {
			const theta = (i / segments) * Math.PI * 2;
			const x = Math.cos(theta) * radius;
			const z = Math.sin(theta) * radius;
			points.push(new THREE.Vector3(x, 0, z));
		}
		return points;
	}, [radius, segments]);

	const geometry = useMemo(() => {
		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(points.length * 3);
		for (let i = 0; i < points.length; i++) {
			positions[i * 3] = points[i].x;
			positions[i * 3 + 1] = points[i].y;
			positions[i * 3 + 2] = points[i].z;
		}
		geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		return geometry;
	}, [points]);
	useFrame(() => {
		if (line.current) {
			line.current.geometry = geometry;
			//.setFromPoints([props.start, props.end].map((point) => new THREE.Vector3(...point)));
		}
	});
	return (
		<line ref={line}>
			<bufferGeometry />
			<lineBasicMaterial linewidth={0.1} color="white" />
		</line>
	);
};

const BG = ({ uStars }: any) => {
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
		[]
	);
	useFrame((state) => {
		if (starsRef.current) {
			starsRef.current.rotation.y += 0.0001;
		}
	});
	return (
		<>
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
		</>
	);
};

/* interface PivotMeshProps {
  position: THREE.Vector3;
  rotation: [number, number, number];
  children : any
}

const PivotMesh: React.FC<PivotMeshProps> = ({ position, rotation, children }) => {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
    }
  }, [rotation]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(position.x+20, position.y, 2 * Math.sin(Date.now() * 0.001));
	  //children.rotation.y += 0.08;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}; */
