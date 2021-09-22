import { Action } from 'redux';

export enum DraggingActionTypes {
	SET_DRAGGING = 'SET_DRAGGING',
}

export interface SetDraggingAction extends Action<DraggingActionTypes.SET_DRAGGING> {
	payload: boolean;
}

export type DraggingActions = SetDraggingAction;

export const setDragging = (isDragging: boolean): SetDraggingAction => ({
	type: DraggingActionTypes.SET_DRAGGING,
	payload: isDragging,
});
