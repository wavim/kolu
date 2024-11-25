import { Cam } from "./camera";
import { Tri } from "../primitives/triangle";

export class Scene {
	triangles: (Tri | null)[] = [];
	camera: Cam;

	constructor(cam?: Cam) {
		this.camera = cam ?? new Cam();
	}

	putTri(tri: Tri): number {
		return this.triangles.push(tri) - 1;
	}

	rmTri(i: number): void {
		this.triangles[i] = null;
	}
}
