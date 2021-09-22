import moment from 'moment';
import { range, isEqual, cloneDeep } from 'lodash';
import * as Immutable from 'immutable';
import { DURATIONS, MINUTES_IN_DAY, HEIGHT_OF_HOUR, ITEM_CONTEXT } from '../../../config/constants';
import { formatTime24H } from '../../../utils/date';

const activityLastsOnDate = (localDate) => {
	return (item) => {
		const startDateTime = moment(item.get('startDateTime'));
		const endDateTime = moment(item.get('endDateTime'));

		return localDate.isSame(startDateTime, 'day') || localDate.isSame(endDateTime, 'day');
	};
};

const calculateLocalTimeFrameForDate = (item, forLocalDate = moment()) => {
	const minDuration =
		item.get('context') === ITEM_CONTEXT.GRID
			? DURATIONS.GRID_MIN_DURATION
			: DURATIONS.ALLDAY_DEFAULT_DURATION;
	const startOfDay = forLocalDate.clone().startOf('day');
	const endOfDay = forLocalDate.clone().endOf('day');
	const startDateTime = moment.max(startOfDay, moment(item.get('startDateTime')));
	const endDateTime = moment.min(endOfDay, moment(item.get('endDateTime')));
	const duration = moment.duration(Math.max(endDateTime.diff(startDateTime), minDuration));

	return { startDateTime, endDateTime, duration };
};

const calculateActivityEnd = (localStartDateTime, duration, start) => {
	const localEndDateTime = localStartDateTime.clone().add(duration);
	const UTCOffsetDiff = localStartDateTime.utcOffset() - localEndDateTime.utcOffset();
	const durationMinutes = duration.asMinutes() - UTCOffsetDiff;

	return Math.min(start + Math.ceil(durationMinutes), MINUTES_IN_DAY) - 1;
};

const activityAsTimeRange = (date) => (ranges, item) => {
	const startDateTime = moment(item.get('startDateTime'));
	const { startDateTime: localStartDateTime, duration } = calculateLocalTimeFrameForDate(
		item,
		date,
	);
	const start = Math.floor(moment.duration(formatTime24H(localStartDateTime)).asMinutes());
	const end = calculateActivityEnd(localStartDateTime, duration, start);

	const startOffset = Math.max(date.diff(startDateTime, 'minutes'), 0);

	ranges[item.get('id')] = {
		startOffset,
		start,
		end,
		position: item.get('ignoreIntersection') ? 0 : -1,
		columns: 1,
		ignoreIntersection: item.get('ignoreIntersection'),
	};

	return ranges;
};

const getTimeSlotMaxColumns = (minuteSlots, activitiesRanges) => {
	return minuteSlots.reduce(
		(maxColCount, id) => Math.max(maxColCount, activitiesRanges[id].columns),
		minuteSlots.length,
	);
};

const calculateActivitiesColumns = (allMinutesSlots, activitiesRanges) => {
	const recalculateActivitiesColumns = () => {
		const initialActivities = cloneDeep(activitiesRanges);

		for (let minute = 0; minute < MINUTES_IN_DAY; minute++) {
			const minuteSlots = allMinutesSlots[minute];

			minuteSlots.forEach((activityId) => {
				const activity = activitiesRanges[activityId];
				const maxColCount = getTimeSlotMaxColumns(minuteSlots, activitiesRanges);

				activity.columns = Math.max(activity.columns, maxColCount);
			});
		}

		if (!isEqual(initialActivities, activitiesRanges)) {
			recalculateActivitiesColumns();
		}
	};

	recalculateActivitiesColumns();
};

const isFreeSpace = (minuteSlots, position, activityId, activitiesRangesMap) => {
	for (let slot = 0; slot < minuteSlots.length; ++slot) {
		const activity = activitiesRangesMap[minuteSlots[slot]];

		if (activity.position === position) {
			return activity.id === activityId;
		}
	}

	return true;
};

const calculateActivityPosition = (minuteSlots, activityId, activitiesRangesMap) => {
	let position = 0;

	while (!isFreeSpace(minuteSlots, position, activityId, activitiesRangesMap)) {
		position++;
	}

	return position;
};

const calculateActivitiesIntersectionsForDate = (activities, date) => {
	if (!activities.size) {
		return {};
	}

	const allMinutesSlots = range(MINUTES_IN_DAY).map(() => []);
	const activitiesRangesMap = activities.reduce(activityAsTimeRange(date), {});

	Object.keys(activitiesRangesMap).forEach((itemId) => {
		const { start, end, ignoreIntersection } = activitiesRangesMap[itemId];

		if (ignoreIntersection) {
			return;
		}

		range(start, end + 1).forEach((minute) => {
			allMinutesSlots[minute].push(itemId);
		});
	});

	calculateActivitiesColumns(allMinutesSlots, activitiesRangesMap);

	for (let minute = 0; minute < MINUTES_IN_DAY; minute++) {
		const minuteSlots = allMinutesSlots[minute];

		for (let slot = 0; slot < minuteSlots.length; slot++) {
			const id = minuteSlots[slot];
			const activityRange = activitiesRangesMap[id];

			if (activityRange.position === -1) {
				activityRange.position = calculateActivityPosition(
					minuteSlots,
					id,
					activitiesRangesMap,
				);
			}
		}
	}

	return activitiesRangesMap;
};

export const calculateAndApplyPositions = (startDate, daysNumber, collection) => {
	const startDateLocal = moment(startDate);
	const calendarDays = Immutable.List(range(daysNumber)).map((day) =>
		startDateLocal.clone().add(day, 'days'),
	);

	return calendarDays.map((date) => {
		const itemsForDay = collection.filter(activityLastsOnDate(date));
		const intersections = calculateActivitiesIntersectionsForDate(itemsForDay, date);

		return itemsForDay.map((item) => {
			const { startOffset, start, end, position, columns } = intersections[item.get('id')];

			return item.set(
				'position',
				Immutable.Map({
					topOffset: (startOffset / 60) * HEIGHT_OF_HOUR,
					top: (start / 60) * HEIGHT_OF_HOUR + HEIGHT_OF_HOUR / 2,
					left: (100 * position) / columns,
					width: 100 / columns,
					height: Math.floor(((end - start) / 60) * HEIGHT_OF_HOUR),
				}),
			);
		});
	});
};
