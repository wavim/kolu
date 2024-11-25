import { Vec } from "../maths/vector";
import { Vec3 } from "../types";

export class Tri {
	vertices: [Vec, Vec, Vec];
	fill: string = "black";

	constructor(v1: Vec3, v2: Vec3, v3: Vec3) {
		this.vertices = [v1, v2, v3].map(Vec.from);
	}
}
