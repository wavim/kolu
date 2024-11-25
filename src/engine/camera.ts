import { Vec } from "../maths/vector";
import { Vec3 } from "../types";

export class Cam {
	_pos: Vec;
	_rot: Vec;

	constructor(
		pos?: Vec | Vec3,
		rot?: Vec | Vec3,
		public fov: number = Math.PI / 2,
	) {
		this._pos = Vec.from(pos ?? [0, 0, 0]);
		this._rot = Vec.from(rot ?? [0, 0, Math.PI]);
	}

	set pos(pos: Vec | Vec3) {
		this._pos = Vec.from(pos);
	}
	set rot(rot: Vec | Vec3) {
		this._rot = Vec.from(rot);
	}
	get pos(): Vec {
		return this._pos;
	}
	get rot(): Vec {
		return this._rot;
	}
}
