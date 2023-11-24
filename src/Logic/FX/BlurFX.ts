import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import BlurPass from "../../Logic/Passes/Blur";
import GlowsPass from "../../Logic/Passes/Glows";

class BlurFX {
	renderer: THREE.WebGLRenderer;
	scene: THREE.Scene;
	dummyCamera: THREE.OrthographicCamera;
	camera: THREE.OrthographicCamera;
	geometry: THREE.BufferGeometry;
	resolution: THREE.Vector2;
	target: THREE.WebGLRenderTarget;
	passes: {
		composer: EffectComposer;
		horizontalBlurPass: ShaderPass;
		verticalBlurPass: ShaderPass;
		glowsPass: ShaderPass;
		renderPass: RenderPass;
		effectFXAA: ShaderPass;
		copyPass: ShaderPass;
	};
	config: any;
	sizes: {
		viewport: {
			height: number;
			width: number;
		};
	};

	constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: any) {
		this.renderer = renderer;
		this.camera = camera;
		this.scene = scene;
		// three.js for .render() wants a camera, even if we're not using it :(
		this.dummyCamera = new THREE.OrthographicCamera();
		this.passes = {
			copyPass: new ShaderPass(CopyShader),
			effectFXAA: new ShaderPass(FXAAShader),
			composer: new EffectComposer(this.renderer),
			horizontalBlurPass: new ShaderPass(BlurPass),
			verticalBlurPass: new ShaderPass(BlurPass),
			glowsPass: new ShaderPass(GlowsPass),
			renderPass: new RenderPass(this.scene, this.camera),
		};
		this.sizes = {
			viewport: {
				height: window.innerHeight,
				width: window.innerWidth,
			},
		};

		this.geometry = new THREE.BufferGeometry();

		this.resolution = new THREE.Vector2();
		this.renderer.getDrawingBufferSize(this.resolution);

		this.target = new THREE.WebGLRenderTarget(
			this.resolution.x,
			this.resolution.y,
			{
				format: THREE.RGBAFormat,
				stencilBuffer: false,
				depthBuffer: true,
			}
		);
		this.setPasses();
	}

	setPasses() {
		this.passes.composer.setPixelRatio(2);
		this.passes.horizontalBlurPass.material.uniforms.uResolution.value =
			new THREE.Vector2(this.sizes.viewport.width, this.sizes.viewport.height);
		this.passes.horizontalBlurPass.material.uniforms.uStrength.value =
			new THREE.Vector2(0.1, 0);
		this.passes.verticalBlurPass.material.uniforms.uResolution.value =
			new THREE.Vector2(this.sizes.viewport.width, this.sizes.viewport.height);
		this.passes.verticalBlurPass.material.uniforms.uStrength.value =
			new THREE.Vector2(0, 0.1);

		this.passes.glowsPass = new ShaderPass(GlowsPass);
		//this.passes.glowsPass.color = '#ffcfe0'
		this.passes.glowsPass.material.uniforms.uPosition.value = new THREE.Vector2(
			0,
			0.2
		);
		this.passes.glowsPass.material.uniforms.uRadius.value = 0.6;
		this.passes.glowsPass.material.uniforms.uColor.value = new THREE.Color(
			"white"
		).convertLinearToSRGB();
		this.passes.glowsPass.material.uniforms.uAlpha.value = 0.1;

		/**/ const copyPass = new ShaderPass(CopyShader);
		copyPass.renderToScreen = true;
		this.passes.composer.addPass(copyPass);

		this.passes.effectFXAA.uniforms["resolution"].value.set(
			1 / window.innerWidth,
			1 / window.innerHeight
		);
		this.passes.effectFXAA.renderToScreen = true;

		// Add passes
		 /* this.passes.composer.addPass(this.passes.copyPass);
		this.passes.composer.addPass(this.passes.effectFXAA); */
		this.passes.composer.addPass(this.passes.renderPass);
	this.passes.composer.addPass(this.passes.horizontalBlurPass);
		this.passes.composer.addPass(this.passes.verticalBlurPass);
		this.passes.composer.addPass(this.passes.glowsPass); 
		//console.log(this.passes.composer);
	}
	render() {
		this.passes.horizontalBlurPass.enabled =
			this.passes.horizontalBlurPass.material.uniforms.uStrength.value.x > 0;
		this.passes.verticalBlurPass.enabled =
			this.passes.verticalBlurPass.material.uniforms.uStrength.value.y > 0;
		this.passes.composer.render();
	}
}
export default BlurFX;
