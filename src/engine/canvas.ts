export class KCanvas {
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;

	constructor(canvas?: HTMLCanvasElement, options?: { noAlpha?: boolean }) {
		this.canvas = canvas ?? document.createElement("canvas");
		this.context = this.canvas.getContext("2d", {
			alpha: !options?.noAlpha,
		});
	}
}
