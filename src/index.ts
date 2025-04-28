import { Cvs } from "./engine/canvas";
import { Scene } from "./engine/scene";
import { Mat } from "./maths/matrix";
import { Vec } from "./maths/vector";
import { Obj } from "./objects/object";
import { Tri } from "./primitives/triangle";
import { lerp } from "./utils/lerp";

const configs = {
	// disables backdrop alpha, still allows rgba but is sped up
	solidbg: false,
	// desync canvas from event loops
	desync: true,
	// only draw wireframes
	wireframe: false,
	// disables sub-pixel rendering but causes alias issues
	round: false,
	// mouse x sensitivities (x180deg)
	xsens: 1.5,
	// mouse y sensitivities (x180deg)
	ysens: 1,
	// move distance
	mvdist: 100,
	// move accel decay rate
	mvdecay: 0.97,
	// number of cubes
	cubecnt: 20,
	// rgba alpha of cubes
	cubealpha: 1,
};

const cvsEle = <HTMLCanvasElement>document.getElementById("canvas3d");
const main = () => {
	const h = (cvsEle.height = window.innerHeight);
	const w = (cvsEle.width = window.innerWidth);

	const cvs = new Cvs(cvsEle, configs);
	const scene = new Scene();
	const render = () => scene.render(cvs, configs);

	type axis = `${0 | 1}${0 | 1}${0 | 1}`;
	const getTri = (
		x: axis,
		y: axis,
		z: axis,
		rgb: `${number},${number},${number}`,
	) => {
		return new Tri(
			<[Vec.vec3, Vec.vec3, Vec.vec3]>(
				[x, y, z].map((axis) => axis.split("").map((v) => (+v ? w : 0)))
			),
			`rgba(${rgb},${configs.cubealpha})`,
		);
	};

	const tris: Tri[] = [
		//top
		getTri("001", "101", "011", "255,0,0"),
		getTri("011", "101", "111", "255,0,0"),

		//bottom
		// getTri("000", "100", "110", "0,255,0"),
		// getTri("000", "010", "110", "0,255,0"),

		//front
		getTri("000", "100", "101", "0,0,255"),
		getTri("000", "001", "101", "0,0,255"),

		//back
		// getTri("010", "110", "011", "0,0,0"),
		// getTri("110", "011", "111", "0,0,0"),

		//left
		getTri("010", "000", "001", "255,255,0"),
		getTri("010", "011", "001", "255,255,0"),

		//right
		// getTri("100", "110", "111", "0,255,255"),
		// getTri("100", "101", "111", "0,255,255"),
	];

	// const ranPos = () => (Math.random() - 0.5) * configs.cubedisp * w;

	const cubes: Obj[] = [];
	for (let i = 0; i < configs.cubecnt; i++) {
		const n = i - configs.cubecnt / 2;

		const obj = new Obj(
			tris,
			// [ranPos(), ranPos(), ranPos()],
			[n * w * 3, -Math.abs(n) * w, -w * 10],
			[w / 2, w / 2, w / 2],
		);
		cubes.push(obj);
		scene.putObj(obj);
	}

	const regVal: number[] = [];
	const ax1Spd: number[] = [];
	const ax2Spd: number[] = [];
	for (let i = 0; i < configs.cubecnt; i++) {
		regVal.push((Math.random() + 1) * 10);
		ax1Spd.push(Math.random());
		ax2Spd.push(Math.random());
	}

	const rotcubes = (time: DOMHighResTimeStamp = 0) => {
		for (let i = 0; i < cubes.length; i++) {
			const tick = time / regVal[i];
			cubes[i].setTransform(
				Mat.rot([tick * ax1Spd[i], tick * ax2Spd[i], 0], {
					deg: true,
				}),
			);
		}
		requestAnimationFrame(rotcubes);
	};
	rotcubes();

	cvsEle.onmousemove = (ev) => {
		scene.cam.setAxisRot(1, (ev.offsetX / w - 0.5) * 360 * configs.xsens);
		scene.cam.setAxisRot(
			2,
			Math.min((ev.offsetY / h - 0.5) * 85 * configs.ysens, 85),
		);
	};

	cvsEle.onkeydown = (ev) => {
		const key = ev.key.toLowerCase();

		switch (key) {
			case "i": {
				lerp(0.001 * Math.PI, 0.97, 0.001, (speed) => (scene.cam.fov -= speed));
				return;
			}
			case "o": {
				lerp(0.001 * Math.PI, 0.97, 0.001, (speed) => (scene.cam.fov += speed));
				return;
			}
		}

		const delta: Vec.vec3 = [0, 0, 0];
		switch (key) {
			case "w":
				delta[2] = configs.mvdist;
				break;
			case "s":
				delta[2] = -configs.mvdist;
				break;
			case "d":
				delta[0] = configs.mvdist;
				break;
			case "a":
				delta[0] = -configs.mvdist;
				break;
		}
		lerp(
			delta,
			configs.mvdecay,
			1,
			(mv) => (scene.cam.pos = Vec.vAdd(scene.cam.pos, mv)),
			Vec.norm,
			Vec.mul,
		);
	};

	let fpsAcc = 0;
	setInterval(() => {
		console.clear();
		console.log("fps", fpsAcc);
		fpsAcc = 0;
	}, 1000);

	let update: FrameRequestCallback;
	(update = () => {
		render();
		fpsAcc++;
		requestAnimationFrame(update);
	})();
};
window.addEventListener("resize", main);
main();
