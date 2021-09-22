import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Snackbar } from '@pipedrive/convention-ui-react';
import { snackbarTexts } from './helpers';

const START_SHOWING_SAVING_TIME = 1000;
const SHOW_SAVING_AT_LEAST_TIME = 3000;
const ACTIVITY_MODAL = 'activity-modal';

const savedMessage = (type, settingsEnabled, messages) => {
	if (type === 'activity-settings') {
		if (settingsEnabled) return messages.hasEnabledSuccessfully.text;

		return messages.hasDisabledSuccessfully.text;
	} else {
		return messages.hasSavedSuccessfully.text;
	}
};

const RequestStateSnackbar = ({
	isSaving,
	hasSavedSuccessfully,
	hasDeletedSuccessfully,
	hasError,
	onError,
	translator,
	type = ACTIVITY_MODAL,
	settingsEnabled,
}) => {
	const [savingForAWhile, setSavingForAWhile] = useState(false);
	const messages = snackbarTexts(translator, type);

	useEffect(() => {
		const startShowingTimeout = setTimeout(() => {
			if (isSaving) {
				setSavingForAWhile(true);
			}

			const unsetIfNotSaving = () => {
				if (isSaving) {
					setTimeout(unsetIfNotSaving, 500);
				} else {
					setSavingForAWhile(false);
				}
			};

			setTimeout(unsetIfNotSaving, SHOW_SAVING_AT_LEAST_TIME);
		}, START_SHOWING_SAVING_TIME);

		return () => clearTimeout(startShowingTimeout);
	}, [isSaving]);

	if (savingForAWhile) {
		return (
			<Snackbar
				key="saving"
				message={messages.savingForAwhile.text}
				showSpinner
				duration="no-timeout"
				data-test={messages.savingForAwhile.dataTest}
			/>
		);
	} else if (hasSavedSuccessfully) {
		return (
			<Snackbar
				key="saved"
				data-test={
					type === ACTIVITY_MODAL
						? messages.hasSavedSuccessfully.dataTest
						: messages.hasEnabledSuccessfully.dataTest
				}
				message={savedMessage(type, settingsEnabled, messages)}
			/>
		);
	} else if (hasDeletedSuccessfully) {
		return (
			<Snackbar
				key="removed"
				data-test={messages.hasDeletedSuccessfully.dataTest}
				message={messages.hasDeletedSuccessfully.text}
			/>
		);
	} else if (hasError) {
		return (
			<Snackbar
				key="error"
				message={messages.hasError.text}
				actionText={onError ? translator.gettext('Try again') : null}
				onClick={onError}
				duration={type === ACTIVITY_MODAL ? 'no-timeout' : ''}
				data-test={messages.hasError.dataTest}
			/>
		);
	}

	return null;
};

RequestStateSnackbar.propTypes = {
	isSaving: PropTypes.bool,
	hasSavedSuccessfully: PropTypes.bool,
	hasDeletedSuccessfully: PropTypes.bool,
	hasError: PropTypes.bool,
	onError: PropTypes.func,
	translator: PropTypes.object.isRequired,
	type: PropTypes.string,
	settingsEnabled: PropTypes.bool,
};

export default RequestStateSnackbar;
