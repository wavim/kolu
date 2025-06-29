import { Mat } from "../maths/mat";
import { Vec } from "../maths/vec";

export class Mesh {
	constructor(
		readonly vertices: Vec[],
		readonly color = "black",
	) {}

	worldspace(origin: Vec, offset: Vec, matrix: Mat): Mesh {
		const transformed = this.vertices.map((v) => {
			const local = v.vSub(origin);
			const trans = matrix.homopply(local);

			return trans.vAdd(offset);
		});

		return new Mesh(transformed, this.color);
	}

	eyespace(position: Vec, rotation: Vec): Mesh {
		const transformed = this.vertices.map((v) => {
			return Mat.rot(rotation.neg(), true).apply(v.vSub(position));
		});

		return new Mesh(transformed, this.color);
	}
}
