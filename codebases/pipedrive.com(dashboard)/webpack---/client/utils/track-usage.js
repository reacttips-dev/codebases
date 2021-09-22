import moment from 'moment';
import { ITEM_CONTEXT } from '../config/constants';
import { isOverdue } from './activity';

function trackUsage(webappApi, ...args) {
	webappApi.pdMetrics.trackUsage(...args);
}

export function getActivityBaseData(webappApi, item) {
	const participants = item.getIn(['data', 'participants']);
	const note = item.getIn(['data', 'note']);

	return {
		activity_id: item.getIn(['data', 'id']),
		activity_type: item.getIn(['data', 'type']),
		is_allday_activity: item.get('context') === ITEM_CONTEXT.ALLDAY,
		is_self_assigned:
			item.getIn(['data', 'assigned_to_user_id']) === webappApi.userSelf.get('id'),
		deal_id: item.getIn(['data', 'deal_id']),
		lead_id: item.getIn(['data', 'lead_id']),
		project_id: item.getIn(['data', 'project_id']),
		person_id: item.getIn(['data', 'person_id']),
		org_id: item.getIn(['data', 'org_id']),
		is_busy: item.getIn(['data', 'busy_flag']),
		is_location_filled: !!item.getIn(['data', 'location']),
		is_location_geocoded: !!item.getIn(['data', 'location_lat']),
		is_overdue: isOverdue({
			due_date: item.getIn(['data', 'due_date']),
			due_time: item.getIn(['data', 'due_time']),
		}),
		duration: item.getIn(['data', 'duration']),
		participant_count: participants ? participants.length : 0,
		note_content_length: note ? note.length : 0,
	};
}

const getActivitiesProps = (items) => {
	const props = {
		activity_count: 0,
		done_activity_count: 0,
		planned_activity_count: 0,
		linked_to_deal_activity_count: 0,
		not_linked_to_deal_activity_count: 0,
		overdue_activity_count: 0,
		due_today_activity_count: 0,
	};
	const now = moment();

	items &&
		items.forEach((item) => {
			if (!item || !item.get('data')) {
				return;
			}

			const data = item.get('data');
			const isToday = now.isSame(item.get('startDateTime'), 'day');
			const isOverdue =
				item.get('startDateTime') < now && (!isToday || item.get('context') !== 'allday');

			if (data.get('done')) {
				props.done_activity_count++;
			} else if (isOverdue) {
				props.overdue_activity_count++;
			} else if (isToday) {
				props.due_today_activity_count++;
			} else {
				props.planned_activity_count++;
			}

			if (data.get('deal_id')) {
				props.linked_to_deal_activity_count++;
			} else {
				props.not_linked_to_deal_activity_count++;
			}

			props.activity_count++;
		});

	return props;
};

export const onViewSwitched = (webappApi) => {
	trackUsage(webappApi, null, 'activity_view_switch_component', 'click', {
		target_view_code: 'activity_list_view',
	});
};

export const trackCalendarWeekChanged = (webappApi, { date, weeks }) => {
	let changeType;

	if (weeks) {
		changeType = weeks > 0 ? 'next' : 'previous';
	} else if (date) {
		changeType = 'custom_date';
	} else {
		changeType = 'today';
	}

	return trackUsage(webappApi, null, 'calendar_week', 'changed', {
		change_type: changeType,
	});
};

export const trackActivityTypeFiltered = (webappApi, isExcluded, type = 'all') =>
	trackUsage(webappApi, null, 'activity_type_filter', 'toggled', {
		filter_type: type,
		resolution: isExcluded ? 'off' : 'on',
	});

export const trackCalendarItemMarkedDoneUndone = (webappApi, item, isActivityDone) => {
	const activityData = getActivityBaseData(webappApi, item);
	const action = isActivityDone ? 'marked_undone' : 'marked_done';

	trackUsage(webappApi, null, 'activity', action, activityData);
};

export const activityQuickAdded = (
	webappApi,
	{ id, isAllDay, isAssignedToCurrentUser, isOverdue, activityType, duration },
) =>
	trackUsage(webappApi, null, 'activity', 'added', {
		activity_id: id,
		activity_type: activityType,
		duration,
		is_allday_activity: isAllDay,
		is_assigned_to_current_user: isAssignedToCurrentUser,
		is_done: false,
		is_overdue: isOverdue,
		source: 'calendar-quick-add',
	});

export const activityQuickDetailsOpened = (webappApi) =>
	trackUsage(webappApi, null, 'activity_quickadd_component', 'details', {
		view_version: '2',
	});

export const calendarItemClicked = (webappApi, item) =>
	trackUsage(webappApi, null, 'activity_calendar_item_component', 'click', {
		object_type: item.get('type'),
		object_id: item.getIn(['data', 'id']),
		is_allday_activity: item.get('context') === ITEM_CONTEXT.ALLDAY,
	});

export const trackCalendarViewOpened = (webappApi, getState, isRetry = false) => {
	const items = getState()
		.get('calendar')
		.get('items')
		.filter((item) => item.get('type') === 'activity');

	if ((items && items.size) || isRetry) {
		return trackUsage(webappApi, null, 'calendar_view', 'opened', getActivitiesProps(items));
	}

	return setTimeout(() => trackCalendarViewOpened(webappApi, getState, true), 5000);
};
