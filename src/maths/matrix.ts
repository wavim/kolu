import { Vec3 } from "../types";
import { Vec } from "./vector";

export class Mat extends Array<Vec> {
	constructor(...rows: (Vec | Array<number>)[]) {
		super();
		this.push(...rows.map(Vec.from));
	}
	static from(rows: (Vec | Array<number>)[]): Mat {
		return new Mat(...rows);
	}

	//MO NOTE Symbol.species usage discouraged
	static get [Symbol.species](): typeof Array<Vec> {
		return Array<Vec>;
	}

	get row(): number {
		return this.length;
	}
	get col(): number {
		return this[0]?.dim ?? 0;
	}

	toString(): string {
		return `Mat(${this.row}x${this.col})\n[${this.map((row) => JSON.stringify(row)).join("\n ")}]`;
	}
	log(lbl?: any): void {
		console.log(`${lbl ?? ""}${lbl ? " ~ " : ""}${this}`);
	}

	static fill(row: number, col: number, x: number): Mat {
		return Mat.from([...Array(row)].map(() => Array(col).fill(x)));
	}
	static zero(row: number, col: number): Mat {
		return Mat.fill(row, col, 0);
	}
	static id(dim: number): Mat {
		const mat = Mat.zero(dim, dim);
		for (let i = 0; i < dim; i++) mat[i][i] = 1;
		return mat;
	}
	static rot(rotVec: Vec | Vec3): Mat {
		const [sA, sB, sC] = rotVec.map(Math.sin);
		const [cA, cB, cC] = rotVec.map(Math.cos);
		const yaw = new Mat([cA, -sA, 0], [sA, cA, 0], [0, 0, 1]);
		const pitch = new Mat([cB, 0, sB], [0, 1, 0], [-sB, 0, cB]);
		const roll = new Mat([1, 0, 0], [0, cC, -sC], [0, sC, cC]);
		return Mat.mul(yaw, Mat.mul(pitch, roll));
	}

	colAt(col: number): Vec {
		return Vec.from(this.map((row) => row[col]));
	}

	static add(mat1: Mat, mat2: Mat): Mat {
		return Mat.from(mat1.map((row, i) => Vec.add(row, mat2[i])));
	}
	static sub(mat1: Mat, mat2: Mat): Mat {
		return Mat.from(mat1.map((row, i) => Vec.sub(row, mat2[i])));
	}
	static mul(mat1: Mat, mat2: Mat): Mat {
		const mat = Mat.zero(mat1.row, mat2.col);
		for (let i = 0; i < mat1.row; i++) {
			for (let j = 0; j < mat2.col; j++) {
				mat[i][j] = Vec.dot(mat1[i], mat2.colAt(j));
			}
		}
		return mat;
	}

	add(x: number): Mat {
		return Mat.from(this.map((row) => row.add(x)));
	}
	sub(x: number): Mat {
		return this.add(-x);
	}
	mul(x: number): Mat {
		return Mat.from(this.map((row) => row.mul(x)));
	}
	div(x: number): Mat {
		return this.mul(1 / x);
	}

	homo(delta: Array<number> | Vec = [0, 0, 0], scale: Array<number> | Vec = [0, 0, 0, 1]): Mat {
		return Mat.from(this.map((row, i) => row.concat(delta[i])).concat([scale]));
	}

	transform(vec: Vec): Vec {
		return Vec.from(this.map((row) => Vec.dot(row, vec)));
	}
	transformHomo(vec: Vec): Vec {
		return this.transform(vec.homo()).unhomo();
	}
}
