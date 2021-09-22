import { ViewAction, ViewState, ViewActionTypes } from './types';
import getFilteredStateHotkeys from '../../../utils/getFilteredStateHotkeys';

const initialState: ViewState = {
	options: null,
	hotkeys: [],
	visible: false,
	mounted: false,
	hash: null,
};

export function contextualViewReducer(state = initialState, action: ViewActionTypes): ViewState {
	switch (action.type) {
		case ViewAction.OPEN_DRAWER:
			return {
				...state,
				visible: true,
				mounted: true,
				hash: Math.random(),
				options: action.options,
			};
		case ViewAction.CLOSE_DRAWER:
			return { ...state, visible: false };
		case ViewAction.UNMOUNT_DRAWER:
			return { ...state, mounted: false };
		case ViewAction.ADD_HOTKEYS:
			return {
				...state,
				hotkeys: [...state.hotkeys, { hotkeys: action.hotkeys, callback: action.callback }],
			};
		case ViewAction.REMOVE_HOTKEYS:
			return { ...state, hotkeys: getFilteredStateHotkeys(state, action) };
		default:
			return state;
	}
}
