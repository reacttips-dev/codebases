import moment from 'moment';
import { FORMAT_24H, UTC_DATE_FORMAT, DEFAULT_LOCALE } from '../../../../config/constants';
import {
	formatDuration,
	calculateUtcMoment,
	calculateTimeDiff,
	calculateDuration,
} from '../../../../utils/date';

const getDueDateLocal = (dueDate, dueTime) => {
	if (!dueDate) {
		return moment();
	}

	if (!dueTime) {
		return moment(dueDate);
	}

	return moment.utc(`${dueDate} ${dueTime}`).local();
};

const roundDays = (durationAsDays) => {
	return durationAsDays >= 1 && durationAsDays === Math.ceil(durationAsDays);
};

const calculateLocalEndDate = (dueDate, dueTime, duration) => {
	const dueDateLocal = getDueDateLocal(dueDate, dueTime);
	const result = { hasTime: false, value: dueDateLocal };

	if (!duration) {
		return result;
	}

	duration = moment.duration(duration);
	result.value.add(duration);

	if (dueTime) {
		return { ...result, hasTime: true };
	}

	const durationAsDays = duration.asDays();

	// if duration is less than a day with no due_time, consider activity as all day with same start and end date.
	if (durationAsDays < 1) {
		return result;
	}

	// if duration in round days (24h, 48h) then we subtract 1 day
	// e.g. 48 hours is 2 days but the endDate is 1 day from the startDate
	if (roundDays(durationAsDays)) {
		result.value.startOf('day').subtract(1, 'day');
	}

	// if durationInDays is not integer in all-day activities
	// it means we have DST-transition in the middle of activity.
	// Eg 24-26 Oct duration in Estonia is 73 hours, not 72 -> 3.04 days.
	if (
		!roundDays(durationAsDays) &&
		!result.hasTime &&
		Math.round(durationAsDays) === Math.floor(durationAsDays)
	) {
		result.value.startOf('day').subtract(1, 'day');
	}

	return result;
};

const convertPropsToState = (props) => {
	const { dueDate, dueTime, duration } = props;
	const dueDateLocal = getDueDateLocal(dueDate, dueTime);
	const { hasTime: hasEndTime, value: endDate } = calculateLocalEndDate(
		dueDate,
		dueTime,
		duration,
	);

	return {
		startDate: dueDateLocal.format(UTC_DATE_FORMAT),
		startTime: dueTime ? dueDateLocal.format(FORMAT_24H) : '',
		endDate: endDate.format(UTC_DATE_FORMAT),
		endTime: hasEndTime ? endDate.format(FORMAT_24H) : '',
	};
};

const isInValidDateTimeSpanEnd = ({ startDate, startTime, endDate, endTime }) => {
	// when there is start time and no end time, end date should be same
	return startTime && !endTime && endDate !== startDate;
};

