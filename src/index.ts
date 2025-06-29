import { Natlog } from "natural-log";

import { Camera } from "./frame/camera";
import { World } from "./frame/world";
import { Mat } from "./maths/mat";
import { Vec } from "./maths/vec";
import { Mesh } from "./object/mesh";
import { Model } from "./object/model";
import { Canvas, RenderOptions } from "./render/canvas";

new Natlog({ console: false });

type Options = CanvasRenderingContext2DSettings &
	RenderOptions & { modelCount: number; modelAlpha: number; modelWidth: number };

const options: Required<Options> = {
	alpha: true,
	colorSpace: "srgb",
	desynchronized: true,
	willReadFrequently: false,

	wireframe: false,

	modelCount: 1,
	modelAlpha: 1,
	modelWidth: 1000,
};

const world = new World();
const camera = new Camera();

const canvas = new Canvas(document.getElementById("canvas") as HTMLCanvasElement, options);
canvas.canvas.width = document.documentElement.clientWidth;
canvas.canvas.height = document.documentElement.clientHeight;

function render(): void {
	canvas.render(world, camera, options);
}

type GrayAxis = `${0 | 1}${0 | 1}${0 | 1}`;

function mesh(x: GrayAxis, y: GrayAxis, z: GrayAxis, color?: string): Mesh {
	const vertices = [x, y, z].map((g) => {
		return new Vec(g.split("").map((v) => +v * options.modelWidth));
	});

	return new Mesh(vertices, color);
}

const meshes = [
	// top
	mesh("010", "011", "111", "hsl(210, 100%, 50%)"),
	mesh("010", "110", "111", "hsl(210, 100%, 50%)"),

	// bottom
	mesh("000", "001", "101", "hsl(30, 100%, 50%)"),
	mesh("000", "100", "101", "hsl(30, 100%, 50%)"),

	// front
	mesh("001", "011", "111", "hsl(120, 100%, 50%)"),
	mesh("001", "101", "111", "hsl(120, 100%, 50%)"),

	// back
	mesh("000", "010", "110", "hsl(270, 100%, 50%)"),
	mesh("000", "100", "110", "hsl(270, 100%, 50%)"),

	// left
	mesh("000", "010", "011", "hsl(0, 100%, 50%)"),
	mesh("000", "001", "011", "hsl(0, 100%, 50%)"),

	// right
	mesh("100", "110", "111", "hsl(180, 100%, 50%)"),
	mesh("100", "101", "111", "hsl(180, 100%, 50%)"),
];

// const models: Model[] = [];

// for (let i = 0; i < options.modelCount; i++) {
// 	const n = i - options.modelCount / 2;

// 	const model = new Model(
// 		meshes,
// 		new Vec([0.5, 0.5, 0.5]),
// 		new Vec([n * 3, -Math.abs(n), -5]),
// 	);
// 	world.push(model);
// 	models.push(model);
// }

const model = new Model(
	meshes,

	Vec.fill(3, options.modelWidth / 2),
	new Vec([0, 0, -2 * options.modelWidth]),
);
world.push(model);

// const rXv: number[] = [];
// const rYv: number[] = [];

// for (let i = 0; i < options.modelCount; i++) {
// 	rXv.push(Math.random());
// 	rYv.push(Math.random());
// }

// function rotateModels(time: DOMHighResTimeStamp = 0): void {
// 	for (let i = 0; i < options.modelCount; i++) {
// 		const tick = time / 1000;

// 		models[i].transform = Mat.rot(new Vec([tick * rXv[i], tick * rYv[i], 0]));
// 	}

// 	requestAnimationFrame(rotateModels);
// }
// rotateModels();

// scene.cam.rot = [0, 0, Math.PI];

canvas.canvas.onmousemove = (ev) => {
	camera.rotation = new Vec([
		(ev.offsetX / screen.width - 0.5) * 360 * 2,
		(ev.offsetY / screen.height - 0.5) * 90,
		0,
	]);
};

// canvasElement.onkeydown = (ev) => {
// 	const key = ev.key.toLowerCase();

// 	switch (key) {
// 		case "i": {
// 			lerp(0.001 * Math.PI, 0.97, 0.001, (speed) => (scene.cam.fov -= speed));
// 			return;
// 		}
// 		case "o": {
// 			lerp(0.001 * Math.PI, 0.97, 0.001, (speed) => (scene.cam.fov += speed));
// 			return;
// 		}
// 	}

// 	const delta: Vec.vec3 = [0, 0, 0];
// 	switch (key) {
// 		case "w": {
// 			delta[0] = configs.mvdist;
// 			break;
// 		}
// 		// case "s": {
// 		// 	delta[2] = -configs.mvdist;
// 		// 	break;
// 		// }
// 		// case "d": {
// 		// 	delta[0] = configs.mvdist;
// 		// 	break;
// 		// }
// 		// case "a": {
// 		// 	delta[0] = -configs.mvdist;
// 		// 	break;
// 		// }
// 	}
// 	lerp(
// 		delta,
// 		configs.mvdecay,
// 		1,
// 		(mv) => {
// 			// console.log(scene.cam.pos);
// 			Mat.log(Mat.rot(scene.cam.rot));
// 			scene.cam.pos = Vec.vSub(
// 				scene.cam.pos,
// 				Mat.transform(Mat.rot(scene.cam.rot), mv),
// 			);
// 		},
// 		Vec.norm,
// 		Vec.mul,
// 	);
// };

// let fpsAcc = 0;
// setInterval(() => {
// 	console.clear();
// 	console.log("fps", fpsAcc);
// 	fpsAcc = 0;
// }, 1000);

// function main(): void {
// 	render();
// 	requestAnimationFrame(main);
// }

// main();

render();
