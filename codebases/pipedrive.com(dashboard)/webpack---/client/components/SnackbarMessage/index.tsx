import React from 'react';
import { connect } from 'react-redux';
import { Snackbar } from '@pipedrive/convention-ui-react';
import { getSnackbarMessages } from './selectors';
import { AddSnackbarMessage, removeSnackbarMessage } from './actions';
import getMessage from './getMessage';
import { useTranslator } from '@pipedrive/react-utils';

interface StateProps {
	snackbarMessages: AddSnackbarMessage[];
}

interface DispatchProps {
	removeSnackbarMessage: typeof removeSnackbarMessage;
}

export type SnackbarMessageProps = StateProps & DispatchProps;

const SnackbarMessage = (props: SnackbarMessageProps) => {
	const translator = useTranslator();

	if (props.snackbarMessages.length === 0) {
		return null;
	}

	const snackbarMessage = props.snackbarMessages[0];
	const message = getMessage(translator, snackbarMessage.key, snackbarMessage.translatorReplacements);

	if (!message) {
		return null;
	}

	const passedProps = {
		...(snackbarMessage.snackbarProps?.actionText && { actionText: snackbarMessage.snackbarProps.actionText }),
		...(snackbarMessage.snackbarProps?.onClick && { onClick: snackbarMessage.snackbarProps.onClick }),
	};

	return (
		<Snackbar
			data-test="snackbar-message"
			key={Math.random() * 100}
			message={message}
			onDismiss={() => {
				props.removeSnackbarMessage(snackbarMessage.key);
			}}
			{...passedProps}
		/>
	);
};

const mapStateToProps = (state: PipelineState) => ({
	snackbarMessages: getSnackbarMessages(state),
});

export default connect<StateProps, DispatchProps>(mapStateToProps, { removeSnackbarMessage })(SnackbarMessage);
