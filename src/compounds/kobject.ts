import { Mat } from "../maths/matrix";
import { Vec } from "../maths/vector";
import { Tri } from "../primitives/triangle";
import { TriVertices, Vec3 } from "../types";

export class KObject {
	transform: Mat = Mat.id(4);
	_offset: Vec;
	_origin: Vec;

	constructor(public triangles: Tri[], offset: Vec | Vec3 = [0, 0, 0], origin: Vec | Vec3 = [0, 0, 0]) {
		this._offset = Vec.from(offset);
		this._origin = Vec.from(origin);
	}

	set offset(offset: Vec | Vec3) {
		this._offset = Vec.from(offset);
	}
	set origin(origin: Vec | Vec3) {
		this._origin = Vec.from(origin);
	}
	get offset(): Vec {
		return this._offset;
	}
	get origin(): Vec {
		return this._origin;
	}

	getTris(): Tri[] {
		return this.triangles.map((tri) => {
			return new Tri(
				...(<TriVertices>tri.vertices.map((vertex) => {
					const transVertex = this.transform.transformHomo(Vec.sub(vertex, this.origin));
					return Vec.add(this.offset, Vec.add(transVertex, this.origin));
				})),
				tri.fill,
			);
		});
	}
}
