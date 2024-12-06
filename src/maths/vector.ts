export namespace Vec {
	export type vec3 = [number, number, number];

	export type vec4 = [number, number, number, number];

	export type vec = vec3 | vec4;

	export function log(v: vec, lbl?: any): void {
		console.log(`${lbl ?? ""}${lbl ? " ~ " : ""}vec(${v.length}) ${JSON.stringify(v)}`);
	}

	export function vAdd<vecD extends vec>(u: vecD, v: vecD): vecD {
		return <vecD>u.map((ele, i) => ele + v[i]);
	}

	export function vSub<vecD extends vec>(u: vecD, v: vecD): vecD {
		return <vecD>u.map((ele, i) => ele - v[i]);
	}

	export function dot(u: vec, v: vec): number {
		let sum = 0;
		for (let i = 0; i < u.length; i++) sum += u[i] * v[i];
		return sum;
	}

	export function cross(u: vec3, v: vec3): vec3 {
		const [a1, a2, a3] = u;
		const [b1, b2, b3] = v;
		return [a2 * b3 - a3 * b2, a3 * b1 - a1 * b3, a1 * b2 - a2 * b1];
	}

	export function add<vecD extends vec>(v: vecD, x: number): vecD {
		return <vecD>v.map((ele) => ele + x);
	}

	export function sub<vecD extends vec>(v: vecD, x: number): vecD {
		return add(v, -x);
	}

	export function mul<vecD extends vec>(v: vecD, x: number): vecD {
		return <vecD>v.map((ele) => ele * x);
	}

	export function div<vecD extends vec>(v: vecD, x: number): vecD {
		return mul(v, 1 / x);
	}

	export function norm(v: vec): number {
		return dot(v, v) ** 0.5;
	}

	export function unit<vecD extends vec>(v: vecD): vecD {
		return div(v, norm(v));
	}

	export function homo(v: vec3): vec4 {
		return <vec4>v.concat(1);
	}

	export function unhomo(v: vec4): vec3 {
		return <vec3>div(<vec3>v.slice(0, -1), v.at(-1));
	}
}
