import { Mat } from "../maths/mat";
import { Vec } from "../maths/vec";

export class Mesh {
	constructor(
		readonly vertices: Vec[],
		readonly color = "black",
	) {}

	transform(origin: Vec, offset: Vec, matrix: Mat): Mesh {
		const vertices = this.vertices.map((v) => {
			const local = v.vSub(origin);
			const trans = matrix.homopply(local);

			return trans.vAdd(origin).vAdd(offset);
		});

		return new Mesh(vertices, this.color);
	}
}
