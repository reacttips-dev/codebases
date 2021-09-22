import Logger from '@pipedrive/logger-fe';

const logger = new Logger('froot', 'getWindowNewRelic');

const defaultNewRelic = {
	addPageAction: () => {},
};

/**
 * @summary Gets window.newrelic or a mock if it's not available.
 */
export function getWindowNewrelic() {
	const original = window?.newrelic;

	if (!original) {
		logger.log("window.newrelic is requested before it's available.");
	}

	return original ?? defaultNewRelic;
}

export function trackRouteChange(payload) {
	const { startedAt, status, path, previousPath } = payload;

	const timeTaken = Date.now() - startedAt;

	const newrelic = getWindowNewrelic();

	newrelic.addPageAction('RouteChange', {
		status,
		path,
		previousPath,
		timeTaken,
	});
}
