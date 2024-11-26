import { KoluCanvas } from "./canvas";
import { Mat } from "../maths/matrix";
import { Scene } from "./scene";
import { Vec } from "../maths/vector";

//MO DEV test in wireframe first
export function render(koluCanvas: KoluCanvas, scene: Scene) {
	const canvas = koluCanvas.canvas;
	const context = koluCanvas.context;

	const width = canvas.width;
	const height = canvas.height;
	const ar = width / height;

	const camera = scene.camera;

	const [sA, sB, sC] = camera.rot.map((angle) => -Math.sin(angle));
	const [cA, cB, cC] = camera.rot.map((angle) => Math.cos(angle));
	const yaw = new Mat([cA, -sA, 0], [sA, cA, 0], [0, 0, 1]);
	const pitch = new Mat([cB, 0, sB], [0, 1, 0], [-sB, 0, cB]);
	const roll = new Mat([1, 0, 0], [0, cC, -sC], [0, sC, cC]);
	const rotTransform = Mat.mul(yaw, Mat.mul(pitch, roll));

	//MO DEV continue here, rot matrix fixed
	//MO DEV investigate homo-mat4x4, rot or transl first

	const inverseFocal = (Math.tan(0.5 * camera.fov) / 0.5) * height;
	//MO DEV clip planes' value only for testing
	// // const near = 0.5 * height * d;
	// const near = 10;
	// const far = near * 3;

	// const vd = 1 / (near - far);

	//MO FIX broken as heck
	const projTransform = new Mat(
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, inverseFocal],
	);

	// const transform = Mat.mul(projTransform, viewTransform);

	const projTris = [];
	const zBuffer: number[] = [];
	//MO TODO curr triangles is only primitive
	for (const triangle of scene.triangles) {
		if (triangle === null) continue;

		const relVertices = triangle.vertices.map((vertex) =>
			rotTransform.apply(Vec.sub(vertex, camera.pos)),
		);
		console.log(relVertices);
		//MO TODO culling

		const projVertices = relVertices.map(
			(vertex) => projTransform.apply(vertex).unhomo(),
			// transform.apply(vertex.homo()).unhomo(),
		);

		// if (
		// 	projVertices.some((vertex) =>
		// 		vertex.some((c) => Math.abs(c) > 1),
		// 	)
		// )
		// 	continue;

		projTris.push({
			zBi: zBuffer.length,
			vertices: projVertices,
			fill: triangle.fill,
		});
		zBuffer.push(
			Math.min(...relVertices.map((vertex) => vertex[2])),
		);
	}

	// console.log(
	// 	JSON.stringify(
	// 		projTris.map(({ vertices }) =>
	// 			vertices.map((v) => v.map(Math.round)),
	// 		),
	// 	),
	// );
	context.clearRect(0, 0, width, height);
	console.log(projTris);
	for (const { vertices, fill } of projTris.sort(
		({ zBi: zBi1 }, { zBi: zBi2 }) => zBuffer[zBi2] - zBuffer[zBi1],
	)) {
		const [[x1, y1], [x2, y2], [x3, y3]] = vertices;
		context.fillStyle = fill;
		context.beginPath();
		context.moveTo(0.5 * width + x1, 0.5 * height - y1);
		context.lineTo(0.5 * width + x2, 0.5 * height - y2);
		context.lineTo(0.5 * width + x3, 0.5 * height - y3);
		context.lineTo(0.5 * width + x1, 0.5 * height - y1);
		// context.fill();
		//MO DEV wireframe for testing
		context.stroke();
	}
}
