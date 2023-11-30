import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { Pass } from "three/examples/jsm/postprocessing/Pass";

class BloomFX {
	renderer: THREE.WebGLRenderer;
	scene: THREE.Scene;
	dummyCamera: THREE.OrthographicCamera;
	camera: THREE.OrthographicCamera;
	geometry: THREE.BufferGeometry;
	resolution: THREE.Vector2;
	target: THREE.WebGLRenderTarget;
	passes: {
		composer: EffectComposer;
		bloomPass: UnrealBloomPass;
		renderPass: RenderPass;
	};
	config: {
		bloomStrength: number;
		bloomRadius: number;
	};
	sizes: {
		viewport: {
			height: number;
			width: number;
		};
	};
	size: any;

	constructor(
		renderer: THREE.WebGLRenderer,
		scene: THREE.Scene,
		camera: any,
		size: any
	) {
		this.renderer = renderer;
		this.camera = camera;
		this.scene = scene;
		this.config = {
			bloomStrength: 1,
			bloomRadius: 0.4,
		};
		this.size = size;
		this.target = new THREE.WebGLRenderTarget(
			this.size.width,
			this.size.height,
			{
				type: THREE.HalfFloatType,
				format: THREE.RGBAFormat,
				encoding: THREE.sRGBEncoding,
			}
		);
		// three.js for .render() wants a camera, even if we're not using it :(
		this.dummyCamera = new THREE.OrthographicCamera();
		this.passes = {
			bloomPass: new UnrealBloomPass(
				new THREE.Vector2(window.innerWidth, window.innerHeight),
				this.config.bloomStrength,
				this.config.bloomRadius,
				0.85
			),
			composer: new EffectComposer(this.renderer, this.target),
			renderPass: new RenderPass(this.scene, this.camera),
		};
		this.sizes = {
			viewport: {
				height: window.innerHeight,
				width: window.innerWidth,
			},
		};

		this.geometry = new THREE.BufferGeometry();
		this.passes.bloomPass.strength = this.config.bloomStrength; 
		this.passes.bloomPass.radius = this.config.bloomRadius; 
		this.resolution = new THREE.Vector2(size.width, size.height);
		this.renderer.getDrawingBufferSize(this.resolution);

		this.setPasses();
	}

	setPasses() {
		this.passes.composer.setPixelRatio(2);

		this.passes.bloomPass.threshold = 1;
		this.passes.bloomPass.renderToScreen = true;
		//this.passes.bloomPass.enabled = false;
		this.passes.composer.addPass(this.passes.renderPass);
		this.passes.composer.addPass(this.passes.bloomPass);
	}
	updateIntensity(int:number) { 
		this.passes.bloomPass.strength = int; 
	}
	updateRadius(int:number) { 
		this.passes.bloomPass.radius = int; 
	}
	public enableBloomPass(enabled: boolean) {
		this.passes.bloomPass.enabled = enabled;
	  }
	render() {  
		this.passes.composer.render();  
		//this.renderer.clearDepth();
		//this.camera.layers.set(0);
		//this.renderer.render(this.scene, this.camera);
		/* 
		this.camera.layers.enable(1);
		this.renderer.setClearColor(0x000000);  
		this.passes.composer.render(); 
		
		
		 */
		//
	}
}
export default BloomFX;
