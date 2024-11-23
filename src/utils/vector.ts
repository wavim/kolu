export namespace Vec {
	export type vec = number[];

	export function log(vec: vec, label?: string): void {
		console.log(`${label ?? ""}${label ? " " : ""}Vec(${vec.length}) ${JSON.stringify(vec)}`);
	}

	export function fill(length: number, x: number): vec {
		return Array(length).fill(x);
	}
	export function zero(length: number): vec {
		return fill(length, 0);
	}
	export function std(length: number, i: number): vec {
		const vec = zero(length);
		vec[i] = 1;
		return vec;
	}

	export function vAdd(vec1: vec, vec2: vec): vec {
		return vec1.map((ele, i) => ele + vec2[i]);
	}
	export function vSub(vec1: vec, vec2: vec): vec {
		return vec1.map((ele, i) => ele - vec2[i]);
	}
	export function dot(vec1: vec, vec2: vec): number {
		let sum = 0;
		for (let i = 0; i < vec1.length; i++) sum += vec1[i] * vec2[i];
		return sum;
	}
	export function cross(vec1: vec, vec2: vec): vec {
		const [a1, a2, a3] = vec1;
		const [b1, b2, b3] = vec2;
		return [a2 * b3 - a3 * b2, a3 * b1 - a1 * b3, a1 * b2 - a2 * b1];
	}

	export function add(vec: vec, x: number): vec {
		return vec.map((ele) => ele + x);
	}
	export function sub(vec: vec, x: number): vec {
		return add(vec, -x);
	}
	export function mul(vec: vec, x: number): vec {
		return vec.map((ele) => ele * x);
	}
	export function div(vec: vec, x: number): vec {
		return mul(vec, 1 / x);
	}

	export function norm(vec: vec): number {
		return dot(vec, vec) ** 0.5;
	}
	export function unit(vec: vec): vec {
		return div(vec, norm(vec));
	}

	export function homo(vec: vec): vec {
		return vec.concat(1);
	}
	export function unhomo(vec: vec): vec {
		return div(vec.slice(0, -1), vec[vec.length - 1]);
	}
}
