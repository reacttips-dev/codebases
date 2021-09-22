import { AddSnackbarMessage } from './actions';

export const getSnackbarMessages = (state: PipelineState): AddSnackbarMessage[] =>
	state.snackbar as AddSnackbarMessage[];
