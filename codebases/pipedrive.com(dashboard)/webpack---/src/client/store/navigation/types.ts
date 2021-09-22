import { Menus, MenuLink, MenuStateLocal, Service } from '../../components/menu';
import { Keys, Callback, StoredHotkeys } from '../../hooks/useHotkeys';
import { Redirect } from 'src/client/components/navigation/types';
import { ViewSelectDefinition } from 'src/client/components/ViewSelect';

export enum NavigationAction {
	UPDATE_ITEMS = 'UPDATE_ITEMS',
	ITEM_SELECTED = 'ITEM_SELECTED',
	REGISTERED_ALL_EXTERNALS = 'REGISTERED_ALL_EXTERNALS',
	PINNED_TOGGLE = 'PINNED_TOGGLE',
	MORE_TOGGLE = 'MORE_TOGGLE',
	ACCOUNT_TOGGLE = 'ACCOUNT_TOGGLE',
	QUICK_ADD_TOGGLE = 'QUICK_ADD_TOGGLE',
	SET_VIEW_LOADING = 'SET_VIEW_LOADING',
	SHOW_SECONDARY_MENU_COACH_MARKS = 'SHOW_SECONDARY_MENU_COACH_MARKS',
	SET_MENU_STATE = 'SET_MENU_STATE',
	ADD_HOTKEYS = 'ADD_HOTKEYS',
	REMOVE_HOTKEYS = 'REMOVE_HOTKEYS',
	UPDATE_BLACKLISTED_UI = 'UPDATE_BLACKLISTED_UI',
	UPDATE_BLACKLIST_CURRENT_RULE = 'UPDATE_BLACKLIST_CURRENT_RULE',
}

interface UpdateItems {
	type: NavigationAction.UPDATE_ITEMS;
	items: { [key: string]: MenuLink[] };
}

interface ItemAction {
	type: NavigationAction.ITEM_SELECTED;
	item?: MenuLink;
}

interface PinnedAction {
	type: NavigationAction.PINNED_TOGGLE;
	key?: string;
}

interface MoreAction {
	type: NavigationAction.MORE_TOGGLE;
	visible?: boolean;
}

interface SetMenuState {
	type: NavigationAction.SET_MENU_STATE;
	menuState: MenuStateLocal;
}

interface RegisteredAllExternals {
	type: NavigationAction.REGISTERED_ALL_EXTERNALS;
}

interface AccountAction {
	type: NavigationAction.ACCOUNT_TOGGLE;
	visible?: boolean;
}

interface QuickAddAction {
	type: NavigationAction.QUICK_ADD_TOGGLE;
	visible?: boolean;
}

interface ViewLoadingAction {
	type: NavigationAction.SET_VIEW_LOADING;
	isLoading: boolean;
}

interface SecondaryMenuCoachmarksAction {
	type: NavigationAction.SHOW_SECONDARY_MENU_COACH_MARKS;
	showCoachmarks: boolean;
}

interface AddHotkeys {
	type: NavigationAction.ADD_HOTKEYS;
	hotkeys: Keys;
	callback: Callback;
}

export interface RemoveHotkeys {
	type: NavigationAction.REMOVE_HOTKEYS;
	hotkeys: Keys;
	callback: Callback;
}

interface UpdateBlacklistedUI {
	type: NavigationAction.UPDATE_BLACKLISTED_UI;
	ui: { [key: string]: boolean };
}

interface UpdateBlackListCurrentRule {
	type: NavigationAction.UPDATE_BLACKLIST_CURRENT_RULE;
	currentRule: BlacklistRule;
}

export type NavigationActionTypes =
	| ItemAction
	| PinnedAction
	| MoreAction
	| AccountAction
	| QuickAddAction
	| RegisteredAllExternals
	| ViewLoadingAction
	| SecondaryMenuCoachmarksAction
	| SetMenuState
	| AddHotkeys
	| RemoveHotkeys
	| UpdateItems
	| UpdateBlacklistedUI
	| UpdateBlackListCurrentRule;

export type BlacklistFilter = string[] | string;

export type BlacklistRule = Partial<{
	ui: string[];
	menus: Partial<{
		primary: BlacklistFilter;
		secondary: BlacklistFilter;
		more: BlacklistFilter;
		detached: BlacklistFilter;
	}>;
}>;

interface Blacklist {
	paths: string[];
	rules: { [key: string]: BlacklistRule };
	currentRule: BlacklistRule;
}

export interface NavigationState {
	items: Menus;
	rootUrl: string;
	activeItem?: MenuLink;
	menuState?: MenuStateLocal;
	moreVisible?: boolean;
	accountVisible?: boolean;
	quickAddVisible?: boolean;
	hasRegisteredAllExternals?: boolean;
	viewLoading?: boolean;
	showSecondaryMenuCoachmarks: boolean;
	services?: Service[];
	hiddenPaths?: string[];
	hotkeys: StoredHotkeys[];
	redirects: Redirect[];
	viewSelects: ViewSelectDefinition[];
	blacklist: Blacklist;
	blacklistedUI: { [key: string]: boolean };
}
