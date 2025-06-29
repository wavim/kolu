import { Vec } from "./vec";

export class Mat {
	constructor(
		readonly mat: number[][],
		readonly dim = mat.length,
	) {}

	toString(): string {
		const max: number[] = [];

		for (let i = 0; i < this.dim; i++) {
			max[i] = Math.max(...this.col(i).vec.map((e) => e.toFixed(2).length));
		}

		return `Mat<${this.dim.toFixed()}>\n[${this.mat
			.map((r) => r.map((e, i) => e.toFixed(2).padStart(max[i])).join(", "))
			.join("\n ")}]`;
	}

	map(fn: (r: Vec, i: number) => Vec): Mat {
		return new Mat(this.mat.map((r, i) => fn(new Vec(r), i).vec));
	}

	vmap(fn: (r: Vec, i: number) => number): Vec {
		return new Vec(this.mat.map((r, i) => fn(new Vec(r), i)));
	}

	row(i: number): Vec {
		return new Vec(this.mat[i]);
	}

	col(i: number): Vec {
		return new Vec(this.mat.map((r) => r[i]));
	}

	static zero(dim: number): Mat {
		return new Mat(Array(dim).fill(Vec.zero(dim).vec));
	}

	static id(dim: number): Mat {
		const mat: number[][] = [];

		for (let i = 0; i < dim; i++) {
			mat.push(Vec.id(dim, i).vec);
		}

		return new Mat(mat);
	}

	static rot(rot: Vec, deg = false): Mat {
		const [sY, sP, sR] = rot.map((x) => Math.sin(deg ? (x * Math.PI) / 180 : x)).vec;
		const [cY, cP, cR] = rot.map((x) => Math.cos(deg ? (x * Math.PI) / 180 : x)).vec;

		const rX = new Mat([
			[1, 0, 0],
			[0, cP, -sP],
			[0, sP, cP],
		]);
		const rY = new Mat([
			[cY, 0, sY],
			[0, 1, 0],
			[-sY, 0, cY],
		]);
		const rZ = new Mat([
			[cR, -sR, 0],
			[sR, cR, 0],
			[0, 0, 1],
		]);

		return rZ.mMul(rY).mMul(rX);
	}

	mAdd(m: Mat): Mat {
		return this.map((r, i) => r.vAdd(m.row(i)));
	}

	mSub(m: Mat): Mat {
		return this.map((r, i) => r.vSub(m.row(i)));
	}

	mMul(m: Mat): Mat {
		const mat: number[][] = [];

		for (let i = 0; i < this.dim; i++) {
			mat[i] = [];
			for (let j = 0; j < this.dim; j++) {
				mat[i][j] = this.row(i).dot(m.col(j));
			}
		}

		return new Mat(mat);
	}

	add(x: number): Mat {
		return this.map((r) => r.add(x));
	}

	sub(x: number): Mat {
		return this.add(-x);
	}

	mul(x: number): Mat {
		return this.map((r) => r.mul(x));
	}

	div(x: number): Mat {
		return this.mul(1 / x);
	}

	apply(v: Vec): Vec {
		return this.vmap((r) => r.dot(v));
	}

	homo(d: Vec = Vec.zero(3), s: Vec = Vec.id(4, 3)): Mat {
		return new Mat(this.mat.map((r, i) => r.concat(d.vec[i])).concat([s.vec]));
	}
}
