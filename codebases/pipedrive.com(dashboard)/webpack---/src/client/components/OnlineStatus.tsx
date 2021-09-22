import React, { useEffect, useState } from 'react';
import { Snackbar } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import useToolsContext from '../hooks/useToolsContext';

const OnlineStatus = () => {
	const translator = useTranslator();
	const { router } = useToolsContext();
	const [online, setOnline] = useState<boolean>(true);
	const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
	const snackbarMessage = online
		? translator.gettext('You have reconnected to the internet.')
		: translator.gettext('You have lost connection to the internet.');

	function onSnackbarDismiss() {
		setShowSnackbar(false);
	}

	function handleOnlineEvent() {
		const onlineEvent = new Event('socketqueue.reconnect');
		window.dispatchEvent(onlineEvent);

		// Make the app reload on next link click, when browser comes back online
		router.setReloadOnLeave(router.getCurrentPath());

		setOnline(true);
		setShowSnackbar(true);
	}

	function handleOfflineEvent() {
		const offlineEvent = new Event('socketqueue.disconnect');
		window.dispatchEvent(offlineEvent);

		setOnline(false);
		setShowSnackbar(true);
	}

	useEffect(() => {
		window.addEventListener('online', handleOnlineEvent);
		window.addEventListener('offline', handleOfflineEvent);

		return () => {
			window.removeEventListener('online', handleOnlineEvent);
			window.removeEventListener('offline', handleOfflineEvent);
		};
	});

	return (
		showSnackbar && (
			<Snackbar
				data-id="online-status-snackbar"
				message={snackbarMessage}
				closeText={translator.gettext('Close')}
				onDismiss={onSnackbarDismiss}
			/>
		)
	);
};

export default OnlineStatus;
