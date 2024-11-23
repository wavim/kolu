import { Vec } from "./vector";

export class Mat extends Array<Vec> {
	row: number;
	col: number;

	constructor(...rows: (Vec | Array<number>)[]) {
		// console.log(rows.join(),"\n")
		rows.map(console.log);
		console.log("\n");
		const rowVecs = rows.map((row) => {
			// console.log(row)
			return new Vec(...row);
		});
		super();
		this.push(...rowVecs);
		this.row = rows.length;
		this.col = rowVecs[0]?.dim ?? 0;
	}

	toString(): string {
		return `Mat(${this.row}x${this.col})\n[${this.map(
			(row) => 1,
		).join("\n ")}]`;
	}
	//broken
	log(lbl?: string): void {
		console.log(`${lbl ?? ""}${lbl ? " ~ " : ""}${this}`);
	}
}

