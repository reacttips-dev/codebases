interface Options {
	attempts: number;
	delayMs: number;
}

async function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function asyncRetry(fn, options: Options) {
	let attemptsDone = 0;

	while (fn) {
		try {
			return await fn();
		} catch (error) {
			if (++attemptsDone < options.attempts) {
				options.delayMs && (await wait(options.delayMs));
				continue;
			}

			throw error;
		}
	}
}
