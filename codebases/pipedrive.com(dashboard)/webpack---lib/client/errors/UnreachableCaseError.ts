export default class UnreachableCaseError extends Error {
	constructor(value: never) {
		super(`Unreachable code executed with value: ${JSON.stringify(value)}`);
	}
}
