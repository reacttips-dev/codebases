import moment from 'moment';
import { isString } from 'lodash';
import * as Immutable from 'immutable';
import {
	DURATIONS,
	HOURS_IN_DAY,
	UTC_DATE_FORMAT,
	UTC_DATETIME_FORMAT,
	ITEM_CONTEXT,
} from '../config/constants';
import { formatDuration, formatUTCDate, formatTime24H } from './date';

const getActivityProps = (activity) => {
	if (Immutable.Map.isMap(activity)) {
		return {
			dueDate: activity.getIn(['data', 'due_date']),
			dueTime: activity.getIn(['data', 'due_time']),
			duration: activity.getIn(['data', 'duration']),
		};
	}

	return { dueDate: activity.due_date, dueTime: activity.due_time, duration: activity.duration };
};

export const getItemContext = (item) => {
	const { dueTime, duration } = getActivityProps(item);

	return dueTime && moment.duration(duration).asHours() < HOURS_IN_DAY
		? ITEM_CONTEXT.GRID
		: ITEM_CONTEXT.ALLDAY;
};

// Example: user local time is 14:00, durationInDays is 3.5 days.
// Then this event will span 4 days. After we add 3 days to 14:00, we're at the same time 3 days after.
// Now we have 0.5 days left 14:00 + 12h = 1 day, 2h
const passesToNextDay = (dueTime, durationInDays) => {
	const [hours, minutes] = dueTime.split(':');
	const hoursSinceDayStart = Number(hours) + (Number(minutes) + moment().utcOffset()) / 60;
	const dueTimePartOfFullDay = (hoursSinceDayStart / 24) % 1;
	const durationRemainder = durationInDays % 1;

	return dueTimePartOfFullDay + durationRemainder > 1;
};

const allDayActivityVisibleDuration = (dueTime, duration) => {
	if (!duration) {
		return moment.duration(DURATIONS.ALLDAY_DEFAULT_DURATION);
	}

	const dividingResult =
		moment.duration(duration).asMilliseconds() / DURATIONS.ALLDAY_DEFAULT_DURATION;
	const fullDaysDuration = Math.floor(dividingResult);
	const dividingRestExists = dividingResult - fullDaysDuration > 0;

	let durationExtension = 0;

	if (dueTime || dividingRestExists) {
		durationExtension++;
	}

	if (dueTime && passesToNextDay(dueTime, dividingResult)) {
		durationExtension++;
	}

	return moment.duration(
		DURATIONS.ALLDAY_DEFAULT_DURATION * (fullDaysDuration + durationExtension),
	);
};

const calculateLocalTimeFrame = (item) => {
	const { dueDate, dueTime, duration } = getActivityProps(item);
	const startDateTime = dueTime
		? moment.utc(`${dueDate} ${dueTime}`, UTC_DATETIME_FORMAT).local()
		: moment(dueDate, UTC_DATE_FORMAT);
	const visibleDuration =
		item.get('context') === ITEM_CONTEXT.GRID
			? moment.duration(duration || DURATIONS.GRID_MIN_DURATION)
			: allDayActivityVisibleDuration(dueTime, duration);
	const endDateTime = startDateTime.clone().add(visibleDuration);

	return { startDateTime, endDateTime, duration: visibleDuration };
};

export function parseCalendarItem(item) {
	if (!Immutable.Map.isMap(item)) {
		item = Immutable.fromJS(item);
	}

	item = item.withMutations((mutatingItem) => {
		mutatingItem.set('context', getItemContext(mutatingItem));

		const { startDateTime, endDateTime, duration } = calculateLocalTimeFrame(mutatingItem);

		mutatingItem.set('startDateTime', startDateTime);
		mutatingItem.set('endDateTime', endDateTime);
		mutatingItem.set('duration', duration);
	});

	return item;
}

/**
 * Returns the list of active activity types
 * @param webappApi
 * @param selectedTypeKey the type with this key is included in the list even if it is not active
 * @returns array of active types to be displayed in modal
 */
export function getActivityTypes(webappApi, selectedTypeKey = '') {
	return webappApi.userSelf.attributes.activity_types
		.filter((type) => type.active_flag || type.key_string === selectedTypeKey)
		.sort((a, b) => a.order_nr - b.order_nr);
}

export function filterActiveActivityTypes(activityTypes, selectedTypeKey = '') {
	return activityTypes.filter((type) => type.active_flag || type.key_string === selectedTypeKey);
}

export function getActivityTypeByKey(webappApi, typeKey) {
	return webappApi.userSelf.attributes.activity_types.find((type) => type.key_string === typeKey);
}

export function getDefaultActivityType(webappApi) {
	const activityTypes = getActivityTypes(webappApi);

	return activityTypes && activityTypes.length ? activityTypes[0] : { key_string: '' };
}

