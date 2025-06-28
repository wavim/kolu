import { Vec } from "./vector";

export class Mat<N extends number> {
	constructor(
		readonly mat: Vec<N>[],
		readonly dim = mat.length as N,
	) {}

	static from<N extends number>(data: number[][]): Mat<N> {
		return new Mat(data.map((d) => new Vec(d)));
	}

	static zero<N extends number>(dim: N): Mat<N> {
		return new Mat(Array(dim).fill(Vec.zero(dim)));
	}

	static id<N extends number>(dim: N): Mat<N> {
		const data: Vec<N>[] = [];

		for (let i = 0; i < dim; i++) {
			data.push(Vec.id(dim, i));
		}

		return new Mat(data);
	}

	// MO TODO drop, move to quaternions
	static rot(rot: Vec<3>, deg = false): Mat<3> {
		const [sY, sP, sR] = rot.map((c) => Math.sin(deg ? (c * Math.PI) / 180 : c)).vec;
		const [cY, cP, cR] = rot.map((c) => Math.cos(deg ? (c * Math.PI) / 180 : c)).vec;

		const rX = new Mat<3>([
			new Vec([1, 0, 0]),
			new Vec([0, cP, -sP]),
			new Vec([0, sP, cP]),
		]);
		const rY = new Mat<3>([
			new Vec([cY, 0, sY]),
			new Vec([0, 1, 0]),
			new Vec([-sY, 0, cY]),
		]);
		const rZ = new Mat<3>([
			new Vec([cR, -sR, 0]),
			new Vec([sR, cR, 0]),
			new Vec([0, 0, 1]),
		]);

		return rZ.mMul(rY).mMul(rX);
	}

	toString(): string {
		const max: number[] = [];

		for (let i = 0; i < this.dim; i++) {
			max[i] = Math.max(...this.col(i).vec.map((c) => c.toFixed(2).length));
		}

		return `Mat<${this.dim.toFixed()}>\n[${this.mat
			.map((v) => v.vec.map((c, i) => c.toFixed(2).padStart(max[i])).join(", "))
			.join("\n ")}]`;
	}

	map(fn: (v: Vec<N>, i: number) => Vec<N>): Mat<N> {
		return new Mat(this.mat.map(fn));
	}

	row(i: number): Vec<N> {
		return this.mat[i];
	}

	col(i: number): Vec<N> {
		return new Vec(this.mat.map((r) => r.vec[i]));
	}

	mAdd(m: Mat<N>): Mat<N> {
		return this.map((r, i) => r.vAdd(m.row(i)));
	}

	mSub(m: Mat<N>): Mat<N> {
		return this.map((r, i) => r.vSub(m.row(i)));
	}

	mMul(m: Mat<N>): Mat<N> {
		const res: number[][] = [];

		for (let i = 0; i < this.dim; i++) {
			res[i] ??= [];

			for (let j = 0; j < this.dim; j++) {
				res[i][j] = this.mat[i].dot(m.col(j));
			}
		}

		return Mat.from(res);
	}

	add(x: number): Mat<N> {
		return this.map((c) => c.add(x));
	}

	sub(x: number): Mat<N> {
		return this.add(-x);
	}

	mul(x: number): Mat<N> {
		return this.map((c) => c.mul(x));
	}

	div(x: number): Mat<N> {
		return this.mul(1 / x);
	}

	apply(v: Vec<N>): Vec<N> {
		return new Vec(this.mat.map((r) => r.dot(v)));
	}

	homo(d: Vec<3> = Vec.zero(3), s: Vec<4> = Vec.id(4, 3)): Mat<4> {
		return Mat.from<4>(this.mat.map((r, i) => r.vec.concat(d.vec[i])).concat(s.vec));
	}
}
