import moment from 'moment';
import { getCalendarDays } from '../../../utils/date';
import { UTC_DATE_FORMAT } from '../../../config/constants';

const updateDates = ({ startDate, endDate, periodInDays }) => ({
	type: 'WEEK_SELECT_UPDATE',
	startDate,
	endDate,
	periodInDays,
});

export function shiftWeek(shift) {
	return async (dispatch, getState) => {
		const state = getState();
		const currentStartDate = state.getIn(['weekSelect', 'startDate']);
		const newStartDate = moment(currentStartDate).add(shift, 'weeks');

		dispatch(changeWeek(newStartDate));
	};
}

export function changeWeek(date) {
	return async (dispatch, getState) => {
		const state = getState();
		const periodInDays = state.getIn(['weekSelect', 'periodInDays']);
		const { startDate, endDate } = getCalendarDays(
			periodInDays,
			moment(date || moment()).startOf('week'),
		);

		dispatch(
			updateDates({
				startDate: startDate.format(UTC_DATE_FORMAT),
				endDate: endDate.format(UTC_DATE_FORMAT),
				periodInDays,
			}),
		);
	};
}
