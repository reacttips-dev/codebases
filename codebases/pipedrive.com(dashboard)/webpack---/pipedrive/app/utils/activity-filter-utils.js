const _ = require('lodash');
const moment = require('moment');
const UTC_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';

const filterUtils = {
	isPlanned: function(filter) {
		return !filter.end_date && !filter.start_date;
	},

	isOverdue: function(filter) {
		return !filter.start_date && filter.end_date;
	},

	isBetweenPeriod: function(filter, model) {
		const dueTimeDefined = !!model.get('due_time');
		const modelDate = moment(
			model.get('due_date') + (dueTimeDefined ? ` ${model.get('due_time')}` : '')
		);

		let startDate;
		let endDate;

		if (dueTimeDefined) {
			startDate = filter.start_date;
			endDate = filter.end_date;
		} else {
			const utcStartDate = moment.utc(filter.start_date);
			const utcEndDate = moment.utc(filter.end_date);

			startDate = utcStartDate.local().format(UTC_DATETIME_FORMAT);
			endDate = utcEndDate.local().format(UTC_DATETIME_FORMAT);
		}

		return modelDate.isBetween(startDate, endDate, null, '[)');
	},

	isMatchingStatus: function(data, model) {
		if (filterUtils.isPlanned(data)) {
			return !model.get('done');
		}

		if (!model.get('due_date')) {
			return false;
		}

		if (filterUtils.isOverdue(data)) {
			return model.isOverdue() && !model.get('done');
		}

		return filterUtils.isBetweenPeriod(data, model);
	}
};

module.exports = {
	matchesType: function(data, model) {
		if (!data.type) {
			return true;
		}

		const selectedTypes = data.type.split(',');

		return selectedTypes.indexOf(model.get('type')) !== -1;
	},

	matchesStatus: function(data, model, statusFilterDisabled) {
		if (_.isFunction(statusFilterDisabled)) {
			const isStatusFiltersDisabled = statusFilterDisabled();

			if (!_.isNil(isStatusFiltersDisabled) && isStatusFiltersDisabled) {
				return true;
			}
		}

		return filterUtils.isMatchingStatus(data, model);
	}
};
