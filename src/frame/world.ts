import { Model } from "../object/model";

export class World {
	next = 0;
	readonly modelStore = new Map<number, Model>();

	get models(): Model[] {
		return Array.from(this.modelStore.values());
	}

	push(model: Model): number {
		this.modelStore.set(this.next, model);

		return this.next++;
	}

	remove(i: number): boolean {
		return this.modelStore.delete(i);
	}
}
