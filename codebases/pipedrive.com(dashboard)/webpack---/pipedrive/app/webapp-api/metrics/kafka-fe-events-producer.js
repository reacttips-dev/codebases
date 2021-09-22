const request = require('@pipedrive/fetch');
const Logger = require('@pipedrive/logger-fe').default;
const logger = new Logger('fe-events-to-kafka');

const trackedFeEvents = new Set([
	'deal_details.opened',
	'organization_details.opened',
	'person_details.opened',
	'lead.details_opened',
	'product_details.opened',
	'file.opened'
]);

module.exports = (eventName, properties) => {
	if (trackedFeEvents.has(eventName)) {
		request
			.post('/fe-events-to-kafka/v1/produce', {
				eventName,
				properties
			})
			.catch((err) => {
				logger.remote('warning', 'fe-events-to-kafka POST failed', {
					metadata: { eventName, errMessage: err.message }
				});
			});
	}
};
