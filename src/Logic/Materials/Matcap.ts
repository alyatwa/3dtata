import * as THREE from "three";

import shaderFragment from "../shaders/matcap/fragment.glsl";
import shaderVertex from "../shaders/matcap/vertex.glsl";
export default class MatcapMaterial {
	uniforms: any; // replace 'any' with the actual type of 'uniforms' if known
	defines: any; // replace 'any' with the actual type of 'uniforms' if known
	material: any; // replace 'any' with the actual type of 'uniforms' if known
	extensions: {
		derivatives: boolean;
		fragDepth: boolean;
		drawBuffers: boolean;
		shaderTextureLOD: boolean;
	};

	constructor() {
		this.uniforms = {
			...THREE.UniformsLib.lights,
			...THREE.UniformsLib.common,
			...THREE.UniformsLib.bumpmap,
			...THREE.UniformsLib.normalmap,
			...THREE.UniformsLib.displacementmap,
			...THREE.UniformsLib.fog,
			matcap: { value: null },
			uRevealProgress: { value: null },
			uIndirectDistanceAmplitude: { value: null },
			uIndirectDistanceStrength: { value: null },
			uIndirectDistancePower: { value: null },
			uIndirectAngleStrength: { value: null },
			uIndirectAngleOffset: { value: null },
			uIndirectAnglePower: { value: null },
			uIndirectColor: { value: null }
		};

		this.extensions = {
			derivatives: false,
			fragDepth: false,
			drawBuffers: false,
			shaderTextureLOD: false,
		};

		this.defines = {
			MATCAP: "",
		};

		this.material = new THREE.ShaderMaterial({
			wireframe: false,
			transparent: false,
			uniforms: this.uniforms,
			extensions: this.extensions,
			defines: this.defines,
			lights: true,
			vertexShader:shaderVertex /*
			`#include <common>
			#include <fog_pars_vertex>
			#include <shadowmap_pars_vertex>
			
			  varying vec2 vNormal;

			void main() {
			#include <begin_vertex>
			  #include <beginnormal_vertex> 
			  #include <project_vertex>
			  #include <worldpos_vertex>
			  #include <defaultnormal_vertex>  
			  #include <shadowmap_vertex>
			  #include <fog_vertex>
			  vec4 p = vec4( position, 1. );
			
			  vec3 e = normalize( vec3( modelViewMatrix * p ) );
			  vec3 n = normalize( normalMatrix * normal );
			
			  vec3 r = reflect( e, n );
			  float m = 2. * sqrt(
				pow( r.x, 2. ) +
				pow( r.y, 2. ) +
				pow( r.z + 1., 2. )
			  );
			  vNormal = r.xy / m + .5;
			
			  gl_Position =projectionMatrix*modelViewMatrix*p;
			  }
			  `*/,
			fragmentShader:shaderFragment/*`
			uniform sampler2D matcap;

			varying vec2 vNormal;

			#include <common>
			#include <packing>
			#include <fog_pars_fragment>
			#include <bsdfs>
			#include <lights_pars_begin>
			#include <shadowmap_pars_fragment>
			#include <shadowmask_pars_fragment>
			#include <dithering_pars_fragment>
			void main() {
			  // CHANGE THAT TO YOUR NEEDS
			  // ------------------------------
			  
			  vec3 shadowColor = vec3(0, 0, 0);
			  float shadowPower = 0.25;
			  // ------------------------------
			  
  vec3 base = texture2D( matcap, vNormal ).rgb;
  //gl_FragColor = vec4( base, 1.0 );
			  // it just mixes the shadow color with the frag color
			  gl_FragColor = vec4( mix(base, shadowColor, (1.0 - getShadowMask() ) * shadowPower), 1.0);
			  #include <fog_fragment>
			  #include <dithering_fragment>
			}
		  `  */,
		});

		return this.material;
	}
}
