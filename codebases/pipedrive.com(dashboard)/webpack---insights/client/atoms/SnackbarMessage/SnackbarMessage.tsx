import React from 'react';
import { Snackbar } from '@pipedrive/convention-ui-react';

import { uid } from '../../utils/helpers';
import { snackbarMessageVar } from '../../api/vars/settingsApi';

interface SnackbarMessageProps {
	message: string;
}

const SnackbarMessage: React.FC<SnackbarMessageProps> = ({ message }) => {
	const uniqueId = uid();

	return (
		!!message && (
			<Snackbar
				key={uniqueId}
				message={message}
				onDismiss={() => snackbarMessageVar('')}
			/>
		)
	);
};

export default SnackbarMessage;
