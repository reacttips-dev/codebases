import { ModalAction, ModalActionTypes } from './types';

export function openModal(modalName: string, options?: any): ModalActionTypes {
	return {
		type: ModalAction.OPEN_MODAL,
		modalName,
		options,
	};
}

export function closeModal(): ModalActionTypes {
	return {
		type: ModalAction.CLOSE_MODAL,
	};
}

export function reOpenModal(): ModalActionTypes {
	return {
		type: ModalAction.REOPEN_MODAL,
	};
}

export function afterCloseModal(): ModalActionTypes {
	return {
		type: ModalAction.AFTER_CLOSE_MODAL,
	};
}
