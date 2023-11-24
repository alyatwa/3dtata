import * as THREE from 'three'

import shaderFragment from '../shaders/shadow/fragment.glsl'
import shaderVertex from '../shaders/shadow/vertex.glsl'
export default class ShadowMaterial {
    uniforms: { uColor: { value: null }; uAlpha: { value: null }; uFadeRadius: { value: null } }
    material: any;

    constructor() {
    this.uniforms = {
        uColor: { value: null },
        uAlpha: { value: null },
        uFadeRadius: { value: null }
    }

    this.material = new THREE.ShaderMaterial({
        wireframe: false,
        transparent: true,
        uniforms: this.uniforms,
        vertexShader: shaderVertex,
        fragmentShader: shaderFragment
    })
     return this.material
    }
   
}