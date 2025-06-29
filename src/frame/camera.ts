import { Vec } from "../maths/vec";

export class Camera {
	constructor(
		public position = Vec.zero(3),
		public rotation = Vec.zero(3),
		public fov = 90,
	) {}
}
