export class Cvs {
	canvas: HTMLCanvasElement;
	alpha: boolean;
	desync: boolean;
	context: CanvasRenderingContext2D;

	constructor(
		canvas?: HTMLCanvasElement,
		options?: { solidbg?: boolean; desync?: boolean },
	) {
		this.canvas = canvas ?? document.createElement("canvas");
		this.alpha = !options?.solidbg;
		this.desync = !!options?.desync;
		this.context = this.canvas.getContext("2d", {
			alpha: this.alpha,
			desynchronized: this.desync,
		});
	}
}
