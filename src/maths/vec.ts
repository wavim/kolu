export class Vec {
	constructor(
		readonly vec: number[],
		readonly dim = vec.length,
	) {}

	toString(): string {
		return `Vec<${this.dim.toFixed()}> (${this.vec
			.map((e) => e.toFixed(2))
			.join(", ")})`;
	}

	map(fn: (e: number, i: number) => number): Vec {
		return new Vec(this.vec.map(fn));
	}

	get x(): number {
		return this.vec[0];
	}

	get y(): number {
		return this.vec[1];
	}

	get z(): number {
		return this.vec[2];
	}

	static zero(dim: number): Vec {
		return new Vec(Array<number>(dim).fill(0));
	}

	static id(dim: number, i: number): Vec {
		const vec = Array<number>(dim).fill(0);
		vec[i] = 1;

		return new Vec(vec);
	}

	vAdd(v: Vec): Vec {
		return this.map((e, i) => e + v.vec[i]);
	}

	vSub(v: Vec): Vec {
		return this.map((e, i) => e - v.vec[i]);
	}

	add(x: number): Vec {
		return this.map((e) => e + x);
	}

	sub(x: number): Vec {
		return this.add(-x);
	}

	mul(x: number): Vec {
		return this.map((e) => e * x);
	}

	div(x: number): Vec {
		return this.mul(1 / x);
	}

	dot(v: Vec): number {
		let sum = 0;

		for (let i = 0; i < this.dim; i++) {
			sum += this.vec[i] * v.vec[i];
		}

		return sum;
	}

	norm(): number {
		return this.dot(this);
	}

	homo(): Vec {
		return new Vec(this.vec.concat(1));
	}

	unhomo(): Vec {
		return new Vec(this.vec.slice(0, 3)).div(this.vec[3]);
	}
}
