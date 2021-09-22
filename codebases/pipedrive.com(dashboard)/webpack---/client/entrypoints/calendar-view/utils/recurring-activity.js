import moment from 'moment';
import { UTC_DATETIME_FORMAT } from '../../../config/constants';

const addOrUpdateRecurringActivityInstances = ({
	series,
	item,
	mainType,
	activityId,
	startDate,
	endDate,
	calendarApi,
}) => {
	series.forEach((serie) => {
		const date = moment.utc(
			`${serie.get('due_date')} ${serie.get('due_time')}`,
			UTC_DATETIME_FORMAT,
		);

		if (!date.isBetween(startDate, endDate)) {
			return;
		}

		calendarApi.addOrUpdateItemSilently(
			item.mergeDeep({
				id: `${mainType}.${activityId}.${serie.get('due_date')}_${serie.get('due_time')}`,
				type: mainType,
				masterActivityId: activityId,
				data: {
					due_date: serie.get('due_date'),
					due_time: serie.get('due_time'),
					series: null,
				},
			}),
		);
	});
};

const removeRecurringActivities = ({ activityId, calendarApi, type, removeItem }) => {
	calendarApi &&
		calendarApi.getItems(type).map((item) => {
			if (
				activityId === item.get('masterActivityId') ||
				activityId === item.get('data').get('rec_master_activity_id')
			) {
				removeItem(activityId);
			}
		});
};

const generateRecurringActivities = ({
	item,
	mainType,
	calendarApi,
	startDate,
	endDate,
	removeItem,
}) => {
	const activityId = item.getIn(['data', 'id']);
	const series = item.getIn(['data', 'series']);

	if (!(calendarApi && series && series.size)) {
		return;
	}

	removeRecurringActivities({ activityId, calendarApi, type: mainType, removeItem });
	addOrUpdateRecurringActivityInstances({
		series,
		item,
		mainType,
		activityId,
		startDate,
		endDate,
		calendarApi,
	});
};

export {
	generateRecurringActivities,
	removeRecurringActivities,
	addOrUpdateRecurringActivityInstances,
};
