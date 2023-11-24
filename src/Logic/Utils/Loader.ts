import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Group, BufferGeometry } from "three";
import EventEmitter from "./EventEmitter";

export default class Resources extends EventEmitter {
	toLoad: number;
	loaded: number;
	loaders:
		| {
				action: (_resource: any) => void;
				extensions: any[];
		  }[]
		| undefined;
	items: any;
	declare callbacks: any;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.setLoaders();

		this.toLoad = 0;
		this.loaded = 0;
		this.items = {};
	}

	/**
	 * Set loaders
	 */
	setLoaders() {
		this.loaders = [];

		// Images
		this.loaders.push({
			extensions: ["jpg", "png"],
			action: (_resource: { source: string; name?: string }) => {
				const image = new Image();

				image.addEventListener("load", () => {
					this.fileLoadEnd(_resource, image);
				});

				image.addEventListener("error", () => {
					this.fileLoadEnd(_resource, image);
				});

				image.src = _resource.source;
			},
		});

		// Draco
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath("/gltf/");

		this.loaders.push({
			extensions: ["drc"],
			action: (_resource: { source: string }) => {
				dracoLoader.load(_resource.source, (_data) => {
					this.fileLoadEnd(_resource, _data);

					dracoLoader.dispose();
				});
			},
		});

		// GLTF
		const gltfLoader = new GLTFLoader();
		gltfLoader.setDRACOLoader(dracoLoader);

		this.loaders.push({
			extensions: ["glb", "gltf"],
			action: (_resource) => {
				gltfLoader.load(_resource.source, (_data) => {
					this.fileLoadEnd(_resource, _data);
				});
			},
		});

		// FBX
		const fbxLoader = new FBXLoader();

		this.loaders.push({
			extensions: ["fbx"],
			action: (_resource) => {
				fbxLoader.load(_resource.source, (_data) => {
					this.fileLoadEnd(_resource, _data);
				});
			},
		});
	}

	/**
	 * Load
	 */
	load(_resources: { source: any; name: string; type: string }[] = []) {
		for (const _resource of _resources) {
			
			this.toLoad++;
			const extensionMatch = _resource.source.match(/\.([a-z]+)$/);

			if (typeof extensionMatch[1] !== "undefined") {
				const extension = extensionMatch[1];
				const loader = this.loaders?.find((_loader) =>
					_loader.extensions.find((_extension) => _extension === extension)
				);

				if (loader) {
					loader.action(_resource);
				} else {
					console.warn(`Cannot found loader for ${_resource}`);
				}
			} else {
				console.warn(`Cannot found extension of ${_resource}`);
			}
		}
	}

	/**
	 * File load end
	 */
	fileLoadEnd(
		_resource: { source?: string; name?: any },
		_data: GLTF | Group | HTMLImageElement | BufferGeometry
	) {
		this.loaded++;
		this.items[_resource.name] = _data;
	
		this.trigger('fileEnd', [_resource, _data])

		if (this.loaded === this.toLoad) {
			 this.trigger('end')
		}
	}
	

}
