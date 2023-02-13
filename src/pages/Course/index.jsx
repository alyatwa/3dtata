import { useParams, useNavigate } from "react-router";
import { useRef, useState } from 'react'
import { useGLTF, AccumulativeShadows, RandomizedLight, OrbitControls, Environment, Lightformer } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { makeStyles, mergeClasses } from '@fluentui/react-components';
import Panel from './Panel'


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
  const classes = useStyles();
  /*const { CourseId } = useParams();
  const navigate = useNavigate();

  function handleGoToHome() {
    navigate("/");
  }

  function handleGoBack() {
    navigate(-1);
  }

  function handleGoForward() {
    navigate(1);
  }*/

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


  return (
    <div className="Course">
      <h2>course </h2>



      <div className={classes.canvaStyle}>
      <Canvas flat linear>
      
      <color attach="background" args={['#f0f0f0']} />
    <ambientLight intensity={0.5} />
    <directionalLight position={[-10, 10, 5]} shadow-mapSize={[256, 256]} shadow-bias={-0.0001} castShadow>
      <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10]} />
    </directionalLight>
    <Environment resolution={32}>
      <Lightformer position={[10, 10, 10]} scale={10} intensity={4} />
      <Lightformer position={[10, 0, -10]} scale={10} color="red" intensity={1} />
      <Lightformer position={[-10, -10, -10]} scale={10} intensity={4} />
    </Environment>

      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
      <OrbitControls />
    </Canvas>
    </div>

    <div className={classes.panelStyle}>
      <Panel/>
      </div>
      {/*<div className="actions">
        <button onClick={handleGoBack}>Back</button>
        <button onClick={handleGoForward}>forward</button>
        <button onClick={handleGoToHome}>Go home</button>
  </div>*/}
    </div>
  );
}
