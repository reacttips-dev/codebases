import { ContextualViewOptions } from '../index';
import { ViewAction, ViewActionTypes } from './types';
import { Keys, Callback } from '../../../hooks/useHotkeys';

export function openDrawer(options: ContextualViewOptions): ViewActionTypes {
	return {
		type: ViewAction.OPEN_DRAWER,
		options,
	};
}

export function closeDrawer(): ViewActionTypes {
	return {
		type: ViewAction.CLOSE_DRAWER,
	};
}

export function unmountDrawer(): ViewActionTypes {
	return {
		type: ViewAction.UNMOUNT_DRAWER,
	};
}

export function addDrawerHotkeys(hotkeys: Keys, callback: Callback) {
	return {
		type: ViewAction.ADD_HOTKEYS,
		hotkeys,
		callback,
	};
}

export function removeDrawerHotkeys(hotkeys: Keys, callback: Callback) {
	return {
		type: ViewAction.REMOVE_HOTKEYS,
		hotkeys,
		callback,
	};
}
