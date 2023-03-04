import { useParams, useNavigate } from "react-router";
import React, { useRef, useEffect,lazy, useMemo, useState, Suspense } from 'react'
import { useGLTF, AccumulativeShadows, RandomizedLight, OrbitControls, Environment, Lightformer, useEnvironment } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from "three";
import { useControls, folder } from 'leva'
import { makeStyles, mergeClasses } from '@fluentui/react-components';
import Panel from './Panel'
import fake from '../../data/data'


const useStyles = makeStyles({
  canvaStyle: {
    width: '100%',
    height: '100%',         
    position: 'absolute',
    top: 0,
    left: 0
  },
  panelStyle: {
    position: 'absolute',
    width: '300px',
    marginRight: '40px',
    zIndex: 4,
    top: '50%',
    right: 0,
    transform: 'translateY(-50%)'
  }
});

export default function Course() {
  console.log(fake)
  const ModelGLB = lazy(()=> import("../../assets/module1"));
  const camRef = useRef()
  const envMap = useEnvironment({path:"../../../public/"})

  const optionsCam = useMemo(() => {
    return {x: 10, y: 10, z: 10}
  }, [])
  const optionsModel = useMemo(() => {
    return {x: 0, y: -12, z: 2}
  }, [])

  const classes = useStyles();
  const playAnimation = () => {
    console.log("play animation")
  };
  /*const gltf = useLoader(GLTFLoader, '../src/assets/C1.glb', loader => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('../src/assets/gltf/');
    loader.setDRACOLoader(dracoLoader);
   })*/
   
   const cam = useControls('Camera', useMemo(() => {
    return {Camera:folder({
      fov:{ value: 80, min: 0, max: 300, step: 10 },

     alpha:{value: 30, min: -90, max: 360, step: 0.01},
     beta:{value: 77, min: -90, max: 360, step: 0.01},
     
        x:{value: 8.09, min: -20, max: 100, step: 0.01},
        y:{value: -1.7, min: -20, max: 100, step: 0.01},
        z:{value: 5.7, min: -20, max: 100, step: 0.01}
       
    
    }, [])}}))

   const model = useControls('Model', useMemo(() => {
    return {position:folder(      {
      x: { value: 1, min: -15, max: 50, step: 1 },
      y: { value: -12, min: -15, max: 50, step: 1 },
      z: { value: 6, min: -15, max: 50, step: 1 }})}
  }, []))



  function Box(props) {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (ref.current.rotation.x += delta))
    // Return the view, these are regular Threejs elements expressed in JSX
    return (
      <mesh
        {...props}
        ref={ref}
        scale={clicked ? 1.5 : 1}
        onClick={(event) => click(!clicked)}
        onPointerOver={(event) => hover(true)}
        castShadow receiveShadow
        onPointerOut={(event) => hover(false)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
      </mesh>
    )
  }
  const Controls = () => {
    const { gl, camera } = useThree()

      camera.position.x = 50 * Math.cos( THREE.MathUtils.degToRad(cam.alpha) );  
      camera.position.z = 50 * Math.sin( THREE.MathUtils.degToRad(cam.beta) );
      camera.fov = cam.fov


    return (
      /**
       * The args value with camera and gl are required to be passed to the OrbitControls
       * in order to allow the illusion of camera re-focus to work when click a pitstop.
       */
      <OrbitControls
        makeDefault
        //target={[cam.x, cam.y, cam.z]}
        args={[camera, gl.domElement]}
        maxDistance={8}
        minDistance={3}
        // vertical angle of the orbit
        minPolarAngle={THREE.MathUtils.degToRad(0)}
        maxPolarAngle={THREE.MathUtils.degToRad(180)}
        // horizontal angle of the orbit
        minAzimuthAngle={THREE.MathUtils.degToRad(-180)}
        maxAzimuthAngle={THREE.MathUtils.degToRad(180)}
      />
    )
  }

  return (
    <div>
      <div className={classes.canvaStyle}>
        <Suspense fallback={<>...</>}>
      <Canvas flat linear>
      
      <color attach="background" args={['#f0f0f0']} />
    <ambientLight/>
    <directionalLight position={[-10, 10, 5]} shadow-mapSize={[256, 256]} shadow-bias={-0.0001} castShadow>
      <orthographicCamera ref={camRef} attach="shadow-camera" fov={cam.fov} args={[-10, 10, -10, 10]} />
    </directionalLight>
    <Suspense fallback={<>...</>}>
      <ModelGLB position={[model.x, model.y, model.z]}/>
      {/*<primitive object={gltf.scene} position={[model.x, model.y, model.z]}/>*/}
   </Suspense>


      <Controls />
    </Canvas>
     </Suspense>
    </div>

    <div className={classes.panelStyle}>
      <Panel playAnimation={()=>playAnimation()} />
      </div>
      {/*<div className="actions">
        <button onClick={handleGoBack}>Back</button>
        <button onClick={handleGoForward}>forward</button>
        <button onClick={handleGoToHome}>Go home</button>
  </div>*/}
    </div>
  );
}
