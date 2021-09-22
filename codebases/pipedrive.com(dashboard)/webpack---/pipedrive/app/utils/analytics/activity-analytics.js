'use strict';

const _ = require('lodash');
const moment = require('moment');
const User = require('models/user');
const PDMetrics = require('utils/pd-metrics');

const UTC_DATE_FORMAT = 'YYYY-MM-DD';
const UTC_TIME_FORMAT = 'HH:mm';
const UTC_DATE_TIME_FORMAT = `${UTC_DATE_FORMAT} ${UTC_TIME_FORMAT}`;

const toggleResolution = {
	OFF: 'off',
	ON: 'on'
};

// Helpers functions defined again in this file, so it would not use Backbone model getters,
// then tracking functions are reusable outside of webapp
const getDateTime = function(model) {
	if (model.due_time) {
		const date = `${model.dute_date} ${model.due_time}`;

		return moment.utc(date, UTC_DATE_TIME_FORMAT).local();
	} else {
		return moment(model.due_date, UTC_DATE_FORMAT).local();
	}
};

const isToday = function(model) {
	return moment().isSame(getDateTime(model), 'day');
};

const isAllDay = function(model) {
	const dueTime = model.due_time;

	return dueTime === '' || _.isNull(dueTime) || _.isUndefined(dueTime);
};

const isOverdue = function(model) {
	return getDateTime(model) < moment() && (!isToday(model) || !isAllDay(model));
};

const getUpdatedAddedDeletedFields = function(model, previous) {
	const trackedFields = [
		'due_date',
		'due_time',
		'duration',
		'type',
		'assigned_to_user_id',
		'deal_id',
		'lead_id',
		'person_id',
		'org_id',
		'subject',
		'note',
		'done'
	];
	const addedFields = [];
	const editedFields = [];
	const removedFields = [];

	trackedFields.forEach((field) => {
		const currentValue = model[field];
		const previousValue = previous[field];

		if (currentValue && !previousValue) {
			addedFields.push(field);
		} else if (!currentValue && previousValue) {
			removedFields.push(field);
		} else if (previousValue && currentValue && previousValue !== currentValue) {
			editedFields.push(field);
		}
	});

	return {
		addedFields,
		editedFields,
		removedFields
	};
};

const getActivityBaseData = function(model) {
	return {
		activity_id: model.id,
		activity_type: model.type,
		is_allday_activity: isAllDay(model),
		is_self_assigned: model.assigned_to_user_id === User.get('id'),
		deal_id: model.deal_id,
		person_id: model.person_id,
		org_id: model.org_id,
		is_overdue: isOverdue(model),
		is_done: !!model.done,
		duration: model.duration,
		participant_count: model.participants ? model.participants.length : 0,
		note_content_length: model.note ? model.note.length : 0,
		send_activity_notifications: !!model.send_activity_notifications,
		guests_count: model.attendees ? model.attendees.length : 0,
		public_description_content_length: model.public_description
			? model.public_description.length
			: 0,
		is_busy: !!model.busy_flag,
		is_location_filled: !!model.location,
		is_location_geocoded: !!model.location_lat,
		video_meeting_integration: model.conference_meeting_url && model.conference_meeting_client
	};
};

const getActionSpecificActivityData = function(options) {
	const model = options.model.attributes || options.model;
	const previous = options.previous.attributes || options.previous;
	const activityUpdatedExtraData = getUpdatedAddedDeletedFields(model, previous);
	const baseData = getActivityBaseData(model);

	if (options.isNew) {
		return {
			...baseData,
			activity_notifications_lang: options.activityNotificationsLang
		};
	} else {
		return {
			...baseData,
			update_source: options.source,
			added_fields: activityUpdatedExtraData.addedFields,
			edited_fields: activityUpdatedExtraData.editedFields,
			removed_fields: activityUpdatedExtraData.removedFields
		};
	}
};

const activityViewSwitched = function(targetViewCode) {
	PDMetrics.trackUsage(null, 'activity_view_switch_component', 'click', {
		target_view_code: targetViewCode
	});
};
const activityTypeFiltered = function(type) {
	PDMetrics.trackUsage(null, 'activity_type_filter_component', 'click', {
		object_type: 'activity',
		type_value: type || 'all'
	});
};
const schedulingBtnClicked = function(viewKey) {
	PDMetrics.trackUsage(viewKey, viewKey, 'scheduling_button_clicked', {});
};
const activitySettingsClicked = function() {
	PDMetrics.trackUsage(null, 'activity_settings', 'opened', {
		source: 'activity_list_view'
	});
};

