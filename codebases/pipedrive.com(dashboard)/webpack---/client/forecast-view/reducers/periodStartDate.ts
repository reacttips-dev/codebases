import { PeriodStartDateActionTypes, SetPeriodStartDateAction } from '../actions/periodStartDate';
import { getIntervalStartDate } from '../../utils/getPeriods';

const periodStartDate = (state: string = getIntervalStartDate(), action: SetPeriodStartDateAction) => {
	if (action.type === PeriodStartDateActionTypes.SET_PERIOD_START_DATE_ACTION) {
		return action.payload;
	}

	return state;
};

export default periodStartDate;
