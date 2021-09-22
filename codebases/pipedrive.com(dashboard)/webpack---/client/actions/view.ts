import { Action } from 'redux';
import { DealTileSizes } from '../utils/constants';
import { ThunkAction } from 'redux-thunk';
import { getPipelineViewOpenedMetrics } from '../utils/metrics';
import { getPdMetrics } from '../shared/api/webapp';

export enum ViewActionTypes {
	SET_IS_ACTIVE = 'SET_IS_ACTIVE',
	SET_DEAL_TILE_SIZE = 'SET_DEAL_TILE_SIZE',
	SET_VIEWER = 'SET_VIEWER',
	SET_VIEWER_UPSELLING = 'SET_VIEWER_UPSELLING',
}

export interface SetViewActiveAction extends Action<ViewActionTypes.SET_IS_ACTIVE> {
	payload: boolean;
}

export interface SetViewerAction extends Action<ViewActionTypes.SET_VIEWER | ViewActionTypes.SET_VIEWER_UPSELLING> {
	payload: boolean;
}

export interface SetDealTileSizeAction extends Action<ViewActionTypes.SET_DEAL_TILE_SIZE> {
	size?: DealTileSizes;
}

export type ViewActions = SetViewActiveAction | SetDealTileSizeAction;

export const setIsActive = (isActive: boolean): SetViewActiveAction => ({
	type: ViewActionTypes.SET_IS_ACTIVE,
	payload: isActive,
});

export const setViewer = (): SetViewerAction => ({
	type: ViewActionTypes.SET_VIEWER,
	payload: true,
});

export const setViewerUpselling = (): SetViewerAction => ({
	type: ViewActionTypes.SET_VIEWER_UPSELLING,
	payload: true,
});

const getStageWidth = (pipelines: Pipedrive.Pipelines, selectedPipelineId?: number) => {
	if (!selectedPipelineId) {
		return null;
	}
	const PIPEDRIVE_MIN_WIDTH = 1000;
	const stagesLength = pipelines[selectedPipelineId].stage_ids.length;

	return Math.max(window.innerWidth, PIPEDRIVE_MIN_WIDTH) / stagesLength;
};

export const setDealTileSize =
	(): ThunkAction<void, PipelineState, null, SetDealTileSizeAction> => (dispatch, getState) => {
		const { selectedPipelineId, pipelines, view } = getState();
		const stageWidth = getStageWidth(pipelines, selectedPipelineId);

		const CARD_REGULAR = 186;
		const CARD_EXTRA_SMALL = 138;

		let dealCardSize;

		if (stageWidth < CARD_REGULAR && stageWidth >= CARD_EXTRA_SMALL) {
			dealCardSize = DealTileSizes.SMALL;
		} else if (stageWidth < CARD_EXTRA_SMALL) {
			dealCardSize = DealTileSizes.EXTRA_SMALL;
		} else {
			dealCardSize = DealTileSizes.REGULAR;
		}

		if (view.dealTileSize !== dealCardSize) {
			return dispatch({
				type: ViewActionTypes.SET_DEAL_TILE_SIZE,
				size: dealCardSize,
			});
		}
	};

export const waitUntilDealsHaveLoadedAndTrackViewOpened =
	(): ThunkAction<void, PipelineState, null, null> => (dispatch, getState) => {
		const state = getState();

		if (state.deals.isLoading) {
			setTimeout(() => dispatch(waitUntilDealsHaveLoadedAndTrackViewOpened()), 1000);
		} else {
			dispatch(trackViewOpened());
		}
	};

export const trackViewOpened = (): ThunkAction<void, PipelineState, null, null> => (dispatch, getState) => {
	const state = getState();
	const attributes = getPipelineViewOpenedMetrics(state);

	getPdMetrics().trackUsage(null, 'pipeline_view', 'opened', attributes);
};