/*
    Event naming: track.entity.component.event
        entity - activity, deal, person etc
        component - list, form, detailView, flow etc
        event - save, click, cancel etc
*/
module.exports = function() {
	app.global.bind('track.activity.viewSwitch.click', activityViewSwitched);
	app.global.bind('track.activity.typeFilter.click', activityTypeFiltered);
	app.global.bind('track.activity.schedulingButton.click', schedulingBtnClicked);
	app.global.bind('track.activity.activitySettings.click', activitySettingsClicked);
};

module.exports.trackActivityOpened = function(model) {
	const activityEventData = getActivityBaseData(model.attributes);

	PDMetrics.trackUsage(null, 'activity', 'opened', {
		...activityEventData,

		due_date: model.get('due_date'),
		due_time: model.get('due_time')
	});
};

module.exports.trackActivityMarkedAsDoneAndUndone = (data) => {
	const model = data.model.attributes || data.model;
	const activityEventData = getActivityBaseData(model);

	PDMetrics.trackUsage(null, 'activity', data.action, activityEventData);
};

module.exports.trackActivityFormSaved = function(options) {
	const metricsData = options.metricsData || {};
	const activityEventData = getActionSpecificActivityData(options);

	if (options.isNew) {
		PDMetrics.trackUsage(null, 'activity', 'added', {
			...activityEventData,
			source: options.followUp ? 'follow-up' : 'add-activity',
			...metricsData
		});
	} else {
		PDMetrics.trackUsage(null, 'activity', 'updated', {
			...activityEventData,
			...metricsData,
			...(options.linkedRelatedObject
				? { update_source: `contextual_view_${options.linkedRelatedObject}` }
				: {})
		});
	}
};

module.exports.activityFormClosed = function(options) {
	const model = options.model;
	const metricsData = options.metricsData || {};

	PDMetrics.trackUsage(
		null,
		'activity_form_component',
		'close',
		_.assign(
			{
				change_type: model.isNew() ? 'create' : 'update',
				object_type: 'activity',
				object_id: model.get('id'),
				is_overdue_activity: model.isOverdue(),
				is_allday_activity: model.isAllDay(),
				is_assigned_to_current_user: model.get('assigned_to_user_id') === User.get('id'),
				is_done: model.isDone(),
				participant_count: model.has('participants')
					? model.get('participants').length
					: null,
				follow_up: options.followUp
			},
			metricsData
		)
	);
};

module.exports.trackActivityDeleted = function(model) {
	const activityEventData = getActivityBaseData(model.attributes);

	PDMetrics.trackUsage(null, 'activity', 'deleted', activityEventData);
};

const trackActivityTypeFilterUsage = (filterType, toggleResolution) => {
	return PDMetrics.trackUsage(null, 'activity_type_filter', 'toggled', {
		filter_type: filterType,
		toggle_resolution: toggleResolution
	});
};

module.exports.trackActivityTypeFilterToggled = (excludedTypesAfterApplyingFilter, filterType) => {
	const isNewFilterTypeExcluded = excludedTypesAfterApplyingFilter.includes(filterType);
	const resoluton = isNewFilterTypeExcluded ? toggleResolution.OFF : toggleResolution.ON;

	trackActivityTypeFilterUsage(filterType, resoluton);
};

module.exports.trackToggleAllActivityTypeFilters = (isFilterSelected) => {
	const resolution = isFilterSelected ? toggleResolution.OFF : toggleResolution.ON;

	trackActivityTypeFilterUsage('all', resolution);
};

module.exports.trackActivityStatusFilterApplied = (filter, summaryModel) => {
	summaryModel.once('sync', () => {
		PDMetrics.trackUsage(null, 'activity_due_date_filter', 'applied', {
			filter_type: filter,
			total_count: summaryModel.get('total_count')
		});
	});
};

module.exports.trackActivityIcsDownloaded = function(model) {
	PDMetrics.trackUsage(null, 'activity_ics', 'downloaded', {
		activity_id: model.get('id')
	});
};

module.exports.trackInstallIntegrationLinkClicked = function() {
	PDMetrics.trackUsage(null, 'video_meeting_integration_install', 'clicked', {
		source: 'details_view',
		integration: 'zoom'
	});
};

module.exports.trackJoinButtonClicked = function(integration) {
	PDMetrics.trackUsage(null, 'video_meeting_link', 'interacted', {
		source: 'details_view',
		integration: integration.name,
		integration_client_id: integration.client_id,
		interaction: 'join_meeting'
	});
};
