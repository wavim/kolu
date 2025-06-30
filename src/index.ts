import { Camera } from "./frame/camera";
import { World } from "./frame/world";
import { Mat } from "./maths/mat";
import { Vec } from "./maths/vec";
import { Mesh } from "./object/mesh";
import { Model } from "./object/model";
import { Canvas, RenderOptions } from "./render/canvas";
import { lerp } from "./utils/lerp";

type Options = CanvasRenderingContext2DSettings &
	RenderOptions & { modelCount: number; modelWidth: number };

const options: Required<Options> = {
	alpha: true,
	colorSpace: "srgb",
	desynchronized: true,
	willReadFrequently: false,

	wireframe: false,

	modelCount: 7,
	modelWidth: 1000,
};

const world = new World();
const camera = new Camera();

const canvas = new Canvas(document.getElementById("canvas") as HTMLCanvasElement, options);
const width = document.documentElement.clientWidth;
const height = document.documentElement.clientHeight;
canvas.canvas.width = width;
canvas.canvas.height = height;

function render(): void {
	canvas.render(world, camera, options);
}

type GrayAxis = `${0 | 1}${0 | 1}${0 | 1}`;
function mesh(a: GrayAxis, b: GrayAxis, c: GrayAxis, d: GrayAxis, color?: string): Mesh {
	const vertices = [a, b, c, d].map((g) => {
		return new Vec(g.split("").map((v) => +v * options.modelWidth));
	});

	return new Mesh(vertices, color);
}

const meshes = [
	// front
	mesh("001", "011", "111", "101", "hsl(120, 100%, 50%)"),
	// back
	mesh("000", "010", "110", "100", "hsl(270, 100%, 50%)"),
	// top
	mesh("010", "011", "111", "110", "hsl(210, 100%, 50%)"),
	// bottom
	mesh("000", "001", "101", "100", "hsl(30, 100%, 50%)"),
	// left
	mesh("000", "010", "011", "001", "hsl(0, 100%, 50%)"),
	// right
	mesh("100", "110", "111", "101", "hsl(180, 100%, 50%)"),
];

const models: Model[] = [];

const c = options.modelCount;
const w = options.modelWidth;
const m = 0.5 * w;
for (let i = 0; i < c; i++) {
	const n = i - 0.5 * c;

	const model = new Model(
		meshes,
		new Vec([m, m, m]),
		new Vec([2 * n * w, (Math.abs(n) - 0.25 * c) * w, -10 * w]),
	);
	world.push(model);
	models.push(model);
}

const rXv: number[] = [];
const rYv: number[] = [];

for (let i = 0; i < options.modelCount; i++) {
	rXv.push(Math.random());
	rYv.push(Math.random());
}

function rotateModels(time: DOMHighResTimeStamp = 0): void {
	for (let i = 0; i < options.modelCount; i++) {
		const tick = time / 1000;

		models[i].transform = Mat.rot(new Vec([tick * rXv[i], tick * rYv[i], 0]));
	}

	requestAnimationFrame(rotateModels);
}
rotateModels();

canvas.canvas.onmousemove = (ev) => {
	camera.rotation = new Vec([
		(ev.offsetX / width - 0.5) * 180,
		(ev.offsetY / height - 0.5) * 90,
		0,
	]);
};

canvas.canvas.onkeydown = (ev) => {
	const key = ev.key.toLowerCase();

	const mv = (u: Vec) => {
		lerp(
			u,
			0.95,
			(v) => {
				camera.position = camera.position.vSub(
					Mat.rot(camera.rotation, true).apply(v),
				);
			},
			(u, a) => (u.norm() < 0.1 ? undefined : u.mul(a)),
		);
	};

	switch (key) {
		case "f": {
			options.wireframe = !options.wireframe;
			return;
		}
		case "i": {
			lerp(
				1,
				0.95,
				(v) => (camera.fov -= v),
				(u, a) => (u < 0.1 ? undefined : u * a),
			);
			return;
		}
		case "o": {
			lerp(
				1,
				0.95,
				(v) => (camera.fov += v),
				(u, a) => (u < 0.1 ? undefined : u * a),
			);
			return;
		}
		case "w": {
			mv(new Vec([0, 0, w * 0.1]));
			return;
		}
		case "s": {
			mv(new Vec([0, 0, -w * 0.1]));
			return;
		}
		case "a": {
			mv(new Vec([w * 0.1, 0, 0]));
			return;
		}
		case "d": {
			mv(new Vec([-w * 0.1, 0, 0]));
			return;
		}
		case "q": {
			mv(new Vec([0, w * 0.1, 0]));
			return;
		}
		case "e": {
			mv(new Vec([0, -w * 0.1, 0]));
			return;
		}
	}
};

function main(): void {
	render();
	requestAnimationFrame(main);
}
main();
