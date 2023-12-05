import * as THREE from "three";

import shaderFragment from "../shaders/planet/fragment.glsl";
import shaderEarthFragment from "../shaders/planet/earth.fragment.glsl";
import shaderVertex from "../shaders/planet/vertex.glsl";
export default class PlanetMaterial {
	material: any;
	uniforms: {
		uAtmosphereColor: { value: number[] };
		uAtmosphereDensity: { value: number };
		uQuality: { value: number };
		uPlanetColor: { value: any };
		uStars: { value: any };
		uTime: { value: number };
		uRotationSpeed: { value: number };
		uResolution: { value: number[] };
		uPlanetPosition: { value: number[] };
		uRotationOffset: { value: number };
		uPlanetRadius: { value: number };
		uBumpStrength: { value: number };
		uNoiseStrength: { value: number };
		uTerrainScale: { value: number };
		uCloudsDensity: { value: number };
		uCloudsScale: { value: number };
		uCloudsSpeed: { value: number };
		//uAtmosphereColor: [0.05, 0.3, 0.9],
		//uAtmosphereDensity: 0.3,
		uAmbientLight: { value: number };
		uSunIntensity: { value: number };
		sunDirectionXY: { value: number[] };
	};

	constructor(uniforms: any, useEarthFragment?: any) {
		this.uniforms = {
			...uniforms,
			//uAtmosphereColor: {value: [0.9, 0.15, 0]},
			//uAtmosphereDensity: { value: 0.2 },
			//uQuality: {value: Math.min(window.devicePixelRatio, 2)},
			//uPlanetColor: {value: null},
			//uStars: {value: null},
			//uTime: {value: 0},
			//uRotationSpeed: {value: 0.8},
			//uResolution: {value: [window.innerWidth, window.innerHeight]},
			uPlanetPosition: { value: [0, 0, -10] },
			//uRotationOffset: {value: 0.6},
			uPlanetRadius: { value: 2 },
			uBumpStrength: { value: 0.01 },
			uNoiseStrength: { value: 0.2 },
			uTerrainScale: { value: 0.8 },
			//uCloudsDensity: { value: 0.5 },
			//uCloudsScale: { value: 1 },
			//uCloudsSpeed: { value: 1.5 },
			//uAtmosphereColor: [0.05, 0.3, 0.9],
			//uAtmosphereDensity: 0.3,
			// uAmbientLight: {value: 0.01},
			//uSunIntensity: {value: 3},
 
			sunDirectionXY: { value: [1, 1] },
		};

		this.material = new THREE.ShaderMaterial({
			glslVersion: THREE.GLSL3,
			wireframe: false,
			transparent: true,
			uniforms: this.uniforms,
			vertexShader: shaderVertex,
			fragmentShader: useEarthFragment ? shaderEarthFragment : shaderFragment,
		});
		return this.material;
	}
}
