'use strict';
const _ = require('lodash');
const User = require('models/user');
const moment = require('moment');
const PDMetrics = require('utils/pd-metrics');
const { get } = require('@pipedrive/fetch');

const local = {
	getSource: function(path) {
		if (path.search('statistics') > -1) {
			return 'statistics';
		} else if (path.search('pipeline') > -1) {
			return 'pipeline';
		} else if (path.search('deals') > -1) {
			return 'deals-list';
		} else if (path.search('deal') > -1) {
			return 'deal-details';
		}

		return '';
	},

	isSelfOwned: function(attributes) {
		const userId = User.get('id');
		const dealOwnerId = attributes.user_id;

		return userId === dealOwnerId;
	},

	getCurrentStage: function(attributes) {
		const allStages = User.get('stages');

		return _.find(allStages, (stage) => {
			return stage.id === Number(attributes.stage_id);
		});
	},

	getCurrentPipelineStages: function(pipelineId) {
		return User.get('stages').filter((stage) => stage.pipeline_id === pipelineId);
	},

	getPipelineStageCount: function(attributes) {
		const currentStage = local.getCurrentStage(attributes);

		return currentStage ? local.getCurrentPipelineStages(currentStage.pipeline_id).length : 0;
	},

	getDealDuration: function(dealAddTime) {
		const addTime = moment(dealAddTime, 'YYYY-MM-DD');
		const closeTime = moment.utc().startOf('day');

		return Math.floor(moment.duration(closeTime.diff(addTime)).asDays());
	},

	getDealValueInEur: function(value, currencyRates) {
		return this.getDealValueInCurrency(value, 'EUR', currencyRates);
	},

	getDealValueInUsd: function(value, currencyRates) {
		return this.getDealValueInCurrency(value, 'USD', currencyRates);
	},

	getDealValueInCurrency: function(value, currency, currencyRates) {
		if (!_.isNil(value) && !_.isNil(currencyRates)) {
			return Math.round(currencyRates[currency] * value);
		}

		return null;
	}
};

module.exports = {
	trackStageChange: function(attributes, path, previousAttributes) {
		const newPipelineId = _.get(local.getCurrentStage(attributes), 'pipeline_id', '');

		PDMetrics.trackUsage(null, 'stage', 'changed', {
			source: local.getSource(path),
			deal_id: attributes.id,
			deal_status: attributes.status,
			self_owned: local.isSelfOwned(attributes),
			value: attributes.value,
			currency: attributes.currency,
			expected_close_date_filled: !!attributes.expected_close_date,
			old_pipeline_id: _.get(previousAttributes, 'pipeline_id', ''),
			new_pipeline_id: newPipelineId,
			old_stage_sequence_nr: _.get(previousAttributes, 'stage_order_nr', ''),
			new_stage_sequence_nr: _.get(local.getCurrentStage(attributes), 'order_nr', ''),
			pipeline_stage_count: newPipelineId ? local.getPipelineStageCount(attributes) : 0,
			rotten: !!attributes.rotten_time,
			person_linked: !!attributes.person_id,
			organization_linked: !!attributes.org_id,
			user_id: attributes.user_id
		});
	},

	trackDealClosed: async function(attributes, path, status) {
		const pipelineId = attributes.pipeline_id;
		// this variable is needed because add_time value can be mutated in attributes object
		const addTime = attributes.add_time;

		let willRenewalBeCreated;

		try {
			if (User.companyFeatures.get('renewal_deals')) {
				const renewalResponse = await get(`/api/v1/deals/${attributes.id}/renewal`);

				willRenewalBeCreated =
					renewalResponse && renewalResponse.success && renewalResponse !== null;
			}
		} catch (_) {
			// Ignore
		}

		PDMetrics.trackUsage(null, 'deal', status, {
			source: local.getSource(path),
			result: status,
			deal_id: attributes.id,
			pipeline_id: pipelineId,
			self_owned: local.isSelfOwned(attributes),
			value: attributes.value,
			deal_duration: local.getDealDuration(addTime),
			currency: attributes.currency,
			expected_close_date_filled: !!attributes.expected_close_date,
			stage_sequence_nr: _.get(local.getCurrentStage(attributes), 'order_nr', ''),
			pipeline_stage_count: pipelineId ? local.getPipelineStageCount(attributes) : 0,
			rotten: !!attributes.rotten_time,
			person_linked: !!attributes.person_id,
			organization_linked: !!attributes.org_id,
			will_renewal_be_created: willRenewalBeCreated
		});
	}
};
