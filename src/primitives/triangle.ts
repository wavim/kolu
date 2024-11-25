import { Vec } from "../maths/vector";
import { vertex } from "./constants";

export class Tri {
	vertices: [Vec, Vec, Vec];
	fill: string = "black";

	constructor(v1: vertex, v2: vertex, v3: vertex) {
		this.vertices = [v1, v2, v3].map((v) => new Vec(...v));
	}
}
