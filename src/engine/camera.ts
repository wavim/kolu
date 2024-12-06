import { Vec } from "../maths/vector";
import { deg2Rad } from "../utils/utils";

export class Cam {
	constructor(public pos: Vec.vec3 = [0, 0, 0], public rot: Vec.vec3 = [0, 0, 0], public fov: number = Math.PI / 2) {}

	setRot(deg: Vec.vec3): void {
		this.rot = <Vec.vec3>deg.map(deg2Rad);
	}

	setAxisRot(axis: number, deg: number): void {
		this.rot[axis] = deg2Rad(deg);
	}

	setFOV(deg: number): void {
		this.fov = deg2Rad(deg);
	}
}
