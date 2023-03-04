import * as THREE from "three";
import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, shaderMaterial } from "@react-three/drei";

const uniforms = {
    uTime: { value: 0.0 },
  uColor: { value: new THREE.Color("red") }
}
const vertexShader = `  
precision mediump float;
varying vec2 vUv;

void main() {
  vUv = uv;
  
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);  
}`

const fragmentShader = `
precision lowp float;
uniform vec3 uColor;
uniform float uTime;

varying vec2 vUv;


void main() {
    	 
  vec2 position = (vUv * .90);// + vec2(0.5, .50);

float radius = length(position.x);
float x = -radius*8.0 + uTime*-.50;
    float ringColor = mod(x, 1.0) *1.0;

    vec3 finalColor;
if (ringColor < .50) {
finalColor = uColor ;
} else {
  finalColor = vec3(1.0,1.0,1.0);
}

gl_FragColor = vec4(finalColor, 1.0);
  //gl_FragColor = vec4( sin(vUv.x *5.* uTime)* uColor, 1.0); 
}
`

  export default function ModelGLB(props) {
    const refAxe = useRef()
  const [isGPushClicked, setGPush] = useState(false);
  const [isAnimationPlay, setAnimationPlay] = useState(false);
  const [isPower, setPower] = useState(true);
  const [isCurrent, setCurrent] = useState(true);

const Current = (color) => {
  const ref = useRef()
  useFrame(({clock}) => {
    ref.current.uniforms.uTime.value += 0.08
    })
  return (
      <shaderMaterial needsUpdate={true} name='ghg' uniforms={{uColor:{value: color.uColor.color}, uTime: { value: 0.0 }}}  vertexShader={vertexShader} fragmentShader={fragmentShader} ref={ref} />
  );
};
  
  useEffect(() => {
    props.makeEvent.current = makeEvent
  }, [])
  useFrame( ({clock}) => {
    isGPushClicked ? refAxe.current.rotation.x += 0.08 : refAxe.current.rotation.x = 0
})

  const makeEvent = (e) => {
    switch (e.event) {
      case "playMainAnimation":
        setAnimationPlay(e.value);
        break;
      case "showPower":
        setPower(!e.value);
        break;
      case "showCurrent":
        setCurrent(!e.value);
        break;
      default:
          return null;
  }
  }
  const handleGPush = () => {
    if (!isAnimationPlay)
    return;

    setGPush(true)
  };
  const handleRPush = () => {
    if (!isAnimationPlay)
    return;

    setGPush(false)
  };
  //console.log("isGPushClicked: ", isGPushClicked)

  const { nodes, materials } = useGLTF("./../models/C1.glb");
  //return (<primitive object={gltf.scene} />)
  /*useMemo(() => scene.traverse(obj => {
    // traverse and mutate the scene here ...
  }), [scene])*/

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.rail.geometry}
        material={materials["Steel.011"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3rt2026-1ak60_1012"].geometry}
        material={materials["3rt2026-1ak60_color_1.002"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3rt2026-1ak60_1012_1"].geometry}
        material={materials["body.001"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3rt2026-1ak60_1012_2"].geometry}
        material={materials["logo ttt"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3rt2026-1ak60_1012_3"].geometry}
        material={materials["logo.002"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3rt2026-1ak60_1012_4"].geometry}
        material={materials["Steel.011"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3rt2026-1ak60_1012_5"].geometry}
        material={materials["copper.004"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3rt2026-1ak60_1012_6"].geometry}
        material={materials["text.007"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3rt2026-1ak60_1012_7"].geometry}
        material={materials["text.008"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3rt2026-1ak60_1012_8"].geometry}
        material={materials["text.009"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3rt2026-1ak60_1012_9"].geometry}
        material={materials["text.010"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3rt2026-1ak60_1012_10"].geometry}
        material={materials["text.011"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3rt2026-1ak60_1012_11"].geometry}
        material={materials["text.012"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3rt2026-1ak60_1012_12"].geometry}
        material={materials["text.013"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.latch_interact.geometry}
        material={materials["3p3"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.hand_fbx.geometry}
        material={materials["3p3"]}
      />
      <mesh
        castShadow
        receiveShadow
        ref={refAxe}
        position={[-0.13, 8.23, -6.97]}
        geometry={nodes.axe.geometry}
        material={materials["Steel.011"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.plate.geometry}
        material={materials["Steel.011"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.motor.geometry}
        material={materials.motor}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.wire_conn.geometry}
          material={materials["Steel.012"]}
        />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["5sl43026_3004"].geometry}
        material={materials["5sl43026_color_2.003"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["5sl43026_3004_1"].geometry}
        material={materials["body out surface.003"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["5sl43026_3004_2"].geometry}
        material={materials["5sl43026_color_3.004"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["5sl43026_3004_3"].geometry}
        material={materials["5sl43026_color_4.003"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["5sl43026_3004_4"].geometry}
        material={materials["5sl43026_color_5.003"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["5sl43026_3004_5"].geometry}
        material={materials["terminal grove.002"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["5sl43026_3004_6"].geometry}
        material={materials["Steel.011"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["5sl43026_3004_7"].geometry}
        material={materials["Material.002"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["5sl43026_3004_8"].geometry}
        material={materials["copper.007"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["5sl43026_3004_9"].geometry}
        material={materials["copper.008"]}
      />
      <mesh
        castShadow
        receiveShadow visible={isCurrent}
        geometry={nodes.NurbsPath037.geometry}
        material={materials.GummyW}>
        {isAnimationPlay && <Current uColor={materials.GummyW} />}
        </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane004.geometry}
        material={materials["Steel.013"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane004_1.geometry}
        material={materials["lower mech.001"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane004_2.geometry}
        material={materials["base color.001"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane004_3.geometry}
        material={materials["copper.009"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane004_4.geometry}
        material={materials["connnec.001"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane004_5.geometry}
        material={materials["logo.001"]}
      />
      <mesh
        castShadow
        receiveShadow
        onClick={()=>handleRPush()}
        geometry={nodes.red_p_btn001.geometry}
        material={materials.redButton}
      />
       <mesh
        castShadow
        receiveShadow  visible={isPower}
        geometry={nodes.NurbsPath027.geometry}
        material={materials.blueW}>
        {isAnimationPlay && <Current  uColor={materials.blueW} />}
        </mesh>
        <mesh
        castShadow
        receiveShadow visible={isCurrent}
        geometry={nodes.apath.geometry}
        material={materials.yellow}>
        {isAnimationPlay && <Current  uColor={materials.yellow} />}
        </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane003.geometry}
        material={materials["Steel.014"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane003_1.geometry}
        material={materials["lower mech.004"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane003_2.geometry}
        material={materials["base color.004"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane003_3.geometry}
        material={materials["copper.010"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane003_4.geometry}
        material={materials["connnec.004"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane003_5.geometry}
        material={materials["logo.004"]}
      />
      <mesh
        castShadow
        receiveShadow
        onClick={()=>handleGPush()}
        geometry={nodes.green_btn_p001.geometry}
        material={materials.greenButton}
      />
       <mesh
        castShadow
        receiveShadow visible={isCurrent}
        geometry={nodes.NurbsPath033.geometry}
        material={materials.greenW}>
      {isGPushClicked && <Current  uColor={materials.greenW} />}
        </mesh>
      <mesh
        castShadow
        receiveShadow visible={isPower}
        geometry={nodes.NurbsPath026.geometry}
        material={materials.redW}>
        {isAnimationPlay && <Current  uColor={materials.redW} />}
        </mesh>
      <mesh
        castShadow
        receiveShadow visible={isPower}
        geometry={nodes.NurbsPath028.geometry}
        material={materials.yellow}>
        {isAnimationPlay && <Current  uColor={materials.yellow} />}
        </mesh>
        <mesh
        castShadow
        receiveShadow visible={isCurrent}
        geometry={nodes.NurbsPath018.geometry}
        material={materials.yellow}>
        {isAnimationPlay && <Current  uColor={materials.yellow} />}
        </mesh>
      <mesh
        castShadow
        receiveShadow visible={isPower}
        geometry={nodes.NurbsPath039.geometry}
        material={materials.blueW}>
      {isAnimationPlay && <Current uColor={materials.blueW} />}
      </mesh>
        <mesh
        castShadow
        receiveShadow visible={isCurrent}
        geometry={nodes.NurbsPath031.geometry}
        material={materials.yellow}>
        {isGPushClicked && <Current  uColor={materials.yellow} />}
        </mesh>
        <mesh
        castShadow
        receiveShadow visible={isPower}
        geometry={nodes.NurbsPath022.geometry}
        material={materials.yellow}>
        {isGPushClicked && <Current  uColor={materials.yellow} />}
        </mesh>
        <mesh
        castShadow
        receiveShadow visible={isCurrent}
        geometry={nodes.NurbsPath032.geometry}
        material={materials.greenW}>
        {isGPushClicked && <Current  uColor={materials.greenW} />}
        </mesh>
      <mesh
        castShadow
        receiveShadow visible={isPower}
        geometry={nodes.NurbsPath034.geometry}
        material={materials["white cable"]}
      />
      <mesh
        castShadow
        receiveShadow visible={isPower}
        geometry={nodes.motor_witrs001.geometry}
        material={materials.redW}>
      {isGPushClicked && <Current  uColor={materials.redW} />}
        </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["5sl43026_1001"].geometry}
        material={materials["body out surface.004"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["5sl43026_1001_1"].geometry}
        material={materials["5sl43026_color_2.004"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["5sl43026_1001_2"].geometry}
        material={materials["5sl43026_color_3.007"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["5sl43026_1001_3"].geometry}
        material={materials["5sl43026_color_4.004"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["5sl43026_1001_4"].geometry}
        material={materials["5sl43026_color_5.004"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["5sl43026_1001_5"].geometry}
        material={materials["terminal grove.004"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["5sl43026_1001_6"].geometry}
        material={materials["copper.011"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["5sl43026_1001_7"].geometry}
        material={materials["Material.003"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["5sl43026_1001_8"].geometry}
        material={materials["Steel.011"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.hand_siemens.geometry}
        material={materials["3p3"]}
      />
      <mesh
        castShadow
        receiveShadow  visible={isCurrent}
        geometry={nodes.NurbsPath035.geometry}
        material={materials.yellow}>
        {isAnimationPlay && <Current  uColor={materials.yellow} />}
        </mesh>
        <mesh
        castShadow visible={isPower}
        receiveShadow
        geometry={nodes.NurbsPath030.geometry}
        material={materials.redW}>
        {isAnimationPlay && <Current  uColor={materials.redW} />}
        </mesh>
        <mesh
        castShadow visible={isPower}
        receiveShadow
        geometry={nodes.NurbsPath038.geometry}
        material={materials.yellow}
      >
        {isAnimationPlay && <Current uColor={materials.yellow} />}
        </mesh>
      <mesh
        castShadow
        receiveShadow visible={isPower}
        geometry={nodes.NurbsPath019.geometry}
        material={materials["white cable.002"]}
      />
      <mesh
        castShadow
        receiveShadow visible={isPower}
        geometry={nodes.NurbsPath023.geometry}
        material={materials.blueW}>
        {isGPushClicked && <Current uColor={materials.blueW} />}
        </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3ru1136-4hb0-zw96_1"].geometry}
        material={materials["screw over"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3ru1136-4hb0-zw96_1_1"].geometry}
        material={materials.overloadc}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3ru1136-4hb0-zw96_1_2"].geometry}
        material={materials["3ru1136-4hb0-zw96_color_3.001"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3ru1136-4hb0-zw96_1_3"].geometry}
        material={materials.logo}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3ru1136-4hb0-zw96_1_4"].geometry}
        material={materials["3ru1136-4hb0-zw96_color_7.001"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3ru1136-4hb0-zw96_1_5"].geometry}
        material={materials["3ru1136-4hb0-zw96_color_8.001"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3ru1136-4hb0-zw96_1_6"].geometry}
        material={materials["3ru1136-4hb0-zw96_color_5.001"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3ru1136-4hb0-zw96_1_7"].geometry}
        material={materials["3ru1136-4hb0-zw96_color_6.001"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3ru1136-4hb0-zw96_1_8"].geometry}
        material={materials["Steel.011"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3ru1136-4hb0-zw96_1_9"].geometry}
        material={materials["black.008"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3ru1136-4hb0-zw96_1_10"].geometry}
        material={materials["black.009"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3ru1136-4hb0-zw96_1_11"].geometry}
        material={materials["black.010"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3ru1136-4hb0-zw96_1_12"].geometry}
        material={materials["black.011"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3ru1136-4hb0-zw96_1_13"].geometry}
        material={materials["black.012"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["3ru1136-4hb0-zw96_1_14"].geometry}
        material={materials["black.013"]}
      />
    </group>
  );
}
//export default ModelGLB;

//useGLTF.preload('./models/C1.glb');