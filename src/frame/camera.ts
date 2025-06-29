import { Vec } from "../maths/vec";

export class Camera {
	constructor(
		public pos = Vec.zero(3),
		public rot = Vec.zero(3),
		public fov = 90,
	) {}
}
