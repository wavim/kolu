import { Mat } from "../maths/matrix";
import { Vec } from "../maths/vector";
import { Obj } from "../objects/object";
import { Tri } from "../primitives/triangle";
import { Cam } from "./camera";
import { Cvs } from "./canvas";

export class Scene {
	trigs: (Tri | null)[] = [];
	objs: (Obj | null)[] = [];

	constructor(public cam: Cam = new Cam()) {}

	putTri(tri: Tri): number {
		return this.trigs.push(tri) - 1;
	}

	putObj(obj: Obj): number {
		return this.objs.push(obj) - 1;
	}

	rmTri(i: number): void {
		this.trigs[i] = null;
	}

	rmObj(i: number): void {
		this.objs[i] = null;
	}

	render(
		koluCvs: Cvs,
		options?: { wireframe?: boolean; round?: boolean },
	): void {
		this.trigs = this.trigs.filter((tri) => tri);
		this.objs = this.objs.filter((obj) => obj);

		const canvas = koluCvs.canvas;
		const context = koluCvs.context;
		const width = canvas.width;
		const height = canvas.height;

		const cam = this.cam;
		const rotate = Mat.rot(cam.rot);
		const frameAlign = Mat.homo(
			rotate,
			Mat.transform(rotate, Vec.mul(cam.pos, -1)),
		);
		const invDist = (2 * Math.tan(0.5 * cam.fov)) / height;
		const project = <Mat.mat4>[
			[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 0, -1],
			[0, 0, invDist, 0],
		];
		const transform = Mat.mMul(project, frameAlign);

		const objTrigs = this.objs.flatMap((obj) => obj.getTrigs());

		const perspTrigs = [];
		for (const trig of this.trigs.concat(objTrigs)) {
			const projected = trig.vertices.map((v) =>
				Mat.transformHomo(transform, v),
			);

			const z = Math.min(...projected.map((vertex) => vertex[2]));
			if (z < 0) continue;

			perspTrigs.push({
				projected,
				z,
				fill: trig.fill,
			});
		}

		context.clearRect(0, 0, width, height);

		const xMid = Math.round(0.5 * width);
		const yMid = Math.round(0.5 * height);
		for (const trig of perspTrigs.sort(({ z: z1 }, { z: z2 }) => z1 - z2)) {
			let [[x1, y1], [x2, y2], [x3, y3]] = trig.projected;
			if (options?.round) {
				[x1, x2, x3, y1, y2, y3] = [x1, x2, x3, y1, y2, y3].map(Math.round);
			}

			context.beginPath();
			context.moveTo(xMid + x1, yMid - y1);
			context.lineTo(xMid + x2, yMid - y2);
			context.lineTo(xMid + x3, yMid - y3);

			if (options?.wireframe) {
				context.lineTo(xMid + x1, yMid - y1);
				context.stroke();
				continue;
			}
			context.fillStyle = trig.fill;
			context.fill();
		}
	}
}
