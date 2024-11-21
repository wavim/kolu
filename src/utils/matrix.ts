import { Vec } from "./vector";

const DATA_UNFIT_DIM = new TypeError("matrix data cant fit dimensions");
const DIM_UNMATCH = new TypeError("operand matrices dimensions unmatch");
const INVALID_INDICES = new RangeError("matrix indices out of bounds");
const INVALID_OPERANDS_MUL = new TypeError("invalid operands for matrix multiplication");
const INVALID_TRANSFORM_VEC = new TypeError("invalid vector length for matrix transformation");
const ROWS_LENGTH_UNMATCH = new TypeError("length of matrix rows unmatch");

export class Mat {
	constructor(public row: number, public col: number, public data: number[]) {
		if (row < 0 || col < 0) throw INVALID_INDICES;
		if (data.length !== row * col) throw DATA_UNFIT_DIM;
	}
	static new(...rows: (Vec | number[])[]): Mat {
		if (rows.some((row) => row.length !== rows[0].length)) throw ROWS_LENGTH_UNMATCH;
		return new Mat(
			rows.length,
			rows[0]?.length ?? 0,
			rows.flatMap((row) => (row instanceof Vec ? row.data : row)),
		);
	}

	log(...items: any[]): void {
		const rows = [];
		for (let i = 0; i < this.row; i++) rows.push(this.data.slice(i * this.col, (i + 1) * this.col));
		console.log(`${items.join(" ")}~Mat(${this.row}x${this.col}) ${JSON.stringify(rows)}`);
	}

	at(row: number, col: number): number {
		if (row >= this.row || col >= this.col) throw INVALID_INDICES;
		if (row < 0) row += this.row;
		if (col < 0) col += this.col;
		return this.data[row * this.col + col];
	}
	set(row: number, col: number, x: number): void {
		if (row >= this.row || col >= this.col) throw INVALID_INDICES;
		if (row < 0) row += this.row;
		if (col < 0) col += this.col;
		this.data[row * this.col + col] = x;
	}
	rowAt(i: number): Vec {
		if (i >= this.row) throw INVALID_INDICES;
		if (i < 0) i += this.row;
		return new Vec(this.data.slice(i * this.col, (i + 1) * this.col));
	}
	colAt(i: number): Vec {
		if (i >= this.col) throw INVALID_INDICES;
		if (i < 0) i += this.col;
		const data = [];
		for (let j = 0; j < this.row; j++) data.push(this.data[j * this.col + i]);
		return new Vec(data);
	}

	static fill(row: number, col: number, x: number): Mat {
		if (row < 0 || col < 0) throw INVALID_INDICES;
		return new Mat(row, col, Array(row * col).fill(x));
	}
	static zero(row: number, col: number): Mat {
		return Mat.fill(row, col, 0);
	}
	static id(dim: number): Mat {
		const mat = Mat.zero(dim, dim);
		for (let i = 0; i < dim; i++) mat.set(i, i, 1);
		return mat;
	}

	static add(mat1: Mat, mat2: Mat): Mat {
		if (mat1.row !== mat2.row || mat1.col !== mat2.col) throw DIM_UNMATCH;
		return new Mat(
			mat1.row,
			mat1.col,
			mat1.data.map((ele, i) => ele + mat2.data[i]),
		);
	}
	static sub(mat1: Mat, mat2: Mat): Mat {
		if (mat1.row !== mat2.row || mat1.col !== mat2.col) throw DIM_UNMATCH;
		return new Mat(
			mat1.row,
			mat1.col,
			mat1.data.map((ele, i) => ele - mat2.data[i]),
		);
	}
	static mul(mat1: Mat, mat2: Mat): Mat {
		if (mat1.col !== mat2.row) throw INVALID_OPERANDS_MUL;
		const data = Array(mat1.row * mat2.col).fill(0);
		for (let i = 0; i < mat1.row; i++) {
			for (let j = 0; j < mat2.col; j++) {
				for (let k = 0; k < mat1.col; k++) {
					data[i * mat2.col + j] += mat1.data[i * mat1.col + k] * mat2.data[k * mat2.col + j];
				}
			}
		}
		return new Mat(mat1.row, mat2.col, data);
	}

	apply(vec: Vec): Vec {
		if (this.col !== vec.length) throw INVALID_TRANSFORM_VEC;
		const data = [];
		for (let i = 0; i < this.row; i++) data.push(Vec.dot(this.rowAt(i), vec));
		return new Vec(data);
	}

	transpose(): Mat {
		const rows = [];
		for (let i = 0; i < this.col; i++) rows.push(this.colAt(i));
		return Mat.new(...rows);
	}
}
