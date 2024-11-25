import { KoluCanvas } from "./canvas";
import { Mat } from "../maths/matrix";
import { Scene } from "./scene";

//MO DEV test in wireframe first
export function render(koluCanvas: KoluCanvas, scene: Scene) {
	const canvas = koluCanvas.canvas;
	const context = koluCanvas.context;

	const width = canvas.width;
	const height = canvas.height;
	const aspect = width / height;

	const camera = scene.camera;
	const [dx, dy, dz] = camera.pos;

	const [sA, sB, sC] = camera.rot.map((angle) => -Math.sin(angle));
	const [cA, cB, cC] = camera.rot.map((angle) => Math.cos(angle));

	//MO FORGOT rotate and shift matrix
	const coordMatrix = new Mat();

	const d = 1 / Math.tan(0.5 * camera.fov);

	//MO DEV clip planes' value only for testing
	const near = 0.5 * height * d;
	const far = near * 3;

	const vd = near - far;
	const projMatrix = new Mat(
		[d / aspect, 0, 0, 0],
		[0, d, 0, 0],
		[0, 0, (-near - far) / vd, (2 * near * far) / vd],
		[0, 0, 1, 0],
	);

	const projTris = [];
	const zBuffer = [];
	//MO TODO curr triangles is only primitive
	for (const triangle of scene.triangles) {
		if (triangle === null) continue;

		const ndcVertices = triangle.vertices.map((vertex) =>
			transform.apply(vertex.homo()),
		);

		if (
			ndcVertices.some((vertex) =>
				vertex.some((c) => Math.abs(c) > 1),
			)
		)
			continue;

		projTris.push({
			zBi: zBuffer.length,
			vertices: ndcVertices.map((vertex) => vertex.unhomo()),
			fill: triangle.fill,
		});
		zBuffer.push(
			Math.min(...ndcVertices.map((vertex) => vertex[2])),
		);
	}

	context.clearRect(0, 0, width, height);
	for (const { vertices, fill } of projTris.sort(
		({ zBi: zBi1 }, { zBi: zBi2 }) => zBuffer[zBi2] - zBuffer[zBi1],
	)) {
		context.fillStyle = fill;
		context.beginPath();
		context.moveTo(...vertices[0]);
		context.lineTo(...vertices[1]);
		context.lineTo(...vertices[2]);
		// context.fill();
		context.stroke();
	}
}
