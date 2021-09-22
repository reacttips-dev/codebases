import { Action } from 'redux';
import { SnackbarProps } from '@pipedrive/convention-ui-react';

import { SnackbarMessages } from './getMessage';

export enum SnackbarActionTypes {
	ADD_SNACKBAR_MESSAGE = 'ADD_SNACKBAR_MESSAGE',
	REMOVE_SNACKBAR_MESSAGE = 'REMOVE_SNACKBAR_MESSAGE',
}

export interface AddSnackbarMessage {
	key: SnackbarMessages;
	translatorReplacements?: string[];
	snackbarProps?: {
		actionText: SnackbarProps['actionText'];
		onClick: SnackbarProps['onClick'];
	};
}
export interface AddSnackbarMessageAction extends Action<SnackbarActionTypes.ADD_SNACKBAR_MESSAGE> {
	payload: AddSnackbarMessage;
}

export interface RemoveSnackbarMessageAction extends Action<SnackbarActionTypes.REMOVE_SNACKBAR_MESSAGE> {
	payload: string;
}

export type SnackbarActions = AddSnackbarMessageAction | RemoveSnackbarMessageAction;

export const addSnackbarMessage = (messageParams: AddSnackbarMessage): AddSnackbarMessageAction => ({
	type: SnackbarActionTypes.ADD_SNACKBAR_MESSAGE,
	payload: messageParams,
});

export const removeSnackbarMessage = (key: SnackbarMessages): RemoveSnackbarMessageAction => ({
	type: SnackbarActionTypes.REMOVE_SNACKBAR_MESSAGE,
	payload: key,
});
