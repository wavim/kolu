namespace LA {
	export class Vec {
		static INVALID_INDEX = new RangeError("vector index out of bounds");
		static INVALID_LENGTH = new RangeError("invalid vector length");
		static INVALID_OPERANDS_CROSS = new TypeError("invalid operands for cross product");
		static LENGTH_UNMATCH = new TypeError("operand vectors length unmatch");

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
			if (length < 0) throw Vec.INVALID_LENGTH;
			return new Vec(Array(length).fill(x));
		}
		static zero(length: number): Vec {
			return Vec.fill(length, 0);
		}
		static std(length: number, i: number): Vec {
			const vec = Vec.zero(length);
			if (vec.data[i] === undefined) throw Vec.INVALID_INDEX;
			vec.data[i] = 1;
			return vec;
		}

		static add(vec1: Vec, vec2: Vec): Vec {
			if (vec1.length !== vec2.length) throw Vec.LENGTH_UNMATCH;
			return new Vec(vec1.data.map((ele, i) => ele + vec2.data[i]));
		}
		static sub(vec1: Vec, vec2: Vec): Vec {
			if (vec1.length !== vec2.length) throw Vec.LENGTH_UNMATCH;
			return new Vec(vec1.data.map((ele, i) => ele - vec2.data[i]));
		}
		static dot(vec1: Vec, vec2: Vec): number {
			if (vec1.length !== vec2.length) throw Vec.LENGTH_UNMATCH;
			let sum = 0;
			for (let i = 0; i < vec1.length; i++) sum += vec1.data[i] * vec2.data[i];
			return sum;
		}
		static cross(vec1: Vec, vec2: Vec): Vec {
			if (vec1.length !== 3 || vec2.length !== 3) throw Vec.INVALID_OPERANDS_CROSS;
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

	export class Mat {
		static DATA_UNFIT_DIM = new TypeError("matrix data cant fit dimensions");
		static DIM_UNMATCH = new TypeError("operand matrices dimensions unmatch");
		static INVALID_INDICES = new RangeError("matrix indices out of bounds");
		static INVALID_OPERANDS_MUL = new TypeError("invalid operands for matrix multiplication");
		static INVALID_TRANSFORM_VEC = new TypeError("invalid vector length for matrix transformation");
		static ROWS_LENGTH_UNMATCH = new TypeError("length of matrix rows unmatch");

		constructor(public row: number, public col: number, public data: number[]) {
			if (row < 0 || col < 0) throw Mat.INVALID_INDICES;
			if (data.length !== row * col) throw Mat.DATA_UNFIT_DIM;
		}
		static new(...rows: (Vec | number[])[]): Mat {
			if (rows.some((row) => row.length !== rows[0].length)) throw Mat.ROWS_LENGTH_UNMATCH;
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
			if (row >= this.row || col >= this.col) throw Mat.INVALID_INDICES;
			if (row < 0) row += this.row;
			if (col < 0) col += this.col;
			return this.data[row * this.col + col];
		}
		set(row: number, col: number, x: number): void {
			if (row >= this.row || col >= this.col) throw Mat.INVALID_INDICES;
			if (row < 0) row += this.row;
			if (col < 0) col += this.col;
			this.data[row * this.col + col] = x;
		}
		rowAt(i: number): Vec {
			if (i >= this.row) throw Mat.INVALID_INDICES;
			if (i < 0) i += this.row;
			return new Vec(this.data.slice(i * this.col, (i + 1) * this.col));
		}
		colAt(i: number): Vec {
			if (i >= this.col) throw Mat.INVALID_INDICES;
			if (i < 0) i += this.col;
			const data = [];
			for (let j = 0; j < this.row; j++) data.push(this.data[j * this.col + i]);
			return new Vec(data);
		}

		static fill(row: number, col: number, x: number): Mat {
			if (row < 0 || col < 0) throw Mat.INVALID_INDICES;
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
			if (mat1.row !== mat2.row || mat1.col !== mat2.col) throw Mat.DIM_UNMATCH;
			return new Mat(
				mat1.row,
				mat1.col,
				mat1.data.map((ele, i) => ele + mat2.data[i]),
			);
		}
		static sub(mat1: Mat, mat2: Mat): Mat {
			if (mat1.row !== mat2.row || mat1.col !== mat2.col) throw Mat.DIM_UNMATCH;
			return new Mat(
				mat1.row,
				mat1.col,
				mat1.data.map((ele, i) => ele - mat2.data[i]),
			);
		}
		static mul(mat1: Mat, mat2: Mat): Mat {
			if (mat1.col !== mat2.row) throw Mat.INVALID_OPERANDS_MUL;
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
			if (this.col !== vec.length) throw Mat.INVALID_TRANSFORM_VEC;
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
}
