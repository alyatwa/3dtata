import React, {
	useRef,
	useEffect,
	lazy,
	useMemo,
	useState,
	Suspense,
} from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useControls, folder, Leva } from "leva";

import Panel from "../../components/Panel";
import { useParams } from "react-router-dom";
import { LayerMaterial, Color, Depth } from "lamina";
import fake from "../../data/data.json";
import BlurFX from "../../Logic/FX/BlurFX";
import { usePanel } from "../../context/panel-context";
extend({ OrbitControls });

/* const useStyles = makeStyles({
	canvaStyle: {
		width: "100%",
		height: "100%",
		position: "absolute",
		top: 0,
		left: 0,
	},
}); */

export default function Module() {
	const { viewParticles } = usePanel();
	/*const modules = useLocation().state;
 console.log(useLocation())
 const [currentModule, setModule] = useState(null);
 (!currentModule && setModule(modules[0]))*/
	//const classes = useStyles();
	const params = useParams();
	//const makeEvent: any = useRef(null);
	const course = fake.find((x) => x.slug === params.courseId);
	// @ts-ignore
	const module = course?.modules.find((x) => x.slug! === params.moduleId);
	if (!module) {
		console.error("module not found");
		return <p>module not found</p>;
	}
	const [currentModule, setModule] = useState<any | null>(null);
	!currentModule && setModule(module);
	const ModelGLB = lazy(
		() => import(`../../modules/${currentModule!.moduleSource}/index.tsx`)
	);

	const optionsCam = useMemo(() => {
		return { x: 10, y: 10, z: 10 };
	}, []);
	const optionsModel = useMemo(() => {
		return { x: 0, y: -12, z: 2 };
	}, []);

	function Effect() {
		const { gl, scene, camera } = useThree();
		const BlurEffect = new BlurFX(gl, scene, camera);
		return useFrame((state) => {
			BlurEffect.render();
		}, 1);
	}

	return (
		<div>
			<Leva
				collapsed={true} // default = false, when true the GUI is collpased
				hidden={false} // default = false, when true the GUI is hidden
			/>

			<div className="w-full h-full absolute t-0 l-0">
				<Canvas
					gl={{
						outputEncoding: THREE.LinearEncoding,
						antialias: true,
						pixelRatio: 2,
						//physicallyCorrectLights: true,
						autoClear: false,
						toneMapping: THREE.NoToneMapping,
					}}
				>
					<color attach="background" args={[0xffffff]} />
					<Suspense fallback={null}>
						<ModelGLB receiveShadow castShadow />
					</Suspense>

					{/* 	<Effect /> 
					<ambientLight intensity={10} />*/}

					{/**/}
					<Environment files="../../venice_sunset_1k.hdr" />
				</Canvas>
			</div>

			<div>
				<Panel metadata={currentModule} course={course} />
			</div>
		</div>
	);
}
