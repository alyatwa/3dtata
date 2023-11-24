import { extend, Object3DNode } from "@react-three/fiber";
import FloorMaterial from './Logic/Materials/Floor'
extend({ FloorMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    floorMaterial: Object3DNode<FloorMaterial, typeof FloorMaterial>;
  }
}