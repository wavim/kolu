import { deg2Rad } from "../utils/utils";
import { Vec } from "./vector";

// 3x3 and 4x4 matrices
export namespace Mat {
	export type mat3 = [Vec.vec3, Vec.vec3, Vec.vec3];

	export type mat4 = [Vec.vec4, Vec.vec4, Vec.vec4, Vec.vec4];

	export type mat = mat3 | mat4;

	export function log(mat: mat, lbl?: any): void {
		console.log(
			`${lbl ?? ""}${lbl ? " ~ " : ""}mat(${mat.length}x${mat.length})\n[${mat
				.map((row) => JSON.stringify(row))
				.join("\n ")}]`,
		);
	}

	export function zero<d extends 3 | 4, matD extends d extends 3 ? mat3 : mat4>(dim: d): matD {
		return <matD>[...Array(dim)].map(() => Array(dim).fill(0));
	}

	export function id<d extends 3 | 4>(dim: d): d extends 3 ? mat3 : mat4 {
		const res = zero(dim);
		for (let i = 0; i < dim; i++) res[i][i] = 1;
		return res;
	}

	export function rot(rotVec: Vec.vec3, options?: { deg?: boolean }): mat3 {
		if (options?.deg) rotVec = <Vec.vec3>rotVec.map(deg2Rad);
		const [sA, sB, sC] = rotVec.map(Math.sin);
		const [cA, cB, cC] = rotVec.map(Math.cos);

		const yaw = <mat3>[
			[cA, -sA, 0],
			[sA, cA, 0],
			[0, 0, 1],
		];
		const pitch = <mat3>[
			[cB, 0, sB],
			[0, 1, 0],
			[-sB, 0, cB],
		];
		const roll = <mat3>[
			[1, 0, 0],
			[0, cC, -sC],
			[0, sC, cC],
		];

		return mMul(yaw, mMul(pitch, roll));
	}

	export function colAt<matD extends mat, vecD extends matD extends mat3 ? Vec.vec3 : Vec.vec4>(
		m: matD,
		col: number,
	): vecD {
		return <vecD>m.map((row) => row[col]);
	}

	export function mAdd<matD extends mat>(m: matD, n: matD): matD {
		return <matD>m.map((row, i) => Vec.vAdd(row, n[i]));
	}

	export function mSub<matD extends mat>(m: matD, n: matD): matD {
		return <matD>m.map((row, i) => Vec.vSub(row, n[i]));
	}

	export function mMul<matD extends mat>(m: matD, n: matD): matD {
		const res: matD = zero(m.length);
		for (let i = 0; i < m.length; i++) {
			for (let j = 0; j < n.length; j++) {
				res[i][j] = Vec.dot(m[i], colAt(n, j));
			}
		}
		return res;
	}

	export function add<matD extends mat>(m: matD, x: number): matD {
		return <matD>m.map((row) => Vec.add(row, x));
	}

	export function sub<matD extends mat>(m: matD, x: number): matD {
		return add(m, -x);
	}

	export function mul<matD extends mat>(m: matD, x: number): matD {
		return <matD>m.map((row) => Vec.mul(row, x));
	}

	export function div<matD extends mat>(m: matD, x: number): matD {
		return mul(m, 1 / x);
	}

	export function homo(m: mat3, delta: Vec.vec3 = [0, 0, 0], scale: Vec.vec4 = [0, 0, 0, 1]): mat4 {
		return <mat4>m.map((row, i) => row.concat(delta[i])).concat([scale]);
	}

	export function transform<matD extends mat, vecD extends matD extends mat3 ? Vec.vec3 : Vec.vec4>(
		m: matD,
		v: vecD,
	): vecD {
		return <vecD>m.map((row) => Vec.dot(row, v));
	}

	export function transformHomo(mat: mat4, vec: Vec.vec3): Vec.vec3 {
		return Vec.unhomo(transform(mat, Vec.homo(vec)));
	}
}
