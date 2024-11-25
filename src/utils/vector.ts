export class Vec extends Array<number> {
	constructor(...eles: number[]) {
		super();
		this.push(...eles);
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
		return new Vec(...Array(dim).fill(x));
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
		return new Vec(...vec1.map((ele, i) => ele + vec2[i]));
	}
	static sub(vec1: Vec, vec2: Vec): Vec {
		return new Vec(...vec1.map((ele, i) => ele - vec2[i]));
	}
	static dot(vec1: Vec, vec2: Vec): number {
		let sum = 0;
		for (let i = 0; i < vec1.dim; i++) sum += vec1[i] * vec2[i];
		return sum;
	}
	static cross(vec1: Vec, vec2: Vec): Vec {
		const [a0, a1, a2] = vec1;
		const [b0, b1, b2] = vec2;
		return new Vec(
			a1 * b2 - a2 * b1,
			a2 * b0 - a0 * b2,
			a0 * b1 - a1 * b0,
		);
	}

	add(x: number): Vec {
		return new Vec(...this.map((ele) => ele + x));
	}
	sub(x: number): Vec {
		return this.add(-x);
	}
	mul(x: number): Vec {
		return new Vec(...this.map((ele) => ele * x));
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
		return new Vec(...this, 1);
	}
	unhomo(): Vec {
		return new Vec(...this.slice(0, -1)).div(this[this.dim - 1]);
	}
}

