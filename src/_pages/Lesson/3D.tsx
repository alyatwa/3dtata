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
//import { usePanel } from "../../context/panel-context";
import { useSnapshot } from "valtio";
import { state } from "../../context/panel-proxy";
import { Spinner } from "@nextui-org/react";
import InfoPanel from "../../components/InfoPanel";
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

export default function ThreeDLesson({
  currentLesson,
  _class,
}: {
  _class: any;
  currentLesson: any;
}) {
  const { isCanvasLoading } = useSnapshot(state);

  const ModelGLB = lazy(
    () => import(`../../modules/${currentLesson!.moduleSource}/index.tsx`)
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

      <div>
        <Panel metadata={currentLesson} course={_class} />
      </div>
    </div>
  );
}
