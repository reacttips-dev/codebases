import moment from 'moment';
import { fromJS } from 'immutable';
import { UTC_DATETIME_FORMAT } from '../../../config/constants';

export const initialState = fromJS({
	daysNumber: 7,
	startDate: moment().startOf('week').format(UTC_DATETIME_FORMAT),
	endDate: moment().endOf('week').format(UTC_DATETIME_FORMAT),
});

export default (state = initialState, action = { type: 'INIT' }) => {
	if (action.type === 'UPDATE_DATES') {
		const { startDate, endDate, daysNumber } = action;

		return state.withMutations((mutatingState) => {
			mutatingState
				.set('daysNumber', daysNumber)
				.set('startDate', startDate)
				.set('endDate', endDate);
		});
	}

	return state;
};
