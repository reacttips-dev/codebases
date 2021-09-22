import { Action, bindActionCreators } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { fetchDeals } from './deals';
import { setPeriodStartDate } from './periodStartDate';
import { createUrlFromState } from '../utils/url';
import { getIntervalStartDate } from '../../utils/getPeriods';
import saveUserSettings from '../../utils/settings/saveUserSettings';
import { getForecastSettingsChangedMetrics } from '../utils/metrics';
import { getPdMetrics } from '../../shared/api/webapp';

export type ArrangeByOptions = 'won' | 'open';
export type ChangeIntervalOptions = 'month' | 'quarter' | 'week';

export enum SettingsActionTypes {
	SET_SHOW_BY_ACTION = 'SET_SHOW_BY_ACTION',
	SET_ARRANGE_BY_OPTION = 'SET_ARRANGE_BY_OPTION',
	SET_CHANGE_INTERVAL_OPTION = 'SET_CHANGE_INTERVAL_OPTION',
	SET_NUMBER_OF_COLUMNS_OPTION = 'SET_NUMBER_OF_COLUMNS_OPTION',
}

export interface SetShowByAction extends Action<SettingsActionTypes.SET_SHOW_BY_ACTION> {
	payload: string;
}

export interface SetArrangeByAction extends Action<SettingsActionTypes.SET_ARRANGE_BY_OPTION> {
	payload: ArrangeByOptions;
}

export interface SetChangeIntervalAction extends Action<SettingsActionTypes.SET_CHANGE_INTERVAL_OPTION> {
	payload: ChangeIntervalOptions;
}

export interface SetNumberOfColumnsAction extends Action<SettingsActionTypes.SET_NUMBER_OF_COLUMNS_OPTION> {
	payload: number;
}

export type SettingsActions = SetShowByAction | SetArrangeByAction;

export const setShowBy =
	(showByOption: string): ThunkAction<void, ForecastState, null, SetShowByAction> =>
	(dispatch, getState) => {
		const actions = bindActionCreators({ fetchDeals }, dispatch);
		const trackingData = getForecastSettingsChangedMetrics(getState(), 'show', showByOption);

		dispatch({
			type: SettingsActionTypes.SET_SHOW_BY_ACTION,
			payload: showByOption,
		});

		saveUserSettings('deals_timeline_default_field', showByOption);
		createUrlFromState(getState());

		actions.fetchDeals();

		getPdMetrics().trackUsage(null, 'deal_forecast_view_settings', 'changed', trackingData);
	};

export const setArrangeBy =
	(arrangeByOption: ArrangeByOptions): ThunkAction<void, ForecastState, null, SetArrangeByAction> =>
	(dispatch, getState) => {
		const actions = bindActionCreators({ fetchDeals }, dispatch);
		const trackingData = getForecastSettingsChangedMetrics(getState(), 'arrange', arrangeByOption);

		dispatch({
			type: SettingsActionTypes.SET_ARRANGE_BY_OPTION,
			payload: arrangeByOption,
		});

		saveUserSettings('deals_timeline_arrange_by', arrangeByOption);
		createUrlFromState(getState());

		actions.fetchDeals();
		getPdMetrics().trackUsage(null, 'deal_forecast_view_settings', 'changed', trackingData);
	};

export const setChangeInterval =
	(changeIntervalOption: ChangeIntervalOptions): ThunkAction<void, ForecastState, null, SetChangeIntervalAction> =>
	(dispatch, getState) => {
		const actions = bindActionCreators({ setPeriodStartDate, fetchDeals }, dispatch);
		const currentStartDate = getIntervalStartDate(changeIntervalOption);
		const trackingData = getForecastSettingsChangedMetrics(getState(), 'interval', changeIntervalOption);

		actions.setPeriodStartDate(currentStartDate);

		dispatch({
			type: SettingsActionTypes.SET_CHANGE_INTERVAL_OPTION,
			payload: changeIntervalOption,
		});

		saveUserSettings('deals_timeline_interval', changeIntervalOption);
		createUrlFromState(getState());

		actions.fetchDeals();
		getPdMetrics().trackUsage(null, 'deal_forecast_view_settings', 'changed', trackingData);
	};

export const setNumberOfColumns =
	(numberOfColumnsOption: number): ThunkAction<void, ForecastState, null, SetNumberOfColumnsAction> =>
	(dispatch, getState) => {
		const actions = bindActionCreators({ fetchDeals }, dispatch);
		const trackingData = getForecastSettingsChangedMetrics(getState(), 'columns', numberOfColumnsOption);

		dispatch({
			type: SettingsActionTypes.SET_NUMBER_OF_COLUMNS_OPTION,
			payload: numberOfColumnsOption,
		});

		saveUserSettings('deals_timeline_column_count', numberOfColumnsOption);
		createUrlFromState(getState());

		actions.fetchDeals();
		getPdMetrics().trackUsage(null, 'deal_forecast_view_settings', 'changed', trackingData);
	};