const datesModifiers = {
	startDate: (newStartDate, { startDate, startTime, endDate, endTime }, errors = []) => {
		const newStartDateMoment = calculateUtcMoment(newStartDate, startTime);
		const startDateMoment = calculateUtcMoment(startDate, startTime);
		const diff = newStartDateMoment.diff(startDateMoment);
		const endDateMoment = calculateUtcMoment(endDate, endTime);
		const newEndDateMoment = endDateMoment.clone().add(diff);
		const duration = errors.length
			? null
			: calculateDuration({
					endDateMoment: newEndDateMoment,
					startDateMoment: newStartDateMoment,
					hasTime: endTime,
			  });

		return {
			isPossible: true,
			fields: {
				dueDate: newStartDateMoment.locale(DEFAULT_LOCALE).format(UTC_DATE_FORMAT),
				dueTime: startTime
					? newStartDateMoment.locale(DEFAULT_LOCALE).format(FORMAT_24H)
					: null,
				duration: duration ? formatDuration(duration) : null,
			},
		};
	},
	startTime: (newStartTime, { startDate, startTime, endDate, endTime }, errors = []) => {
		const newStartDateMoment = calculateUtcMoment(startDate, newStartTime);
		const newDueTime = newStartTime
			? newStartDateMoment.locale(DEFAULT_LOCALE).format(FORMAT_24H)
			: null;
		const hasWrongStartTime = errors.indexOf('startTime') !== -1;
		const timesDiff = calculateTimeDiff(newStartTime, endTime);

		if (hasWrongStartTime) {
			return timesDiff <= 0
				? {
						isPossible: false,
				  }
				: {
						isPossible: true,
						fields: {
							dueDate: newStartDateMoment.format(UTC_DATE_FORMAT),
							dueTime: newDueTime,
							duration: formatDuration(timesDiff),
						},
				  };
		}

		const startDateMoment = calculateUtcMoment(startDate, startTime);
		const shift = newStartDateMoment.diff(startDateMoment);
		const newEndDateMoment = calculateUtcMoment(endDate, endTime).add(shift);
		const duration = errors.length
			? null
			: calculateDuration({
					endDateMoment: newEndDateMoment,
					startDateMoment: newStartDateMoment,
					hasTime: endTime && newStartTime,
					isSameDay: startDate === endDate,
			  });

		return {
			isPossible: true,
			fields: {
				dueDate: newStartDateMoment.locale(DEFAULT_LOCALE).format(UTC_DATE_FORMAT),
				dueTime: newDueTime,
				duration: duration ? formatDuration(duration) : null,
			},
		};
	},
	endDate: (newEndDate, { startDate, startTime, endTime }) => {
		// when end date is before start date, its an error in any cases
		if (moment(newEndDate).isBefore(moment(startDate))) {
			return {
				isPossible: false,
				errorFields: ['endDate'],
			};
		}

		if (isInValidDateTimeSpanEnd({ startDate, startTime, endDate: newEndDate, endTime })) {
			return {
				isPossible: false,
				clearErrors: true,
				errorFields: ['endTime'],
			};
		}

		const newEndDateMoment = calculateUtcMoment(newEndDate, endTime);
		const startDateMoment = calculateUtcMoment(startDate, startTime);

		// cases when endDate + endTime turned to be before startDate + startTime
		if (endTime && newEndDateMoment.isBefore(startDateMoment)) {
			return {
				isPossible: false,
				clearErrors: true,
				errorFields: ['endTime'],
			};
		}

		const duration = calculateDuration({
			endDateMoment: newEndDateMoment,
			startDateMoment,
			hasTime: endTime,
		});

		return {
			isPossible: true,
			fields: {
				dueDate: startDateMoment.locale(DEFAULT_LOCALE).format(UTC_DATE_FORMAT),
				dueTime: startTime
					? startDateMoment.locale(DEFAULT_LOCALE).format(FORMAT_24H)
					: null,
				duration: duration ? formatDuration(duration) : null,
			},
		};
	},
	endTime: (newEndTime, { startDate, startTime, endDate }) => {
		// in any scenario when startTime is not picked, endTime should not be picked
		if (newEndTime && !startTime) {
			return {
				isPossible: false,
				errorFields: ['startTime'],
			};
		}

		if (isInValidDateTimeSpanEnd({ startDate, startTime, endDate, endTime: newEndTime })) {
			return {
				isPossible: false,
				errorFields: ['endTime', 'endDate'],
			};
		}

		const startDateMoment = calculateUtcMoment(startDate, startTime);
		const newEndDateMoment = calculateUtcMoment(endDate, newEndTime);
		const newEndDateAlteredMoment = calculateUtcMoment(endDate, newEndTime || startTime);

		if (newEndDateAlteredMoment.isBefore(startDateMoment)) {
			return {
				isPossible: false,
				errorFields: ['endTime'],
			};
		}

		const duration = calculateDuration({
			endDateMoment: newEndDateMoment,
			startDateMoment,
			hasTime: newEndTime,
			isSameDay: newEndDateAlteredMoment
				.clone()
				.local()
				.isSame(startDateMoment.clone().local()),
		});

		return {
			isPossible: true,
			fields: {
				dueDate: startDateMoment.locale(DEFAULT_LOCALE).format(UTC_DATE_FORMAT),
				dueTime: startTime
					? startDateMoment.locale(DEFAULT_LOCALE).format(FORMAT_24H)
					: null,
				duration: duration ? formatDuration(duration) : null,
			},
		};
	},
};

export { convertPropsToState, datesModifiers };
