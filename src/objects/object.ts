import { Mat } from "../maths/matrix";
import { Vec } from "../maths/vector";
import { Tri } from "../primitives/triangle";

export class Obj {
	constructor(
		public trigs: Tri[],
		public offset: Vec.vec3 = [0, 0, 0],
		public origin: Vec.vec3 = [0, 0, 0],
		public transform: Mat.mat4 = Mat.id(4),
	) {}

	setTransform(m: Mat.mat3 | Mat.mat4): void {
		this.transform = m.length === 3 ? Mat.homo(m) : m;
	}

	getTrigs(): Tri[] {
		return this.trigs.map((tri) => {
			return new Tri(
				<[Vec.vec3, Vec.vec3, Vec.vec3]>tri.vertices.map((vertex) => {
					const localFrame = Vec.vSub(vertex, this.origin);
					const transformed = Mat.transformHomo(this.transform, localFrame);
					return Vec.vAdd(Vec.vAdd(transformed, this.origin), this.offset);
				}),
			);
		});
	}
}
