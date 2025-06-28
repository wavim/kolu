export class Vec<N extends number> {
	constructor(
		readonly vec: number[],
		readonly dim = vec.length as N,
	) {}

	static zero<N extends number>(dim: N): Vec<N> {
		return new Vec(Array(dim).fill(0));
	}

	static id<N extends number>(dim: N, i: number): Vec<N> {
		const data = Array(dim).fill(0);
		data[i] = 1;

		return new Vec(data);
	}

	toString(): string {
		return `Vec<${this.dim.toFixed()}> (${this.vec.map((c) => c.toFixed(2)).join(", ")})`;
	}

	map(fn: (c: number, i: number) => number): Vec<N> {
		return new Vec(this.vec.map(fn));
	}

	vAdd(v: Vec<N>): Vec<N> {
		return this.map((c, i) => c + v.vec[i]);
	}

	vSub(v: Vec<N>): Vec<N> {
		return this.map((c, i) => c - v.vec[i]);
	}

	add(x: number): Vec<N> {
		return this.map((c) => c + x);
	}

	sub(x: number): Vec<N> {
		return this.add(-x);
	}

	mul(x: number): Vec<N> {
		return this.map((c) => c * x);
	}

	div(x: number): Vec<N> {
		return this.mul(1 / x);
	}

	dot(v: Vec<N>): number {
		let sum = 0;

		for (let i = 0; i < this.dim; i++) {
			sum += this.vec[i] * v.vec[i];
		}

		return sum;
	}

	norm(): number {
		return this.dot(this);
	}

	homo(): Vec<4> {
		return new Vec<4>(this.vec.concat(1));
	}

	unhomo(): Vec<3> {
		return new Vec<3>(this.vec.slice(0, 3)).div(this.vec[3]);
	}
}
