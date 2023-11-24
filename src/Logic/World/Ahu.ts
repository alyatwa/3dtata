import * as THREE from "three";

import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import Objects from "./Objects";

export default class AHU {
	time: any;
	resources: any;
	objects: Objects;
	materials: any;
	config: any;
	camera: any;
	debug: any;
	renderer: any;
	container: THREE.Object3D<THREE.Event>;
	position: THREE.Vector3;
	debugFolder: any;
	models: any;
	chassis: any;
	constructor(_options: any) {
		// Options
		this.time = _options.time;
		this.resources = _options.resources;
		this.objects = _options.objects;
		//this.shadows = _options.shadows
		this.materials = _options.materials;
		//this.controls = _options.controls
		//this.sounds = _options.sounds
		this.renderer = _options.renderer;
		this.camera = _options.camera;
		this.debug = _options.debug;
		this.config = _options.config;

		// Set up
		this.container = new THREE.Object3D();
		this.position = new THREE.Vector3();

		// Debug
		if (this.debug) {
			this.debugFolder = this.debug.addFolder("ahu");
			// this.debugFolder.open()
		}

		this.resources.on("ready", () => {
			this.setModels();
			window.setTimeout(() => {
				this.setChassis();
			}, 500);
		});
	}

	setModels() {
		this.models = {};

		// Cyber truck
		if (this.config.cyberTruck) {
			this.models.chassis = this.resources.items.carCyberTruckChassis;
		}

		// Default
		else {
			console.log(this.resources.items);
			if (this.resources.items.ahu) {
				console.log("found ahu");
				this.models.ahu = this.resources.items.ahu;
			}
		}
	}
	setChassis() {
		this.chassis = {};
		this.chassis.offset = new THREE.Vector3(0, 0, -0.28);
		if (!this.models.ahu) {
			console.error(this.models);
			return;
		}
		this.chassis.object = this.objects.getConvertedMesh(
			this.models.ahu.scene.children
		);
		//this.chassis.object.position.copy(this.physics.car.chassis.body.position)
		this.chassis.oldPosition = this.chassis.object.position.clone();
		this.container.add(this.chassis.object);

		// this.shadows.add(this.chassis.object, { sizeX: 3, sizeY: 2, offsetZ: 0.2 })

		// Time tick
		this.time.on("tick", () => {
			// Save old position for movement calculation
			this.chassis.oldPosition = this.chassis.object.position.clone();

			// Update if mode physics
			/*    if(!this.transformControls.enabled)
            {
                this.chassis.object.position.copy(this.physics.car.chassis.body.position).add(this.chassis.offset)
                this.chassis.object.quaternion.copy(this.physics.car.chassis.body.quaternion)
            } */

			// Update position
			this.position.copy(this.chassis.object.position);
		});
	}
}
