import * as THREE from "three";

import shaderFragment from "../shaders/floorShadow/fragment.glsl";
import shaderVertex from "../shaders/floorShadow/vertex.glsl";
export default class FloorShadow {
	uniforms: {
		tShadow: { value: null };
		uShadowColor: { value: null };
		uAlpha: { value: null };
	};
	material: any;
	constructor() {
		this.uniforms = {
			tShadow: { value: null },
			uShadowColor: { value: null },
			uAlpha: { value: null },
		};

		this.material = new THREE.ShaderMaterial({
			wireframe: false,
			transparent: true,
			uniforms: this.uniforms,
			vertexShader: shaderVertex,
			fragmentShader: shaderFragment,
		});

		return this.material;
	}
}
