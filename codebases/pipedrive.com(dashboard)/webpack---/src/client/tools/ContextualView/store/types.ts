import { ContextualViewOptions } from '../index';
import { Keys, Callback, StoredHotkeys } from '../../../hooks/useHotkeys';

export enum ViewAction {
	OPEN_DRAWER = 'OPEN_DRAWER',
	CLOSE_DRAWER = 'CLOSE_DRAWER',
	UNMOUNT_DRAWER = 'UNMOUNT_DRAWER',
	ADD_HOTKEYS = 'ADD_HOTKEYS',
	REMOVE_HOTKEYS = 'REMOVE_HOTKEYS',
}

type OpenViewAction = {
	type: ViewAction.OPEN_DRAWER;
	options: ContextualViewOptions;
};

type CloseViewAction = {
	type: ViewAction.CLOSE_DRAWER;
};

type UnmountViewAction = {
	type: ViewAction.UNMOUNT_DRAWER;
};

interface AddHotkeysAction {
	type: ViewAction.ADD_HOTKEYS;
	hotkeys: Keys;
	callback: Callback;
}

export interface RemoveHotkeysAction {
	type: ViewAction.REMOVE_HOTKEYS;
	hotkeys: Keys;
	callback: Callback;
}

export type ViewActionTypes =
	| OpenViewAction
	| CloseViewAction
	| UnmountViewAction
	| AddHotkeysAction
	| RemoveHotkeysAction;

export type ViewState = {
	options: any;
	hotkeys: StoredHotkeys[];
	visible?: boolean;
	mounted?: boolean;
	hash?: number;
};
