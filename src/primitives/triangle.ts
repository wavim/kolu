import { Vec } from "../maths/vector";
import { TriVertices, Vec3 } from "../types";

export class Tri {
	vertices: TriVertices;

	constructor(v1: Vec | Vec3, v2: Vec | Vec3, v3: Vec | Vec3, public fill: string = "green") {
		this.vertices = <TriVertices>[v1, v2, v3].map(Vec.from);
	}
}
