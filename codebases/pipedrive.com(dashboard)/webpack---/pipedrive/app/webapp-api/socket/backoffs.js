const multiplicationBackoffSettings = {
	maxCount: 15,
	multiplier: 1.5,
	round: Math.round
};
const fibonacciBackoffSettings = {
	maxCount: 15
};

// for not that often backoff, we use reduced fibonacci :) omitting 1,2,3

const FIBONACCI_TWEAKED = [0, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181];
const fibonacci = function fibonacci(index) {
	if (index > FIBONACCI_TWEAKED.length) {
		FIBONACCI_TWEAKED[index] = FIBONACCI_TWEAKED[index - 1] + FIBONACCI_TWEAKED[index - 2];
	}

	return FIBONACCI_TWEAKED[index];
};
const now = function() {
	return Date.now ? Date.now() : new Date().getTime();
};
const calculateSeed = function calculateSeed(backoffSettings) {
	const seed = backoffSettings.seed;

	return seed && typeof seed === 'function' ? seed() : 0;
};
const createBackoffState = function createBackoffState(backoffTimeoutCalculator, backoffSettings) {
	let executionsCount = 0;
	let backoffTimeout = 1;
	let seed = calculateSeed(backoffSettings);
	let nextExecutionAtLeast = now();

	return {
		step: function step() {
			executionsCount++;
			backoffTimeout = backoffTimeoutCalculator(
				executionsCount,
				backoffTimeout,
				backoffSettings
			);
			nextExecutionAtLeast = now() + seed + backoffTimeout * 1000;
		},
		count: function count() {
			return executionsCount;
		},
		nextTimeout: function nextTimeout() {
			const currentTime = now();
			const shouldExecute = currentTime >= nextExecutionAtLeast;

			return shouldExecute ? 0 : nextExecutionAtLeast - currentTime;
		},
		reset: function reset() {
			executionsCount = 0;
			backoffTimeout = 1;
			seed = calculateSeed(backoffSettings);
			nextExecutionAtLeast = now();
		}
	};
};
const createBackoffExecutor = function createBackoffExecutor(options) {
	const backoffSettings = options.backoffSettings;
	const fn = options.fn;
	const context = options.context;
	const executionState = createBackoffState(
		options.backoffTimeoutCalculator,
		options.backoffSettings
	);

	let executionTimeout = null;

	function executeBackoff() {
		if (executionState.count() >= backoffSettings.maxCount) {
			return;
		}

		// eslint-disable-next-line prefer-rest-params
		const args = arguments;

		clearTimeout(executionTimeout);
		executionTimeout = setTimeout(function execute() {
			try {
				fn.apply(context, args);
			} catch (e) {
				executionState.step();

				throw e;
			}

			executionState.step();
		}, executionState.nextTimeout());
	}

	executeBackoff.reset = executionState.reset;

	return executeBackoff;
};
const backoffFactory = function backoffFactory(backoffTimeoutCalculator, backoffDefaultSettings) {
	return function backoff(fn, context, settings) {
		settings = settings || {};
		const backoffSettings = { ...backoffDefaultSettings, ...settings };

		return createBackoffExecutor({
			backoffSettings,
			fn,
			context,
			backoffTimeoutCalculator
		});
	};
};

/**
 * Performs multiplication backoff for the function all, executes only LAST call, omitting interim calls
 * @param fn function to be executed with the backoff
 * @param context context if any
 * @param settings includes: maxCount (int), multiplier (float) and round (Function), seed (int).
 *            defaults: 15, 1.5, Math.round, null
 * @returns {Function} wrapped backoff function
 */
export const multiplicationBackoff = backoffFactory(function multiplicationBackoffFactory(
	executionsCount,
	backoffTimeout,
	backoffSettings
) {
	return backoffSettings.round(backoffTimeout * backoffSettings.multiplier);
},
multiplicationBackoffSettings);
/**
 * Performs fibonacci backoff for the function all, executes only LAST call, omitting interim calls
 * @param fn function to be executed with the backoff
 * @param context context if any
 * @param settings includes: maxCount (int), seed (int) defaults: 15, null
 * @returns {Function} wrapped backoff function
 */
export const fibonacciBackoff = backoffFactory(function fibonacciBackoffFactory(executionsCount) {
	return fibonacci(executionsCount);
}, fibonacciBackoffSettings);
