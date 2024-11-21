const INVALID_INDEX = new RangeError("vector index out of bounds");
const INVALID_LENGTH = new RangeError("invalid vector length");
const INVALID_OPERANDS_CROSS = new TypeError("invalid operands for cross product");
const LENGTH_UNMATCH = new TypeError("operand vectors length unmatch");

export class Vec {
	length: number;

	constructor(public data: number[]) {
		this.length = data.length;
	}
	static new(...eles: number[]): Vec {
		return new Vec(eles);
	}

	log(...items: any[]): void {
		console.log(`${items.join(" ")}~Vec(${this.length}) ${JSON.stringify(this.data)}`);
	}

	at(i: number): number {
		if (i < 0) i += this.length;
		return this.data[i];
	}
	set(i: number, x: number): void {
		if (i < 0) i += this.length;
		this.data[i] = x;
	}

	static fill(length: number, x: number): Vec {
		if (length < 0) throw INVALID_LENGTH;
		return new Vec(Array(length).fill(x));
	}
	static zero(length: number): Vec {
		return Vec.fill(length, 0);
	}
	static std(length: number, i: number): Vec {
		const vec = Vec.zero(length);
		if (vec.data[i] === undefined) throw INVALID_INDEX;
		vec.data[i] = 1;
		return vec;
	}

	static add(vec1: Vec, vec2: Vec): Vec {
		if (vec1.length !== vec2.length) throw LENGTH_UNMATCH;
		return new Vec(vec1.data.map((ele, i) => ele + vec2.data[i]));
	}
	static sub(vec1: Vec, vec2: Vec): Vec {
		if (vec1.length !== vec2.length) throw LENGTH_UNMATCH;
		return new Vec(vec1.data.map((ele, i) => ele - vec2.data[i]));
	}
	static dot(vec1: Vec, vec2: Vec): number {
		if (vec1.length !== vec2.length) throw LENGTH_UNMATCH;
		let sum = 0;
		for (let i = 0; i < vec1.length; i++) sum += vec1.data[i] * vec2.data[i];
		return sum;
	}
	static cross(vec1: Vec, vec2: Vec): Vec {
		if (vec1.length !== 3 || vec2.length !== 3) throw INVALID_OPERANDS_CROSS;
		const [a1, a2, a3] = vec1.data;
		const [b1, b2, b3] = vec2.data;
		return Vec.new(a2 * b3 - a3 * b2, a3 * b1 - a1 * b3, a1 * b2 - a2 * b1);
	}

	add(x: number): Vec {
		return new Vec(this.data.map((ele) => ele + x));
	}
	sub(x: number): Vec {
		return this.add(-x);
	}
	mul(x: number): Vec {
		return new Vec(this.data.map((ele) => ele * x));
	}
	div(x: number): Vec {
		return this.mul(1 / x);
	}

	sum(): number {
		let sum = 0;
		for (const ele of this.data) sum += ele;
		return sum;
	}
	norm(): number {
		return Vec.dot(this, this) ** 0.5;
	}

	unit(): Vec {
		return this.div(this.norm());
	}
	homo(): Vec {
		return new Vec(this.data.concat(1));
	}
	unhomo(): Vec {
		return new Vec(this.data.slice(0, -1)).div(this.at(-1));
	}
}
