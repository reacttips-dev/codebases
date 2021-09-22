import { combineReducers } from 'redux';
import { SetViewActiveAction, SetDealTileSizeAction, SetViewerAction, ViewActionTypes } from '../actions/view';

const isActive = (state = true, action: SetViewActiveAction) => {
	if (action.type === ViewActionTypes.SET_IS_ACTIVE) {
		return action.payload;
	}

	return state;
};

const dealTileSize = (state = 'regular', action: SetDealTileSizeAction) => {
	if (action.type === ViewActionTypes.SET_DEAL_TILE_SIZE) {
		return action.size;
	}

	return state;
};

const isViewer = (state = false, action: SetViewerAction) => {
	if (action.type === ViewActionTypes.SET_VIEWER) {
		return action.payload;
	}

	return state;
};

const isUpsellingSent = (state = false, action: SetViewerAction) => {
	if (action.type === ViewActionTypes.SET_VIEWER_UPSELLING) {
		return action.payload;
	}

	return state;
};

export default combineReducers({
	isActive,
	dealTileSize,
	isViewer,
	isUpsellingSent,
});
