import { Tri } from "../primitives/triangle";

export class Scene {
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	triangles: Tri[] = [];

	//MO TODO allow disabling alpha for perf
	constructor(canvas?: HTMLCanvasElement) {
		this.canvas = canvas ?? document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
	}

	putTri(tri: Tri): number {
		return this.triangles.push(tri) - 1;
	}

	rmTri(i: number): void {
		this.triangles[i] = null;
	}
}
