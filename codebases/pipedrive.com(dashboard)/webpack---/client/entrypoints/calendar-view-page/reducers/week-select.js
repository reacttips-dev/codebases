import moment from 'moment';
import { fromJS } from 'immutable';
import { UTC_DATETIME_FORMAT } from '../../../config/constants';

export const initialState = fromJS({
	periodInDays: 7,
	startDate: moment().startOf('week').format(UTC_DATETIME_FORMAT),
	endDate: moment().endOf('week').format(UTC_DATETIME_FORMAT),
});

export default (state = initialState, action = { type: 'INIT' }) => {
	if (action.type === 'WEEK_SELECT_UPDATE') {
		const { startDate, endDate, periodInDays } = action;

		return state.withMutations((mutatingState) => {
			mutatingState
				.set('periodInDays', periodInDays)
				.set('startDate', startDate)
				.set('endDate', endDate);
		});
	}

	return state;
};
