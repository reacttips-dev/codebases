import moment from 'moment';
import { getActivityBaseData } from '../../../utils/track-usage';
import { ITEM_CONTEXT } from '../../../config/constants';

const trackUsage = (webappApi, getTrackingData) => (dispatch, getState) => {
	const context = getState().getIn(['tracking', 'context']);

	// LATER include context into event
	if (!context) {
		return;
	}

	webappApi.pdMetrics.trackUsage(null, ...getTrackingData());
};

const getUpdatedAddedDeletedFields = (item, previousItem) => {
	const trackedFields = ['due_date', 'due_time', 'duration'];
	const addedFields = [];
	const editedFields = [];
	const removedFields = [];

	trackedFields.forEach((field) => {
		const currentValue = item.getIn(['data', field]);
		const previousValue = previousItem.getIn(['data', field]);

		if (currentValue && !previousValue) {
			addedFields.push(field);
		} else if (!currentValue && previousValue) {
			removedFields.push(field);
		} else if (previousValue !== currentValue) {
			editedFields.push(field);
		}
	});

	return {
		addedFields,
		editedFields,
		removedFields,
	};
};

export const trackCalendarItemResized = (webappApi, item) =>
	trackUsage(webappApi, () => [
		'activity_calendar_item_component',
		'resize',
		{
			change_type: 'update',
			object_type: item.get('type'),
			object_id: item.getIn(['data', 'id']),
		},
	]);

export const trackCalendarItemDragged = (webappApi, item, previousItem) =>
	trackUsage(webappApi, () => [
		'activity_calendar_item_component',
		'drag',
		{
			change_type: 'update',
			object_type: item.get('type'),
			object_id: item.getIn(['data', 'id']),
			is_allday_activity: item.get('context') === ITEM_CONTEXT.ALLDAY,
			is_dragged_to_different_day: !moment(item.get('startDateTime')).isSame(
				previousItem.getIn(['data', 'due_date']),
				'day',
			),
		},
	]);

export const trackCalendarItemUpdated = (webappApi, item, previousItem) => {
	if (!item || 'activity' !== item.get('type')) {
		// not dispatching any action
		return () => {};
	}

	return trackUsage(webappApi, () => {
		const baseData = getActivityBaseData(webappApi, item);
		const activityUpdatedExtraData = getUpdatedAddedDeletedFields(item, previousItem);

		return [
			'activity',
			'updated',
			{
				...baseData,
				update_source: 'calendar',
				is_done: !!item.getIn(['data', 'done']),
				added_fields: activityUpdatedExtraData.addedFields,
				edited_fields: activityUpdatedExtraData.editedFields,
				removed_fields: activityUpdatedExtraData.removedFields,
			},
		];
	});
};

export const changeTracking = ({ context } = {}) => {
	return {
		type: 'CHANGE_TRACKING',
		context,
	};
};
