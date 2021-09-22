const _ = require('lodash');
const { get } = require('@pipedrive/fetch');
const Pipedrive = require('pipedrive');
const logger = new Pipedrive.Logger('linked-deals-getter');

class LinkedLeadsGetter {
	resolvedLeads = {};
	leadsQueue = {};

	getLead(leadId, callback) {
		const lead = this.resolvedLeads[leadId];

		if (lead) {
			return callback(lead);
		}

		this.throttledPull(leadId, callback);
	}

	throttledPull(leadId, callback) {
		if (_.has(this.leadsQueue, leadId)) {
			this.leadsQueue[leadId].callbacksList.push(callback);
		} else {
			this.leadsQueue[leadId] = {
				leadId,
				callbacksList: [callback]
			};
		}

		if (this.pullTimeout) {
			clearTimeout(this.pullTimeout);
		}

		this.pullTimeout = setTimeout(_.bind(this.pullLeads, this), 300);
	}

	pullLeads() {
		get('/api/v1/leads/list', {
			queryParams: {
				ids: Object.keys(this.leadsQueue)
			}
		})
			.then(({ data }) => {
				this.addToResolvedLeads(data);
				this.callCurrentQueueCallbacks();
				this.resetLeadsQueue();
			})
			.catch((error) => {
				logger.error(error, 'Error when resolving leads list in email threads');
			});
	}

	addToResolvedLeads(newResolvedLeads) {
		this.resolvedLeads = newResolvedLeads.reduce((memo, lead) => {
			memo[lead.id] = lead;

			return memo;
		}, this.resolvedLeads);
	}

	callCurrentQueueCallbacks() {
		const resolvedLeadsQueueIds = Object.keys(this.leadsQueue);

		resolvedLeadsQueueIds.forEach((leadId) => {
			this.leadsQueue[leadId].callbacksList.forEach((callback) => {
				callback(this.resolvedLeads[leadId]);
			});
		});
	}

	resetLeadsQueue() {
		this.leadsQueue = {};
	}
}

module.exports = new LinkedLeadsGetter();
