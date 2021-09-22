'use strict';

const moment = require('moment');
const _ = require('lodash');
const DetailViewAnalytics = require('./detail-view-analytics');
const ActivityAnalytics = require('./activity-analytics');
const User = require('models/user');
const PDMetrics = require('utils/pd-metrics');

const ROUTE_FILTER_KEY_MAP = {
	deals: 'filter_deals',
	persons: 'filter_people',
	organizations: 'filter_org',
	activities: 'filter_activities',
	products: 'filter_products'
};
const TRACKED_COMPONENTS_MAP = {
	expected_close_date: 'expected_close_date',
	value: 'deal_value',
	probability: 'deal_probability',
	user_id: 'deal_ownership'
};

const TRACKED_PERSON_NAME_FIELDS = ['first_name', 'last_name', 'name'];

function getCurrentViewFilterId() {
	const currentRoute = app.router.lastRoute;

	let filterId = null;

	if (ROUTE_FILTER_KEY_MAP.hasOwnProperty(currentRoute)) {
		filterId = User.settings.get(ROUTE_FILTER_KEY_MAP[currentRoute]);
	}

	return filterId;
}

function getDealAgeInDays(dealAddTime) {
	const addTime = moment(dealAddTime, 'YYYY-MM-DD');
	const today = moment.utc().startOf('day');

	return Math.floor(moment.duration(today.diff(addTime)).asDays());
}

function getActionType(currentValue, previousValue) {
	if (!previousValue && currentValue) {
		return 'added';
	} else if (previousValue && currentValue && previousValue !== currentValue) {
		return 'edited';
	} else if (!currentValue && previousValue) {
		return 'removed';
	}

	return;
}

function trackPersonNameField(updatedFieldKey, action, model) {
	const isTrackedPersonNameField = TRACKED_PERSON_NAME_FIELDS.includes(updatedFieldKey);

	if (isTrackedPersonNameField) {
		PDMetrics.trackUsage(null, 'name', action, {
			person_id: model.get('id'),
			name_type: updatedFieldKey
		});
	}

	return;
}

module.exports = {
	trackFieldSaved: function(modelType, updatedValues) {
		if (updatedValues && !_.isNil(updatedValues.label)) {
			const action = updatedValues.label === '' ? 'label_removed' : 'label_applied';

			PDMetrics.trackUsage(null, modelType, action);
		}
	},

	trackDealFieldComponent: function(model, type) {
		if (type === 'activity') {
			// Track activity related field component changes
			ActivityAnalytics.trackActivityFormSaved({
				model: model.attributes,
				previous: model._previousAttributes,
				isNew: false,
				source: 'list'
			});
		}

		const addTime = model.get('add_time');
		const updatedFieldKey = _.keys(model.changed)[0];
		const currentValue = model.attributes[updatedFieldKey];
		const previousValue = model.previousAttributes()[updatedFieldKey];
		const changedTrackedComponent = TRACKED_COMPONENTS_MAP.hasOwnProperty(updatedFieldKey);
		const actionType = getActionType(currentValue, previousValue);
		const isDealOwnerChanged = updatedFieldKey === 'user_id';

		if (type === 'person') trackPersonNameField(updatedFieldKey, actionType, model);

		if (type !== 'deal') return;

		if (!actionType || !changedTrackedComponent) {
			return;
		}

		if (isDealOwnerChanged) {
			// Deal owner field change needs to send additional deal related data to Segment
			DetailViewAnalytics.trackDealDetailViewEvent(
				TRACKED_COMPONENTS_MAP[updatedFieldKey],
				'transferred',
				model
			);
		} else {
			PDMetrics.trackUsage(null, TRACKED_COMPONENTS_MAP[updatedFieldKey], actionType, {
				deal_id: model.get('id'),
				deal_age_days: getDealAgeInDays(addTime),
				deal_status: model.get('status')
			});
		}
	},
	phone: {
		valueClicked: function(data) {
			data = {
				container_component: data.container_component,
				field_type: 'phone',
				field_subtype: data.field_subtype,
				field_name: data.field_name,
				field_link_syntax: User.settings.get('callto_link_syntax'),
				is_caller_activated: User.companyFeatures.get('salesphone_full'),
				object_id: data.object_id,
				object_type: data.object_type,
				parent_object_id: data.parent_object_id,
				parent_object_type: data.parent_object_type,
				mail_thread_id: data.mail_thread_id,
				filter_id: getCurrentViewFilterId()
			};

			PDMetrics.trackUsage(null, 'phone_number', 'clicked', data);
		}
	}
};
