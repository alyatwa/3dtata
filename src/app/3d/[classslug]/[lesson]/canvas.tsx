"use client";
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
import { Leva } from "leva";
//import { usePanel } from "../../context/panel-context";
import { useSnapshot } from "valtio";
import { Spinner } from "@nextui-org/react";
import { state } from "@/context/panel-proxy";
//import ModelGLB from "@/modules/earth-gl";

extend({ OrbitControls });

export default function CanvasPage({ lesson }: { lesson: string }) {
	const { isCanvasLoading } = useSnapshot(state);
	//@/modules/earth-gl
	const ModelGLB = lazy(() => import(`@/modules/${lesson}`));
	return (
		<div>
			<Leva
				collapsed={true} // default = false, when true the GUI is collpased
				hidden={true} // default = false, when true the GUI is hidden
			/>
			{isCanvasLoading && (
				<div className="z-10 absolute flex justify-center items-center w-full h-full bg-white">
					<Spinner />
				</div>
			)}
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

					<Environment files="../../venice_sunset_1k.hdr" />
				</Canvas>
			</div>
		</div>
	);
}
