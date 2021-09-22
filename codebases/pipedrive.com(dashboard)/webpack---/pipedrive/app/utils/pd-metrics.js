const Pipedrive = require('pipedrive');
const logger = new Pipedrive.Logger('pd-metrics');

const unloaded = () => {
	logger.remote('error', 'Webapp pd-metrics not initialized', { stack: new Error().stack });
};

const metrics = {
	setMetrics,
	initialize: unloaded,
	trackUsage: unloaded,
	addPageAction: unloaded,
	addSeshetaEvent: unloaded,
	finished: unloaded
};

function setMetrics(instance) {
	Object.assign(metrics, instance);
}

module.exports = metrics;
