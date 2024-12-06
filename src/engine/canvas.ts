export class Cvs {
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;
	alphaOn: boolean;

	constructor(canvas?: HTMLCanvasElement, options?: { noAlpha?: boolean }) {
		this.canvas = canvas ?? document.createElement("canvas");
		this.alphaOn = !options?.noAlpha;
		this.context = this.canvas.getContext("2d", {
			alpha: this.alphaOn,
		});
	}
}
