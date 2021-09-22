import { NavigationState, NavigationActionTypes, NavigationAction } from './types';
import { MenuState } from '../../components/menu';
import getFilteredStateHotkeys from '../../utils/getFilteredStateHotkeys';

export const initialState: NavigationState = {
	items: null,
	rootUrl: '/',
	activeItem: null,
	accountVisible: false,
	hasRegisteredAllExternals: false,
	viewLoading: true,
	showSecondaryMenuCoachmarks: true,
	services: [],
	menuState: {},
	hiddenPaths: [],
	hotkeys: [],
	redirects: [],
	viewSelects: [],
	blacklist: { paths: [], rules: {}, currentRule: {} },
	blacklistedUI: {},
};

// eslint-disable-next-line complexity
export default function navigationReducer(state = initialState, action: NavigationActionTypes): NavigationState {
	switch (action.type) {
		case NavigationAction.UPDATE_ITEMS:
			return {
				...state,
				items: { ...state.items, ...action.items },
			};
		case NavigationAction.ITEM_SELECTED:
			return { ...state, activeItem: action.item };
		case NavigationAction.REGISTERED_ALL_EXTERNALS:
			return { ...state, hasRegisteredAllExternals: true };
		case NavigationAction.SET_MENU_STATE:
			return {
				...state,
				menuState: action.menuState,
			};
		case NavigationAction.PINNED_TOGGLE:
			return {
				...state,
				menuState: {
					...state.menuState,
					[action.key]:
						state.menuState[action.key] === MenuState.PINNED ? MenuState.HIDDEN : MenuState.PINNED,
				},
			};
		case NavigationAction.MORE_TOGGLE:
			return { ...state, moreVisible: action.visible ?? !state.moreVisible };
		case NavigationAction.ACCOUNT_TOGGLE:
			return { ...state, accountVisible: action.visible ?? !state.accountVisible };
		case NavigationAction.QUICK_ADD_TOGGLE:
			return { ...state, quickAddVisible: action.visible ?? !state.quickAddVisible };
		case NavigationAction.SET_VIEW_LOADING:
			return { ...state, viewLoading: action.isLoading };
		case NavigationAction.SHOW_SECONDARY_MENU_COACH_MARKS:
			return { ...state, showSecondaryMenuCoachmarks: action.showCoachmarks };
		case NavigationAction.ADD_HOTKEYS:
			return {
				...state,
				hotkeys: [...state.hotkeys, { hotkeys: action.hotkeys, callback: action.callback }],
			};
		case NavigationAction.REMOVE_HOTKEYS:
			return { ...state, hotkeys: getFilteredStateHotkeys(state, action) };
		case NavigationAction.UPDATE_BLACKLISTED_UI:
			return {
				...state,
				blacklistedUI: action.ui,
			};
		case NavigationAction.UPDATE_BLACKLIST_CURRENT_RULE:
			return {
				...state,
				blacklist: {
					...state.blacklist,
					currentRule: action.currentRule,
				},
			};
		default:
			return state;
	}
}
