export enum ModalAction {
	OPEN_MODAL = 'OPEN_MODAL',
	CLOSE_MODAL = 'CLOSE_MODAL',
	AFTER_CLOSE_MODAL = 'AFTER_CLOSE_MODAL',
	REOPEN_MODAL = 'REOPEN_MODAL',
}

interface OpenModalAction {
	type: ModalAction.OPEN_MODAL;
	modalName: string;
	options?: any;
}

interface CloseModalAction {
	type: ModalAction.CLOSE_MODAL;
}
interface ReOpenModalAction {
	type: ModalAction.REOPEN_MODAL;
}

interface AfterrCloseModalAction {
	type: ModalAction.AFTER_CLOSE_MODAL;
}

export type ModalActionTypes = OpenModalAction | CloseModalAction | AfterrCloseModalAction | ReOpenModalAction;

export interface ModalState {
	modalName?: string;
	visible?: boolean;
	mounted?: boolean;
	modalHash?: number;
	options?: any;
}
