import { Action, bindActionCreators } from 'redux';
import { ThunkAction } from 'redux-thunk';
import _ from 'lodash';

import { fetchDeals, resetLoadedDealsCount } from './deals';
import { fetchAllStatistics } from './summary';
import {
	SetFocusedStageAction,
	setPipelineCreateMode,
	setPipelineEditMode,
	SetPipelineEditModeAction,
	SetPipelineEditModeDataAction,
} from './edit';
import { changeUrl } from '../shared/api/webapp';
import { setDealTileSize } from '../actions/view';
import { getPipelineById } from '../selectors/pipelines';
import saveUserSettings from '../utils/settings/saveUserSettings';
import { EditPathStrings, ViewTypes } from '../utils/constants';
import { AddSnackbarMessageAction } from '../components/SnackbarMessage/actions';
import { fetchDeals as fetchForecastDeals } from '../forecast-view/actions/deals';
import { fetchUnlistedDealsList, fetchUnlistedDealsListSummary } from '../forecast-view/actions/unlistedDealsList';
import { createUrlFromState } from '../forecast-view/utils/url';

type StoreStateType = PipelineState | ForecastState;

export enum PipelineActionTypes {
	SET_SELECTED_PIPELINE_ID = 'SET_SELECTED_PIPELINE_ID',
}

export interface SetSelectedPipelineId extends Action<PipelineActionTypes.SET_SELECTED_PIPELINE_ID> {
	payload: number;
}

export type PipelineActions = SetSelectedPipelineId;

export const setSelectedPipeline =
	(pipelineId: number, viewType: ViewTypes): ThunkAction<void, StoreStateType, null, SetSelectedPipelineId> =>
	(dispatch, getState) => {
		const actions = bindActionCreators(
			{
				fetchDeals,
				fetchAllStatistics,
				setDealTileSize,
				resetLoadedDealsCount,
				fetchForecastDeals,
				fetchUnlistedDealsList,
				fetchUnlistedDealsListSummary,
			},
			dispatch,
		);
		const state = getState();

		actions.resetLoadedDealsCount();

		dispatch({
			type: PipelineActionTypes.SET_SELECTED_PIPELINE_ID,
			payload: pipelineId,
		});

		if (viewType === ViewTypes.FORECAST) {
			const updatedState = Object.assign({}, { ...state, selectedPipelineId: pipelineId }) as ForecastState;

			actions.fetchForecastDeals();
			actions.fetchUnlistedDealsList();
			actions.fetchUnlistedDealsListSummary();
			createUrlFromState(updatedState);
		} else {
			saveUserSettings('current_pipeline_id', pipelineId);
			changeUrl(pipelineId);

			actions.fetchDeals();
			actions.fetchAllStatistics({ includeGoals: true });
		}

		actions.setDealTileSize();
	};

export const setSelectedViewerPipeline =
	(pipelineId: number): ThunkAction<void, PipelineState, null, SetSelectedPipelineId> =>
	(dispatch) => {
		dispatch({
			type: PipelineActionTypes.SET_SELECTED_PIPELINE_ID,
			payload: pipelineId,
		});
	};

export const routePipelineView =
	(
		translator,
	): ThunkAction<
		void,
		PipelineState,
		null,
		| SetSelectedPipelineId
		| SetPipelineEditModeAction
		| SetPipelineEditModeDataAction
		| SetFocusedStageAction
		| AddSnackbarMessageAction
	> =>
	(dispatch, getState) => {
		const actions = bindActionCreators(
			{ setSelectedPipeline, setPipelineEditMode, setPipelineCreateMode },
			dispatch,
		);

		const path = location.pathname.substr(10);
		const state = getState();
		const pathParts = _.split(path, '/');
		const pipelineIdString = pathParts[0];
		const pipelineId = Number(pipelineIdString);
		const editMode = pathParts[1];

		if (pipelineId && Number.isInteger(pipelineId)) {
			if (state.selectedPipelineId !== pipelineId) {
				actions.setSelectedPipeline(pipelineId, ViewTypes.PIPELINE);
			}

			if (editMode === EditPathStrings.EDIT) {
				const pipeline = getPipelineById(state, pipelineId);

				actions.setPipelineEditMode(pipeline);
			} else if (editMode === EditPathStrings.CREATE) {
				actions.setPipelineCreateMode(translator);
			}
		}
	};
