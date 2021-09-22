import { ACTION_POPOVERS, PopoverActions, PopoverActionTypes } from '../actions/actionPopovers';
import { combineReducers } from 'redux';

const isMovePopoverVisible = (state = false, action: PopoverActions) => {
	if (action.type === PopoverActionTypes.OPEN_ACTION_POPOVER && action.payload.popover === ACTION_POPOVERS.MOVE) {
		return true;
	}

	if (action.type === PopoverActionTypes.CLOSE_ACTION_POPOVERS) {
		return false;
	}

	return state;
};

const isLostPopoverVisible = (state = false, action: PopoverActions) => {
	if (action.type === PopoverActionTypes.OPEN_ACTION_POPOVER && action.payload.popover === ACTION_POPOVERS.LOST) {
		return true;
	}

	if (action.type === PopoverActionTypes.CLOSE_ACTION_POPOVERS) {
		return false;
	}

	return state;
};

const selectedDeal = (state: Pipedrive.Deal = null, action: PopoverActions) => {
	if (action.type === PopoverActionTypes.OPEN_ACTION_POPOVER) {
		return action.payload.deal;
	}

	if (action.type === PopoverActionTypes.CLOSE_ACTION_POPOVERS) {
		return null;
	}

	return state;
};

export default combineReducers({
	isMovePopoverVisible,
	isLostPopoverVisible,
	selectedDeal,
});
