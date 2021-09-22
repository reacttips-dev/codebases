import { get, put } from '@pipedrive/fetch';
import { DURATIONS } from '../../../config/constants';
import { formatUTCDateTime } from '../../../utils/date';
import { isOverdue } from '../../../utils/activity';

const getActivitiesBasedOnQuery = async ({ startDate, endDate, query }) => {
	return await get('/api/v1/activities', {
		queryParams: {
			start_date: formatUTCDateTime(startDate),
			end_date: formatUTCDateTime(endDate),
			...(query.userId && { user_id: query.userId }),
			...(query.type && { type: query.type }),
			include_duration: 1,
			include_recurring: 1,
			limit: query.limit || 500,
		},
	});
};

const updateActivity = async (item) => {
	return await put(`/api/v1/activities/${item.getIn(['data', 'id'])}`, {
		due_date: item.getIn(['data', 'due_date']),
		due_time: item.getIn(['data', 'due_time']),
		duration: item.getIn(['data', 'duration']),
		done: item.getIn(['data', 'done']),
	});
};

const getNewActivityOptions = ({ mainType, activityType, date, time, userId }) => {
	return {
		id: `${mainType}.newActivity`,
		type: mainType,
		isAdding: true,
		isPreview: true,
		ignoreIntersection: true,
		isDefaultSubject: true,
		data: {
			subject: activityType.name,
			type: activityType.key_string,
			due_date: date,
			due_time: time,
			duration: time ? DURATIONS.GRID_MIN_DURATION : null,
			user_id: userId,
		},
	};
};

const getQuickAddTrackingParams = ({ data, webappApi }) => {
	return {
		id: data.id,
		isAllDay: !data.due_time,
		isAssignedToCurrentUser: data.user_id === webappApi.userSelf.get('id'),
		isOverdue: isOverdue(data),
		activityType: data.type,
		duration: data.duration,
	};
};

export {
	getActivitiesBasedOnQuery,
	updateActivity,
	getNewActivityOptions,
	getQuickAddTrackingParams,
};
