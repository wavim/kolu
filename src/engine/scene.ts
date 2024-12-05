import { KObject } from "../compounds/kobject";
import { Mat } from "../maths/matrix";
import { Tri } from "../primitives/triangle";
import { Cam } from "./camera";
import { KCanvas } from "./canvas";

export class Scene {
	triangles: (Tri | null)[] = [];
	kObjects: (KObject | null)[] = [];
	camera: Cam;

	constructor(cam?: Cam) {
		this.camera = cam ?? new Cam();
	}

	putTri(tri: Tri): number {
		return this.triangles.push(tri) - 1;
	}
	putKObj(kObj: KObject): number {
		return this.kObjects.push(kObj) - 1;
	}
	rmTri(i: number): void {
		this.triangles[i] = null;
	}
	rmKObj(i: number): void {
		this.kObjects[i] = null;
	}

	render(kCanvas: KCanvas, options?: { wireframe?: boolean }) {
		const canvas = kCanvas.canvas;
		const context = kCanvas.context;
		const width = canvas.width;
		const height = canvas.height;
		const cam = this.camera;

		const rotate = Mat.rot(cam.rot);
		const frameAlign = rotate.homo(rotate.transform(cam.pos.mul(-1)));
		const invDist = (2 * Math.tan(0.5 * cam.fov)) / height;
		const project = new Mat([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, -1], [0, 0, invDist, 0]);
		const transform = Mat.mul(project, frameAlign);

		const kObjTris = this.kObjects.flatMap((kObj) => kObj.getTris());
		const perspTris = [];
		const zBuffer: number[] = [];

		//MO TODO curr triangles is only primitive
		for (const triangle of this.triangles.concat(kObjTris)) {
			if (triangle === null) continue;

			const projVertices = triangle.vertices.map(transform.transformHomo, transform);

			const z = Math.min(...projVertices.map((vertex) => vertex[2]));
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
			({ zBi: zBi1 }, { zBi: zBi2 }) => zBuffer[zBi1] - zBuffer[zBi2],
		)) {
			const [[x1, y1], [x2, y2], [x3, y3]] = vertices;
			context.fillStyle = fill;
			context.beginPath();
			context.moveTo(0.5 * width + x1, 0.5 * height - y1);
			context.lineTo(0.5 * width + x2, 0.5 * height - y2);
			context.lineTo(0.5 * width + x3, 0.5 * height - y3);
			context.lineTo(0.5 * width + x1, 0.5 * height - y1);
			if (options?.wireframe) context.stroke();
			else context.fill();
		}
	}
}
