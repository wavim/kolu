export class Vec extends Array<number> {
	constructor(...eles: number[]) {
		super();
		this.push(...eles);
	}
	static from(eles: number[]): Vec {
		return new Vec(...eles);
	}

	//MO NOTE Symbol.species usage discouraged
	static get [Symbol.species](): typeof Array<number> {
		return Array<number>;
	}

	get dim(): number {
		return this.length;
	}

	toString(): string {
		return `Vec(${this.dim}) ${JSON.stringify(this)}`;
	}
	log(lbl?: any): void {
		console.log(`${lbl ?? ""}${lbl ? " ~ " : ""}${this}`);
	}

	static fill(dim: number, x: number): Vec {
		return Vec.from(Array(dim).fill(x));
	}
	static zero(dim: number): Vec {
		return Vec.fill(dim, 0);
	}
	static std(dim: number, i: number): Vec {
		const vec = Vec.zero(dim);
		vec[i] = 1;
		return vec;
	}

	static add(vec1: Vec, vec2: Vec): Vec {
		return Vec.from(vec1.map((ele, i) => ele + vec2[i]));
	}
	static sub(vec1: Vec, vec2: Vec): Vec {
		return Vec.from(vec1.map((ele, i) => ele - vec2[i]));
	}
	static dot(vec1: Vec, vec2: Vec): number {
		let sum = 0;
		for (let i = 0; i < vec1.dim; i++) sum += vec1[i] * vec2[i];
		return sum;
	}
	static cross(vec1: Vec, vec2: Vec): Vec {
		const [a1, a2, a3] = vec1;
		const [b1, b2, b3] = vec2;
		return new Vec(
			a2 * b3 - a3 * b2,
			a3 * b1 - a1 * b3,
			a1 * b2 - a2 * b1,
		);
	}

	add(x: number): Vec {
		return Vec.from(this.map((ele) => ele + x));
	}
	sub(x: number): Vec {
		return this.add(-x);
	}
	mul(x: number): Vec {
		return Vec.from(this.map((ele) => ele * x));
	}
	div(x: number): Vec {
		return this.mul(1 / x);
	}

	norm(): number {
		return Vec.dot(this, this) ** 0.5;
	}
	unit(): Vec {
		return this.div(this.norm());
	}

	homo(): Vec {
		return Vec.from(this.concat(1));
	}
	unhomo(): Vec {
		return Vec.from(this.slice(0, -1)).div(this[this.dim - 1]);
	}
}
