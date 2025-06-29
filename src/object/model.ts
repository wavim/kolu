import { Mat } from "../maths/mat";
import { Vec } from "../maths/vec";
import { Mesh } from "./mesh";

export class Model {
	constructor(
		readonly meshes: Mesh[],

		public origin: Vec = Vec.zero(3),
		public offset: Vec = Vec.zero(3),
		public matrix: Mat = Mat.id(4),
	) {}

	set transform(mat: Mat) {
		this.matrix = mat.dim === 3 ? mat.homo() : mat;
	}

	get result(): Mesh[] {
		return this.meshes.map((m) => m.transform(this.origin, this.offset, this.matrix));
	}
}
