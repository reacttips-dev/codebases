import { SetDraggingAction, DraggingActionTypes } from '../actions/dragging';

function dragging(state = false, action: SetDraggingAction): boolean {
	if (action.type === DraggingActionTypes.SET_DRAGGING) {
		return action.payload;
	}

	return state;
}

export default dragging;
