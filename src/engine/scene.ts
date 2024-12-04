import { Mat } from "../maths/matrix";
import { Tri } from "../primitives/triangle";
import { Cam } from "./camera";
import { KoluCanvas } from "./canvas";

export class Scene {
	triangles: (Tri | null)[] = [];
	camera: Cam;

	constructor(cam?: Cam) {
		this.camera = cam ?? new Cam();
	}

	putTri(tri: Tri): number {
		return this.triangles.push(tri) - 1;
	}

	rmTri(i: number): void {
		this.triangles[i] = null;
	}

	render(koluCanvas: KoluCanvas) {
		const canvas = koluCanvas.canvas;
		const context = koluCanvas.context;
		const width = canvas.width;
		const height = canvas.height;

		const camera = this.camera;
		const [sA, sB, sC] = camera.rot.map(
			(angle) => -Math.sin(angle),
		);
		const [cA, cB, cC] = camera.rot.map((angle) => Math.cos(angle));
		const yaw = new Mat([cA, -sA, 0], [sA, cA, 0], [0, 0, 1]);
		const pitch = new Mat([cB, 0, sB], [0, 1, 0], [-sB, 0, cB]);
		const roll = new Mat([1, 0, 0], [0, cC, -sC], [0, sC, cC]);
		const rotate = Mat.mul(yaw, Mat.mul(pitch, roll));

		const frameAlign = rotate.homo(
			rotate.apply(camera.pos.mul(-1)),
			[0, 0, 0, 1],
		);

		const invDist = (2 * Math.tan(0.5 * camera.fov)) / height;
		const project = new Mat(
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 0, -1],
			[0, 0, invDist, 0],
		);

		const transform = Mat.mul(project, frameAlign);

		const perspTris = [];
		const zBuffer: number[] = [];
		//MO TODO curr triangles is only primitive
		for (const triangle of this.triangles) {
			if (triangle === null) continue;

			const projVertices = triangle.vertices.map((vertex) =>
				transform.apply(vertex.homo()).unhomo(),
			);

			const z = Math.min(
				...projVertices.map((vertex) => vertex[2]),
			);
			if (z < 0) continue;

			perspTris.push({
				zBi: zBuffer.length,
				vertices: projVertices,
				fill: triangle.fill,
			});
			zBuffer.push(z);
		}

		context.clearRect(0, 0, width, height);
		for (const { vertices, fill } of perspTris.sort(
			({ zBi: zBi1 }, { zBi: zBi2 }) =>
				zBuffer[zBi2] - zBuffer[zBi1],
		)) {
			//MO TODO optimize
			//MO DEV wireframe for testing
			const [[x1, y1], [x2, y2], [x3, y3]] = vertices;
			// context.fillStyle = fill;
			context.beginPath();
			context.moveTo(0.5 * width + x1, 0.5 * height - y1);
			context.lineTo(0.5 * width + x2, 0.5 * height - y2);
			context.lineTo(0.5 * width + x3, 0.5 * height - y3);
			context.lineTo(0.5 * width + x1, 0.5 * height - y1);
			// context.fill();
			context.stroke();
		}
	}
}