export function prepareActivityData(item, isAdding = false) {
	const duration = item.getIn(['data', 'duration']);
	const dueTime = item.getIn(['data', 'due_time']);
	const isDefaultSubject = item.get('isDefaultSubject');
	const activity = {
		type: item.getIn(['data', 'type']),
		user_id: item.getIn(['data', 'user_id']),
		due_date: formatUTCDate(item.getIn(['data', 'due_date'])),
	};

	if (dueTime) {
		activity.due_time = formatTime24H(dueTime);
	}

	if (duration) {
		activity.duration = isString(duration) ? duration : formatDuration(duration);
	}

	if (isAdding || !isDefaultSubject) {
		activity.subject = item.getIn(['data', 'subject']);
	}

	return activity;
}

export function prepareNextActivityData(item) {
	const leadId = item.getIn(['data', 'lead_id']);

	return {
		next: true,
		deal: item.getIn(['data', 'deal_id']),
		lead: leadId
			? {
					id: leadId,
					title: item.getIn(['data', 'lead_title']),
			  }
			: null,
		person: item.getIn(['data', 'person_id']),
		organization: item.getIn(['data', 'org_id']),
	};
}

const computeDealStatus = (item) => {
	const dealId = item.getIn(['data', 'deal_id']);

	return item.getIn(['data', 'related_objects', 'deal', `${dealId}`, 'status']);
};

export function shouldScheduleNextActivityForDeal(item) {
	const moreActivitiesScheduled = item.getIn([
		'data',
		'additional_data',
		'more_activities_scheduled_in_context',
	]);

	return moreActivitiesScheduled === false && computeDealStatus(item) !== 'deleted';
}

export function isOverdue({ due_date: dueDate, due_time: dueTime }) {
	const isAllDay = !dueTime;
	const dateTime = isAllDay
		? moment(dueDate, UTC_DATE_FORMAT).local()
		: moment.utc(`${dueDate} ${dueTime}`, UTC_DATETIME_FORMAT).local();
	const isToday = moment().isSame(dateTime, 'day');

	return dateTime < moment() && (!isToday || !isAllDay);
}

export function calculateDurationFromDateTimeRange(date1, date2, limit = false) {
	let diff = moment(date2).diff(date1);

	if (limit) {
		diff = Math.max(diff, DURATIONS.GRID_MIN_DURATION);
	}

	return formatDuration(diff);
}

export const isHiddenDeal = (deal) => {
	return deal && !deal.title;
};

export const handleHiddenDeal = (dealId, itemHiddenText) => {
	return dealId ? { id: dealId, title: `(${itemHiddenText})` } : null;
};

export const isHiddenOrg = (organization) => {
	return organization && !organization.name;
};

export const handleHiddenOrg = (orgId, itemHiddenText) => {
	return orgId ? { id: orgId, name: `(${itemHiddenText})` } : null;
};

export const isHiddenPerson = (person) => {
	return person && !person.name;
};

export const handleHiddenPerson = (personId, itemHiddenText) => {
	return personId
		? { id: personId, name: `(${itemHiddenText})`, email: [{ value: 'email', primary: true }] }
		: null;
};

export const handleHiddenUser = (userId, itemHiddenText) => {
	return userId ? { id: userId, attributes: { name: `(${itemHiddenText})` } } : null;
};

export const isSyncedActivityType = (userSettings, activityType) => {
	const ignoredActivityTypes = userSettings.get('calendar_sync_ignore_activity_types');

	return !ignoredActivityTypes || !ignoredActivityTypes.includes(activityType);
};

export const extractActivityTrackingBaseData = (webappApi, activity) => {
	return {
		activity_id: activity.id,
		activity_type: activity.type,
		is_allday_activity: !activity.due_time,
		is_self_assigned: activity.assigned_to_user_id === webappApi.userSelf.attributes.id,
		deal_id: activity.deal_id,
		lead_id: activity.lead_id,
		person_id: activity.person_id,
		org_id: activity.org_id,
		is_overdue: isOverdue(activity),
		is_done: !!activity.done,
		duration: activity.duration,
		participant_count: activity.participants ? activity.participants.length : 0,
		note_content_length: activity.note ? activity.note.length : 0,
		is_busy: !!activity.busy_flag,
		is_location_filled: !!activity.location,
		guests_count: activity.attendees ? activity.attendees.length : 0,
		public_description_content_length: activity.public_description
			? activity.public_description.length
			: 0,
		video_meeting_integration:
			activity.conference_meeting_client && activity.conference_meeting_url
				? activity.conference_meeting_client
				: null,
	};
};

export const mergeCalendarItems = (item, actionData) => {
	return item
		.setIn(['data', 'attendees'], actionData.getIn(['data', 'attendees']))
		.setIn(['data', 'participants'], actionData.getIn(['data', 'participants']))
		.mergeDeep(actionData);
};

export const getActivityOrganizerDetails = (attendees, currentUserId) => {
	const activityOrganizer =
		attendees.find((attendee) => attendee.get('is_organizer')) || new Immutable.Map();
	const isCurrentUserActivityAttendee = !!attendees.find(
		(attendee) => attendee.get('user_id') === currentUserId,
	);
	const isCurrentUserActivityOrganizer = isCurrentUserActivityAttendee
		? activityOrganizer.get('user_id') === currentUserId
		: activityOrganizer.isEmpty();

	return {
		activityOrganizer,
		isCurrentUserActivityOrganizer,
	};
};
