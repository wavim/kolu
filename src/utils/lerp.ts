export function lerp<T>(
	speed: T,
	decay: number,
	threshold: number,
	callback: (speed: T) => void,
	transform: (speed: T) => number = (s) => +s,
	next: (speed: T, decay: number) => T = (s, d) => <T>(+s * d),
) {
	if (transform(speed) < threshold) return;
	callback(speed);
	requestAnimationFrame(() =>
		lerp(next(speed, decay), decay, threshold, callback, transform, next),
	);
}
