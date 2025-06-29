import { Mat } from "../maths/mat";
import { Vec } from "../maths/vec";
import { Mesh } from "./mesh";

export class Model {
	private matrix: Mat;

	constructor(
		readonly meshes: Mesh[],

		public origin: Vec = Vec.zero(3),
		public offset: Vec = Vec.zero(3),

		matrix: Mat = Mat.id(4),
	) {
		this.matrix = matrix.dim === 3 ? matrix.homo() : matrix;
	}

	set transform(matrix: Mat) {
		this.matrix = matrix.dim === 3 ? matrix.homo() : matrix;
	}

	get transform(): Mat {
		return this.matrix;
	}

	get worldspace(): Mesh[] {
		return this.meshes.map((m) => {
			return m.worldspace(this.origin, this.offset, this.transform);
		});
	}
}
