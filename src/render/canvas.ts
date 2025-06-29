import { Camera } from "../frame/camera";
import { World } from "../frame/world";
import { Mat } from "../maths/mat";
import { Vec } from "../maths/vec";

export interface RenderOptions {
	wireframe?: boolean;
}

export class Canvas {
	constructor(
		readonly canvas: HTMLCanvasElement,

		options?: CanvasRenderingContext2DSettings,
		readonly context = canvas.getContext("2d", options),
	) {}

	render(
		world: World,
		camera: Camera,

		options?: RenderOptions,
	): void {
		if (!this.context) {
			throw new Error("missing canvas context");
		}

		const { width, height } = this.canvas;

		const rotate = Mat.rot(camera.rot);
		const align = rotate.homo(camera.pos.mul(-1));

		const invDist = (2 * Math.tan(camera.fov / 2)) / height;
		const project = new Mat([
			[1, 0, 0],
			[0, 1, 0],
			[0, 0, 0],
		]).homo(new Vec([0, 0, -1]), new Vec([0, 0, invDist, 0]));

		const transform = project.mMul(align);

		const results: { z: number; projected: Vec[]; color: string }[] = [];

		for (const mesh of world.models.flatMap((m) => m.transformed)) {
			const projected = mesh.vertices.map((v) => transform.homopply(v));

			const minZ = Math.min(...projected.map((v) => v.z));

			if (minZ > 0) {
				results.push({ z: minZ, projected, color: mesh.color });
			}
		}

		results.sort((r1, r2) => r1.z - r2.z);

		this.context.clearRect(0, 0, width, height);

		const mx = Math.round(width / 2);
		const my = Math.round(height / 2);

		for (const { projected, color } of results) {
			this.context.beginPath();

			const ox = mx + projected[0].x;
			const oy = my - projected[0].y;

			this.context.moveTo(ox, oy);

			for (const vertex of projected.slice(1)) {
				this.context.lineTo(mx + vertex.x, my - vertex.y);
			}

			if (options?.wireframe) {
				this.context.lineTo(ox, oy);
				this.context.stroke();

				continue;
			}

			this.context.fillStyle = color;
			this.context.fill();
		}
	}
}
