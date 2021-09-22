import { get, isEmpty, isPlainObject } from 'lodash';
import { isOverdue, extractActivityTrackingBaseData } from '../../../utils/activity';

const trackedFields = [
	'subject',
	'type',
	'due_date',
	'due_time',
	'duration',
	'location',
	'assigned_to_user_id',
	'public_description',
	'busy_flag',
	'done',
	'note',
	'user_id',
	'deal_id',
	'person_id',
	'org_id',
	'lead_id',
];

const trackNoteEdited = (webappApi, noteTrackingData) => {
	webappApi.pdMetrics.trackUsage(null, 'note', 'edited', noteTrackingData);
};

const trackNoteAdded = (webappApi, noteTrackingData) => {
	webappApi.pdMetrics.trackUsage(null, 'note', 'added', noteTrackingData);
};

const extractUpdatedAddedDeletedFields = (current, previous) => {
	const addedFields = [];
	const editedFields = [];
	const removedFields = [];

	trackedFields.forEach((field) => {
		const currentValue = current[field];
		const previousValue = previous[field];

		if (currentValue && !previousValue) {
			addedFields.push(field);
		} else if (!currentValue && previousValue) {
			removedFields.push(field);
		} else if (previousValue !== currentValue) {
			editedFields.push(field);
		}
	});

	return {
		added_fields: addedFields,
		edited_fields: editedFields,
		removed_fields: removedFields,
	};
};

const extractActionTrackingData = (webappApi, tracking, isActivityOpeneningEvent = false) => {
	const isNew = tracking.previous === null;
	const current = get(tracking, 'current.data', {});
	const previous = get(tracking, 'previous.data', {});
	const activityData = isEmpty(current) ? previous : current;
	const baseData = extractActivityTrackingBaseData(webappApi, activityData);
	const shouldIncludeModifiedFields = !isNew && !isActivityOpeneningEvent;

	return {
		...baseData,
		...(shouldIncludeModifiedFields ? extractUpdatedAddedDeletedFields(current, previous) : {}),
		activity_notifications_lang: current.notification_language_id,
	};
};

const extractMeta = (webappApi, tracking) => {
	const isAdvancedModal = webappApi.userSelf.companyFeatures.get('activities_modal_new_advanced');

	return {
		modal_version: isAdvancedModal ? 'ver2.5' : 'ver2.0',
		is_location_geocoded: get(tracking, 'meta.is_location_geocoded', null),
		send_activity_notifications: get(tracking, 'meta.send_activity_notifications', null),
		follow_up: get(tracking, 'meta.follow_up', null),
		is_date_time_set_from_calendar: get(tracking, 'meta.is_date_time_set_from_calendar', null),
	};
};

const extractExternalMeta = (tracking, activity) => {
	if (!isPlainObject(tracking.externalMeta)) {
		return {};
	}

	const { prepopulated_fields: fields, activityData, source } = tracking.externalMeta;

	if (fields && fields.length && activityData) {
		return {
			prepopulated_fields: fields,
			prepopulated_fields_changed: fields.filter(
				(field) => activityData[field] !== activity[field],
			),
			source,
		};
	}

	return {};
};

const getEntryPoint = (tracking) => {
	const { pathname, search: URLSearch } = window.location;
	const pathParts = pathname.split('/');
	// an example of a pathname: '/activities/list/user/10382835' -> pathParts are ['', 'activities', 'list', 'user', '10382835']
	// only the second and third string of this list are relevant here
	const routeParts = pathParts.slice(1, 3);
	const isOpenedFromContextualView =
		routeParts[0] === 'activities' &&
		URLSearch?.includes('?selected=') &&
		!tracking.isContextualView;

	if (isOpenedFromContextualView) {
		return 'contextual_view';
	}

	const routeSpecifiers = ['list', 'calendar', 'timeline', 'insights', 'inbox'];

	if (routeSpecifiers.includes(routeParts[1])) {
		return routeParts.join('_');
	}

	return routeParts[0];
};

const trackActivityOpened = (webappApi, tracking) => {
	const entryPoint = getEntryPoint(tracking);
	const actionTrackingData = extractActionTrackingData(webappApi, tracking, true);

	const trackingData = {
		...actionTrackingData,
		...extractMeta(webappApi, tracking),
		is_contextual_view: tracking.isContextualView,
		entry_point: entryPoint,
	};

	webappApi.pdMetrics.trackUsage(null, 'activity', 'opened', trackingData);
};

const trackActivityNote = (
	webappApi,
	actionTrackingData,
	isNew,
	isFollowUp,
	containsImage = false,
) => {
	const {
		edited_fields: editedFields,
		added_fields: addedFields,
		note_content_length: noteContentLength,
	} = actionTrackingData;
	const addOrUpdateActivitySource = isNew ? 'add-activity' : 'update-activity';

	const noteTrackingData = {
		source: isFollowUp ? 'follow-up' : addOrUpdateActivitySource,
		deal_id: actionTrackingData.deal_id,
		person_id: actionTrackingData.person_id,
		org_id: actionTrackingData.org_id,
		note_id: null,
		activity_id: actionTrackingData.activity_id,
		content_length: actionTrackingData.note_content_length,
		linked_to: 'activity',
		is_image_attached: containsImage,
	};

	if (editedFields && editedFields.includes('note')) {
		trackNoteEdited(webappApi, noteTrackingData);
	}

	if ((addedFields && addedFields.includes('note')) || (isNew && noteContentLength)) {
		trackNoteAdded(webappApi, noteTrackingData);
	}
};

