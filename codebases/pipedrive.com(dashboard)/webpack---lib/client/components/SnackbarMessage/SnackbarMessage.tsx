import React, { useCallback } from 'react';
import { Snackbar } from '@pipedrive/convention-ui-react';

export type SnackbarProps = {
	readonly message: string;
	readonly actionText?: string;
	readonly onClick?: () => void;
	readonly href?: string;
	readonly onDismiss: () => void;
};

export const SnackbarMessage = (snackbarProps: SnackbarProps) => {
	const handleDismiss = useCallback(() => {
		snackbarProps.onDismiss();
	}, [snackbarProps]);

	if (snackbarProps.message === '') {
		return null;
	}

	return (
		<Snackbar
			data-testid="SnackbarMessage"
			key={snackbarProps.message}
			message={snackbarProps.message}
			actionText={snackbarProps.actionText}
			onClick={snackbarProps.onClick}
			href={snackbarProps.href}
			onDismiss={handleDismiss}
		/>
	);
};
