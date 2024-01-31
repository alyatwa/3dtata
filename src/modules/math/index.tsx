"use client"
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { state } from '../../context/panel-proxy';


export default function ModelGLB(props: any) {
  
  state.isCanvasLoading = false 

  return (
      <Triangle angle={((50 + 0.1) % 360)} />
  );
}

const Triangle = ({ angle }:{angle:number}) => {
  // Ref for the mesh to access in the animation loop
  const meshRef = useRef<THREE.Mesh>();

  // This effect will update the geometry whenever the angle prop changes
  useEffect(() => {
    // Calculate the dynamic vertex based on the changing angle
    const vertex2 = new THREE.Vector3(
      Math.cos(THREE.MathUtils.degToRad(angle)) * 1,
      Math.sin(THREE.MathUtils.degToRad(angle)) * 1,
      0
    );

    // Update the geometry vertices
    const vertices = [
      new THREE.Vector3(0, 0, 0), // Vertex 1 (at the origin)
      vertex2,                    // Vertex 2 (dynamic based on angle)
      new THREE.Vector3(1, 0, 0), // Vertex 3 (fixed position)
    ];

    // Set the vertices into the geometry
    meshRef.current?.geometry.setFromPoints(vertices);
  }, [angle]); // Depend on the angle prop

  return (
    <mesh ref={meshRef as any}>
      <bufferGeometry attach="geometry" />
      <meshBasicMaterial attach="material" color="red" side={THREE.DoubleSide} />
    </mesh>
  );
};