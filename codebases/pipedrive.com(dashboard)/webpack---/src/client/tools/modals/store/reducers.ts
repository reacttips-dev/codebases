import { ModalAction, ModalState, ModalActionTypes } from './types';

const initialState: ModalState = {
	modalName: null,
	visible: false,
	mounted: false,
	modalHash: null,
	options: null,
};

export function modalReducer(state = initialState, action: ModalActionTypes): ModalState {
	switch (action.type) {
		case ModalAction.OPEN_MODAL:
			return {
				...state,
				modalName: action.modalName,
				visible: true,
				mounted: true,
				modalHash: Math.random(),
				options: action.options,
			};
		case ModalAction.CLOSE_MODAL:
			return { ...state, visible: false };
		case ModalAction.AFTER_CLOSE_MODAL:
			return { ...state, modalName: null, visible: false, mounted: false, options: null };
		case ModalAction.REOPEN_MODAL:
			return { ...state, visible: true };
		default:
			return state;
	}
}
