import _ from 'lodash';
import { Action, bindActionCreators } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { fetchDeals, resetLoadedDealsCount } from './deals';
import { fetchAllStatistics } from './summary';
import { changeUrl, getUserSetting } from '../shared/api/webapp';
import { getSelectedPipelineId } from '../selectors/pipelines';
import { getSelectedFilter } from '../selectors/filters';
import saveUserSettings from '../utils/settings/saveUserSettings';
import { ViewTypes } from '../utils/constants';
import { fetchDeals as fetchForecastDeals } from '../forecast-view/actions/deals';
import { fetchUnlistedDealsList, fetchUnlistedDealsListSummary } from '../forecast-view/actions/unlistedDealsList';
import { createUrlFromState } from '../forecast-view/utils/url';

type StoreStateType = PipelineState | ForecastState;

export enum FilterActionTypes {
	ADD_FILTER = 'ADD_FILTER',
	REMOVE_FILTER = 'REMOVE_FILTER',
	UPDATE_FILTER = 'UPDATE_FILTER',
	SET_SELECTED_FILTER = 'SET_SELECTED_FILTER',
}

export interface AddFilterAction extends Action<FilterActionTypes.ADD_FILTER> {
	payload?: Pipedrive.Filter;
}

export interface SetSelectedFilterAction extends Action<FilterActionTypes.SET_SELECTED_FILTER> {
	payload?: Pipedrive.SelectedFilter;
}

export interface SetTemporarySelectedFilterAction extends Action<FilterActionTypes.SET_SELECTED_FILTER> {
	payload?: Pipedrive.SelectedFilter;
}

export interface RemoveFilterAction extends Action<FilterActionTypes.REMOVE_FILTER> {
	payload?: number;
}

export interface UpdateFilterAction extends Action<FilterActionTypes.UPDATE_FILTER> {
	payload?: Pipedrive.Filter;
}

export type FilterActions =
	| SetSelectedFilterAction
	| SetTemporarySelectedFilterAction
	| RemoveFilterAction
	| UpdateFilterAction
	| AddFilterAction;

export type FiltersActionsType = {
	setSelectedFilter: typeof setSelectedFilter;
	removeFilter: typeof removeFilter;
	addFilter: typeof addFilter;
	updateFilter: typeof updateFilter;
	setTemporarySelectedFilter: typeof setTemporarySelectedFilter;
};

export const setSelectedFilterOnListen =
	(pipelineFilterKey: string, viewType: ViewTypes): ThunkAction<void, PipelineState, null, SetSelectedFilterAction> =>
	(dispatch, getState) => {
		const state = getState();
		const selectedPipelineId = getSelectedPipelineId(state);
		const selectedFilter = getSelectedFilter(state);
		const pipelineId = parseInt(pipelineFilterKey.split('_').pop(), 10);

		// Seems that currently, we do not keep the pipelines in sync with eachother. If the pipelines are
		// different then we do not do anything.
		if (pipelineId !== selectedPipelineId) {
			return;
		}

		const [filterType, filterValue] = getUserSetting<string>(pipelineFilterKey).split('_');
		const newFilter = (
			filterType === 'all' || filterValue === 'everyone'
				? {
						type: 'user',
						value: 'everyone',
				  }
				: {
						type: filterType,
						value: Number(filterValue),
				  }
		) as Pipedrive.SelectedFilter;

		// For some reason, it is sometimes returned as NaN.
		if (_.isNaN(newFilter.value)) {
			return;
		}

		if (newFilter.type === selectedFilter.type && newFilter.value === selectedFilter.value) {
			return;
		}

		dispatch(setSelectedFilter(newFilter, viewType, true));
	};

export const setSelectedFilter =
	(
		filter: Pipedrive.SelectedFilter,
		viewType?: ViewTypes,
		onListen = false,
	): ThunkAction<void, StoreStateType, null, SetSelectedFilterAction> =>
	(dispatch, getState) => {
		const actions = bindActionCreators(
			{
				fetchDeals,
				fetchAllStatistics,
				resetLoadedDealsCount,
				fetchForecastDeals,
				fetchUnlistedDealsList,
				fetchUnlistedDealsListSummary,
			},
			dispatch,
		);
		const state = getState();
		const selectedPipelineId = getSelectedPipelineId(state);
		const filterUserSettingsKey = `filter_pipeline_${selectedPipelineId}`;

		actions.resetLoadedDealsCount();
		dispatch({
			type: FilterActionTypes.SET_SELECTED_FILTER,
			payload: filter,
		});

		if (viewType === ViewTypes.FORECAST) {
			const updatedState = Object.assign({}, { ...state, selectedFilter: filter }) as ForecastState;

			actions.fetchForecastDeals();
			actions.fetchUnlistedDealsList();
			actions.fetchUnlistedDealsListSummary();
			!onListen && createUrlFromState(updatedState);
		} else {
			actions.fetchDeals();
			actions.fetchAllStatistics({ includeGoals: true });

			!onListen && changeUrl(selectedPipelineId, filter.type, filter.value);
		}

		const filterUserSettingsValue = filter.value === 'everyone' ? 'all_users' : `${filter.type}_${filter.value}`;

		saveUserSettings(filterUserSettingsKey, filterUserSettingsValue);

		// Keep forecast view filter in sync in case it has the same filter active
		app.global.fire('deals.pipeline.filter.changed', filterUserSettingsKey);
	};

// Setting temporary filter is for when user previews a filter. Then we do not need to do things like
// saving to user settings, changing the url, keeping forecast view in sync...
export const setTemporarySelectedFilter =
	(
		filter: Pipedrive.SelectedFilter,
		viewType: ViewTypes,
	): ThunkAction<void, PipelineState, null, SetTemporarySelectedFilterAction> =>
	(dispatch) => {
		const actions = bindActionCreators(
			{ fetchDeals, fetchAllStatistics, resetLoadedDealsCount, fetchForecastDeals },
			dispatch,
		);

		dispatch({
			type: FilterActionTypes.SET_SELECTED_FILTER,
			payload: filter,
		});

		actions.resetLoadedDealsCount();

		if (viewType === ViewTypes.FORECAST) {
			actions.fetchForecastDeals();
		} else {
			actions.fetchDeals();
			actions.fetchAllStatistics({ includeGoals: true });
		}
	};

export const addFilter = (filter: Pipedrive.Filter): AddFilterAction => ({
	type: FilterActionTypes.ADD_FILTER,
	payload: filter,
});

export const removeFilter = (filterId: number): RemoveFilterAction => ({
	type: FilterActionTypes.REMOVE_FILTER,
	payload: filterId,
});

export const updateFilter = (filter: Pipedrive.Filter): UpdateFilterAction => ({
	type: FilterActionTypes.UPDATE_FILTER,
	payload: filter,
});
