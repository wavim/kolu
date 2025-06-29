export function lerp<T>(
	u: T | undefined,
	a: number,

	func: (v: T) => void,
	next: (u: T, a: number) => T | undefined,
): void {
	if (u === undefined) {
		return;
	}

	func(u);

	requestAnimationFrame(() => {
		lerp(next(u, a), a, func, next);
	});
}
