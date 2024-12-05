import { Vec } from "../maths/vector";
import { Vec3 } from "../types";

export class Tri {
	vertices: [Vec, Vec, Vec];

	constructor(
		v1: Vec | Vec3,
		v2: Vec | Vec3,
		v3: Vec | Vec3,
		public fill: string = "green",
	) {
		this.vertices = <typeof this.vertices>(
			[v1, v2, v3].map(Vec.from)
		);
	}
}
