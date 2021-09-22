export const snackbarTexts = (translator, type) => {
	const messages = {
		'activity-modal': {
			savingForAwhile: {
				text: translator.gettext('Saving activity'),
				dataTest: 'activity-snackbar-saving',
			},
			hasSavedSuccessfully: {
				text: translator.gettext('Activity saved'),
				dataTest: 'activity-snackbar-saved',
			},
			hasDeletedSuccessfully: {
				text: translator.gettext('Activity removed'),
				dataTest: 'activity-snackbar-deleted',
			},
			hasError: {
				text: translator.gettext('Activity could not be saved'),
				dataTest: 'activity-snackbar-error',
			},
		},
		'activity-settings': {
			savingForAwhile: {
				text: translator.gettext('Saving'),
				dataTest: 'activity-settings-snackbar-saving',
			},
			hasEnabledSuccessfully: {
				text: translator.gettext('Pop-up enabled successfully'),
				dataTest: 'activity-settings-snackbar-saved',
			},
			hasDisabledSuccessfully: {
				text: translator.gettext('Pop-up disabled successfully'),
			},
			hasError: {
				text: translator.gettext('Something went wrong. Please try again.'),
				dataTest: 'activity-settings-snackbar-error',
			},
		},
	};

	return messages[type];
};
