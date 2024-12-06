import { Vec } from "../maths/vector";

export class Tri {
	constructor(public vertices: [Vec.vec3, Vec.vec3, Vec.vec3], public fill: string = "green") {}
}
