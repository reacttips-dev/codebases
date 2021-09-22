import { MenuLink, MenuStateLocal } from '../../components/menu';
import { NavigationAction, BlacklistRule } from './types';
import { Keys, Callback } from '../../hooks/useHotkeys';

export function updateItems(items: { [key: string]: MenuLink[] }) {
	return {
		type: NavigationAction.UPDATE_ITEMS,
		items,
	};
}

export function selectItem(item: MenuLink) {
	return {
		type: NavigationAction.ITEM_SELECTED,
		item,
	};
}

export function setMenuState(menuState: MenuStateLocal) {
	return {
		type: NavigationAction.SET_MENU_STATE,
		menuState,
	};
}

export function togglePinned(key?: string) {
	return {
		type: NavigationAction.PINNED_TOGGLE,
		key,
	};
}

export function toggleMore(visible?: boolean) {
	return {
		type: NavigationAction.MORE_TOGGLE,
		visible,
	};
}

export function registeredAllExternals() {
	return {
		type: NavigationAction.REGISTERED_ALL_EXTERNALS,
	};
}

export function toggleAccount(visible?: boolean) {
	return {
		type: NavigationAction.ACCOUNT_TOGGLE,
		visible,
	};
}

export function toggleQuickAdd(visible?: boolean) {
	return {
		type: NavigationAction.QUICK_ADD_TOGGLE,
		visible,
	};
}

export function setViewLoading(isLoading: boolean) {
	return {
		type: NavigationAction.SET_VIEW_LOADING,
		isLoading,
	};
}

export function setShowSecondaryMenuCoachmarks(showCoachmarks: boolean) {
	return {
		type: NavigationAction.SHOW_SECONDARY_MENU_COACH_MARKS,
		showCoachmarks,
	};
}

export function addHotkeys(hotkeys: Keys, callback: Callback) {
	return {
		type: NavigationAction.ADD_HOTKEYS,
		hotkeys,
		callback,
	};
}

export function removeHotkeys(hotkeys: Keys, callback: Callback) {
	return {
		type: NavigationAction.REMOVE_HOTKEYS,
		hotkeys,
		callback,
	};
}

export function updateBlacklistedUI(ui: { [key: string]: boolean }) {
	return {
		type: NavigationAction.UPDATE_BLACKLISTED_UI,
		ui,
	};
}

export function updateBlacklistCurrentRule(currentRule: BlacklistRule) {
	return {
		type: NavigationAction.UPDATE_BLACKLIST_CURRENT_RULE,
		currentRule,
	};
}