const trackActivitySaved = (webappApi, tracking, activity) => {
	const isNew = tracking.previous === null;
	const isFollowUp = get(tracking, 'meta.follow_up', null);
	const actionTrackingData = extractActionTrackingData(webappApi, tracking);

	const trackingData = {
		...actionTrackingData,
		...extractMeta(webappApi, tracking),
		...(isNew ? { source: isFollowUp ? 'follow-up' : tracking.source || 'add-activity' } : {}),
		...(isNew ? extractExternalMeta(tracking, activity) : {}),
		...(tracking.isContextualView ? { update_source: 'contextual_view' } : {}),
	};

	webappApi.pdMetrics.trackUsage(null, 'activity', isNew ? 'added' : 'updated', trackingData);
	trackActivityNote(webappApi, actionTrackingData, isNew, isFollowUp);
};

const trackActivityRemoved = (webappApi, tracking) => {
	const trackingData = {
		...extractActivityTrackingBaseData(webappApi, get(tracking, 'previous.data', {})),
		...extractMeta(webappApi, tracking),
	};

	webappApi.pdMetrics.trackUsage(null, 'activity', 'deleted', trackingData);
};

const extractTrackingDataFromStore = (webappApi, tracking, activity) => {
	const isNew = tracking.previous === null;
	const dueTime = get(activity, 'dueTime');

	return {
		is_busy: !!activity.busyFlag,
		is_location_filled: !!activity.location,
		change_type: isNew ? 'create' : 'update',
		activity_id: get(activity, 'activityId', null),
		activity_type: activity.type,
		deal_id: get(activity, 'deal.id', null),
		lead_id: get(activity, 'lead.id', null),
		duration: activity.duration,
		is_allday_activity: !dueTime,
		is_done: !!get(activity, 'done'),
		is_overdue: isOverdue({ due_date: get(activity, 'dueDate'), due_time: dueTime }),
		is_self_assigned: get(activity, 'userId') === webappApi.userSelf.attributes.id,
		org_id: get(activity, 'organization.id', null),
		participant_count: (get(activity, 'participants') || []).length,
		person_id: get(
			activity,
			'participants[0].id',
			get(activity, 'participants[0].person_id', null),
		),
		...extractMeta(webappApi, tracking),
		...extractExternalMeta(tracking, activity),
	};
};

const trackModalDismissed = (webappApi, tracking, activity) => {
	const trackingData = extractTrackingDataFromStore(webappApi, tracking, activity);

	webappApi.pdMetrics.trackUsage(null, 'activity', 'modal_dismissed', trackingData);
};

const trackCalendarSyncTeaserClicked = (webappApi) => {
	webappApi.pdMetrics.trackUsage(null, 'calendarsync_teaser', 'clicked', {
		source: 'activity_modal',
	});
};

const trackCalendarSyncTeaserClosed = (webappApi) => {
	webappApi.pdMetrics.trackUsage(null, 'calendarsync_teaser', 'closed', {
		source: 'activity_modal',
	});
};

const trackVideoMeetingLink = (webappApi, target, action, interaction, integration) => {
	const trackInteraction = interaction ? { interaction } : {};
	const integrationName = integration ? integration.get('name') : null;
	const integrationClientId = integration ? integration.get('client_id') : null;

	webappApi.pdMetrics.trackUsage(null, target, action, {
		source: 'activity_modal',
		integration: integrationName,
		integration_client_id: integrationClientId,
		...trackInteraction,
	});
};

const trackVideoMeetingIntegrationInstallClicked = (webappApi, integration) =>
	trackVideoMeetingLink(
		webappApi,
		'video_meeting_integration_install',
		'clicked',
		null,
		integration,
	);

const trackVideoMeetingLinkCreated = (webappApi, integration) =>
	trackVideoMeetingLink(webappApi, 'video_meeting_link', 'created', null, integration);

const trackVideoMeetingLinkInteracted = (webappApi, interaction, integration) =>
	trackVideoMeetingLink(webappApi, 'video_meeting_link', 'interacted', interaction, integration);

const trackModalExpanded = ({ webappApi, tracking, activity, expandedFrom }) => {
	const trackingData = extractTrackingDataFromStore(webappApi, tracking, activity);

	webappApi.pdMetrics.trackUsage(null, 'activity', 'modal_expanded', {
		...trackingData,
		expanded_from: expandedFrom,
	});
};

export {
	trackActivityOpened,
	trackActivitySaved,
	trackActivityRemoved,
	trackModalDismissed,
	trackCalendarSyncTeaserClicked,
	trackCalendarSyncTeaserClosed,
	trackVideoMeetingIntegrationInstallClicked,
	trackVideoMeetingLinkCreated,
	trackVideoMeetingLinkInteracted,
	trackModalExpanded,
};
