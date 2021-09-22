let pdMetrics = null;

function initialize(metrics) {
	if (pdMetrics) {
		return pdMetrics;
	}

	pdMetrics = metrics;

	return pdMetrics;
}

function trackUsage(...args) {
	if (pdMetrics) {
		pdMetrics.trackUsage(...args);
	}
}

export default {
	initialize,
	trackUsage,
};
