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

		const r = 0.5 * width;
		const t = 0.5 * height;
		const n = (0.5 * width) / Math.tan((camera.fov * Math.PI) / 360);

		const project = new Mat([
			[n / r, 0, 0],
			[0, n / t, 0],
			[0, 0, -1],
		]).homo(new Vec([0, 0, -2 * n]), new Vec([0, 0, -1, 0]));

		const meshes = world.models.flatMap((m) => {
			return m.worldspace.map((w) => {
				return w.eyespace(camera.position, camera.rotation);
			});
		});

		const mapped: { ndcs: Vec[]; maxz: number; color: string }[] = [];

		for (const { vertices, color } of meshes) {
			const ndcs = vertices.map((v) => project.homopply(v));

			const maxz = Math.max(...ndcs.map((n) => n.z));

			if (Math.abs(maxz) > 1) {
				continue;
			}

			mapped.push({ ndcs, color, maxz });
		}

		mapped.sort((m1, m2) => m2.maxz - m1.maxz);

		this.context.clearRect(0, 0, width, height);

		const mx = Math.round(0.5 * width);
		const my = Math.round(0.5 * height);

		for (const { ndcs, color } of mapped) {
			this.context.beginPath();

			const ox = (ndcs[0].x + 1) * mx;
			const oy = (1 - ndcs[0].y) * my;

			this.context.moveTo(ox, oy);

			for (const ndc of ndcs.slice(1)) {
				this.context.lineTo((ndc.x + 1) * mx, (1 - ndc.y) * my);
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
