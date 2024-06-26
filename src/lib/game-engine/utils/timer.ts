export function measureTime(cb: () => void): number {
	const start = Date.now();
	cb();
	return Date.now() - start;
}
