class Poly {
	constructor(vertexes, rgb) {
		this.vertexes = vertexes;
		this.rgb = rgb;
	}
}

class Scene {
	//MO TODO allow disabling alpha
	constructor(canvas) {
		this.canvas = canvas ?? document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		this.camPos = [0, 0, 0];
		this.camRot = [0, 0, 0];
		this.camFOV = Math.PI / 2;
		this.polys = [];
	}

	putPoly(poly) {
		return this.polys.push(poly) - 1;
	}

	removePoly(i) {
		this.polys[i] = false;
	}

	render() {
		const width = this.canvas.width;
		const height = this.canvas.height;
		this.context.clearRect(0, 0, width, height);

		const deltaX = this.camPos[0];
		const deltaY = this.camPos[1];
		const deltaZ = this.camPos[2];

		const [sinA, sinB, sinC] = this.camRot.map((angle) => Math.sin(-angle));
		const [cosA, cosB, cosC] = this.camRot.map((angle) => Math.cos(-angle));

		const focal = (0.5 * height) / Math.tan(0.5 * this.camFOV);

		const projPolys = [];
		const zBuffer = [];
		//MO TODO use matrix mult for perf.
		for (const poly of this.polys) {
			if (poly === false) continue;

			const relPoly = [];
			for (const [x, y, z] of poly.vertexes) {
				const _x = x - deltaX;
				const _y = y - deltaY;
				const _z = z - deltaZ;

				const q = _x * cosC - _y * sinC;
				const w = q * sinB - _z * cosB;
				const e = _x * sinC + _y * cosC;
				const relX = q * cosB + _z * sinB;
				const relY = w * sinA + e * cosA;
				const relZ = e * sinA - w * cosA;

				relPoly.push([relX, relY, relZ]);
			}

			if (relPoly.some((vertex) => vertex[2] < 0)) continue;
			zBuffer.push(relPoly[0][2] + relPoly[1][2] + relPoly[2][2]);

			const projPoly = [];
			for (const [relX, relY, relZ] of relPoly) {
				const q = focal / Math.abs(relZ);
				const projX = relX * q;
				const projY = relY * q;
				projPoly.push([0.5 * width + projX, 0.5 * height - projY].map(Math.round));
			}

			projPolys.push({ i: projPolys.length, poly: projPoly, rgb: poly.rgb });
		}

		for (const { poly, rgb } of projPolys.sort(({ i: i1 }, { i: i2 }) => zBuffer[i2] - zBuffer[i1])) {
			const [r, g, b] = rgb;
			this.context.fillStyle = `rgb(${r} ${g} ${b})`;

			this.context.beginPath();
			this.context.moveTo(...poly[0]);
			this.context.lineTo(...poly[1]);
			this.context.lineTo(...poly[2]);
			this.context.fill();
		}
	}
}
