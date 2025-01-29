import { Cvs } from "./engine/canvas";
import { Scene } from "./engine/scene";
import { Mat } from "./maths/matrix";
import { Vec } from "./maths/vector";
import { Obj } from "./objects/object";
import { Tri } from "./primitives/triangle";

//#region CONFIGS
// disables backdrop alpha only
// still allows drawing rgba, but sped up
const NOALPHA = false;
// desync canvas from event loops
const DESYNC = true;
const WIREFRAME = true;
// disables sub-pixel rendering
// not recommended, alias issues
const ROUND = false;
// mouse x and y sensitivities * 180deg
const XSENS = 1.5;
const YSENS = 1;
// move distance on WASD
const MVDIST = 75;
// move accel decay rate
const MVDECAY = 0.95;
// cube size * canvas width
const CUBESCALE = 1;
const CUBECNT = 30;
// cube dispersion in space
const CUBEDISP = 15;
const CUBEALPHA = 1;
//#endregion CONFIGS

const cvs = <HTMLCanvasElement>document.getElementById("canvas3d");
cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

const koluCvs = new Cvs(cvs, {
	noAlpha: NOALPHA,
	desync: DESYNC,
});
const scene = new Scene();
const render = () => {
	scene.render(koluCvs, {
		wireframe: WIREFRAME,
		round: ROUND,
	});
};

const w = cvs.width * CUBESCALE;
const cubeTrigs = [
	//top
	new Tri(
		[
			[0, 0, w],
			[w, 0, w],
			[0, w, w],
		],
		`rgba(255,0,0,${CUBEALPHA})`,
	),
	new Tri(
		[
			[0, w, w],
			[w, 0, w],
			[w, w, w],
		],
		`rgba(255,0,0,${CUBEALPHA})`,
	),

	//bottom
	new Tri(
		[
			[0, 0, 0],
			[w, 0, 0],
			[w, w, 0],
		],
		`rgba(0,255,0,${CUBEALPHA})`,
	),
	new Tri(
		[
			[0, 0, 0],
			[0, w, 0],
			[w, w, 0],
		],
		`rgba(0,255,0,${CUBEALPHA})`,
	),

	//front
	new Tri(
		[
			[0, 0, 0],
			[w, 0, 0],
			[w, 0, w],
		],
		`rgba(0,0,255,${CUBEALPHA})`,
	),
	new Tri(
		[
			[0, 0, 0],
			[0, 0, w],
			[w, 0, w],
		],
		`rgba(0,0,255,${CUBEALPHA})`,
	),

	//back
	new Tri(
		[
			[0, w, 0],
			[w, w, 0],
			[0, w, w],
		],
		`rgba(0,0,0,${CUBEALPHA})`,
	),
	new Tri(
		[
			[w, w, 0],
			[0, w, w],
			[w, w, w],
		],
		`rgba(0,0,0,${CUBEALPHA})`,
	),

	//left
	new Tri(
		[
			[0, w, 0],
			[0, 0, 0],
			[0, 0, w],
		],
		`rgba(255,255,0,${CUBEALPHA})`,
	),
	new Tri(
		[
			[0, w, 0],
			[0, w, w],
			[0, 0, w],
		],
		`rgba(255,255,0,${CUBEALPHA})`,
	),

	//right
	new Tri(
		[
			[w, 0, 0],
			[w, w, 0],
			[w, w, w],
		],
		`rgba(0,255,255,${CUBEALPHA})`,
	),
	new Tri(
		[
			[w, 0, 0],
			[w, 0, w],
			[w, w, w],
		],
		`rgba(0,255,255,${CUBEALPHA})`,
	),
];

const cubeObjs: Obj[] = [];
for (let i = 0; i < CUBECNT; i++) {
	cubeObjs.push(
		new Obj(
			cubeTrigs,
			[
				(Math.random() - 0.5) * CUBEDISP * w,
				(Math.random() - 0.5) * CUBEDISP * w,
				(Math.random() - 0.5) * CUBEDISP * w,
			],
			[w / 2, w / 2, w / 2],
		),
	);
}
for (const cubeObj of cubeObjs) scene.putObj(cubeObj);

cvs.onmousemove = (ev) => {
	scene.cam.setAxisRot(1, (ev.offsetX / cvs.width - 0.5) * 360 * XSENS);
	scene.cam.setAxisRot(2, Math.min((ev.offsetY / cvs.height - 0.5) * 85 * YSENS, 85));
};

cvs.onkeydown = (ev) => {
	const key = ev.key.toLowerCase();
	const delta: Vec.vec3 = [0, 0, 0];
	switch (key) {
		case "w":
			delta[2] = -MVDIST;
			break;
		case "s":
			delta[2] = MVDIST;
			break;
		case "d":
			delta[0] = -MVDIST;
			break;
		case "a":
			delta[0] = MVDIST;
			break;
	}
	const worldMoveVec = Mat.transform(Mat.rot(scene.cam.rot), delta);

	const move = (worldMove: Vec.vec3) => {
		if (Vec.norm(worldMove) < 1) return;
		scene.cam.pos = Vec.vAdd(scene.cam.pos, worldMove);
		requestAnimationFrame(() => move(Vec.mul(worldMove, MVDECAY)));
	};
	move(worldMoveVec);
};

const slowDownConst = [...Array(cubeObjs.length)].map(() => (Math.random() + 1) * 10);
const axis1Speed = [...Array(cubeObjs.length)].map(() => Math.random());
const axis2Speed = [...Array(cubeObjs.length)].map(() => Math.random());
const rotCube = (timestamp: DOMHighResTimeStamp) => {
	for (let i = 0; i < cubeObjs.length; i++) {
		const globSpeed = timestamp / slowDownConst[i];
		cubeObjs[i].setTransform(Mat.rot([globSpeed * axis1Speed[i], globSpeed * axis2Speed[i], 0], { deg: true }));
	}
	requestAnimationFrame(rotCube);
};
rotCube(0);

let fpsAcc = 0;
setInterval(() => {
	console.clear();
	console.log("fps", fpsAcc);
	fpsAcc = 0;
}, 1000);

const main = () => {
	render();
	fpsAcc++;
	requestAnimationFrame(main);
};
main();
