import { Vec } from "./vector";

export namespace Mat {
	type vec = Vec.vec;
	export type mat = vec[];

	export function log(mat: mat, label?: string): void {
		console.log(
			`${label ?? ""}${label ? " " : ""}Mat(${mat.length}x${mat[0]?.length ?? 0})\n[${mat
				.map((row) => JSON.stringify(row))
				.join("\n ")}]`,
		);
	}

	export function col(mat: mat, i: number): vec {
		const col = [];
		for (const row of mat) col.push(row[i]);
		return col;
	}

	export function fill(row: number, col: number, x: number): mat {
		return Array(row).fill();
	}
	export function zero(row: number, col: number): Mat {
		return Mat.fill(row, col, 0);
	}
	export function id(dim: number): Mat {
		const mat = Mat.zero(dim, dim);
		for (let i = 0; i < dim; i++) mat.set(i, i, 1);
		return mat;
	}

	// export function static add(mat1: Mat, mat2: Mat): Mat {
	// 	if (mat1.row !== mat2.row || mat1.col !== mat2.col) throw DIM_UNMATCH;
	// 	return new Mat(
	// 		mat1.row,
	// 		mat1.col,
	// 		mat1.data.map((ele, i) => ele + mat2.data[i]),
	// 	);
	// }
	// export function static sub(mat1: Mat, mat2: Mat): Mat {
	// 	if (mat1.row !== mat2.row || mat1.col !== mat2.col) throw DIM_UNMATCH;
	// 	return new Mat(
	// 		mat1.row,
	// 		mat1.col,
	// 		mat1.data.map((ele, i) => ele - mat2.data[i]),
	// 	);
	// }
	// export function static mul(mat1: Mat, mat2: Mat): Mat {
	// 	if (mat1.col !== mat2.row) throw INVALID_OPERANDS_MUL;
	// 	const data = Array(mat1.row * mat2.col).fill(0);
	// 	for (let i = 0; i < mat1.row; i++) {
	// 		for (let j = 0; j < mat2.col; j++) {
	// 			for (let k = 0; k < mat1.col; k++) {
	// 				data[i * mat2.col + j] += mat1.data[i * mat1.col + k] * mat2.data[k * mat2.col + j];
	// 			}
	// 		}
	// 	}
	// 	return new Mat(mat1.row, mat2.col, data);
	// }

	// export function apply(vec: Vec): Vec {
	// 	if (this.col !== vec.length) throw INVALID_TRANSFORM_VEC;
	// 	const data = [];
	// 	for (let i = 0; i < this.row; i++) data.push(Vec.dot(this.rowAt(i), vec));
	// 	return new Vec(data);
	// }

	// export function transpose(): Mat {
	// 	const rows = [];
	// 	for (let i = 0; i < this.col; i++) rows.push(this.colAt(i));
	// 	return Mat.new(...rows);
	// }
}
