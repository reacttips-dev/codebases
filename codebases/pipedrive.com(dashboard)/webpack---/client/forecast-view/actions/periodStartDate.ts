import { ThunkAction } from 'redux-thunk';
import { createUrlFromState } from '../utils/url';
import { Action } from 'redux';

export enum PeriodStartDateActionTypes {
	SET_PERIOD_START_DATE_ACTION = 'SET_PERIOD_START_DATE_ACTION',
}

export interface SetPeriodStartDateAction extends Action<PeriodStartDateActionTypes.SET_PERIOD_START_DATE_ACTION> {
	payload: string;
}

export const setPeriodStartDate =
	(periodStartDate: string): ThunkAction<void, ForecastState, null, SetPeriodStartDateAction> =>
	(dispatch, getState) => {
		dispatch({
			type: PeriodStartDateActionTypes.SET_PERIOD_START_DATE_ACTION,
			payload: periodStartDate,
		});

		createUrlFromState(getState());
	};
