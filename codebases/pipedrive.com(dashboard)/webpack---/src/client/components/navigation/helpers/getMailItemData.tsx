import { useState } from 'react';
import { MenuLink } from '../../menu';
import { useTranslator } from '@pipedrive/react-utils';

import useMailConnections from '../../../hooks/useMailConnections';

export function getMailItemData(item: MenuLink) {
	const translator = useTranslator();
	const [mailItem, setMailItem] = useState(item);
	const mailItemTitle = item.title;

	function onMailConnectionChange(mailConnections) {
		const hasActiveNylasConnection = mailConnections.hasActiveNylasConnection();

		setMailItem({
			...mailItem,
			warning: !hasActiveNylasConnection,
			title: `${mailItemTitle} ${hasActiveNylasConnection ? '' : `(${translator.gettext('disconnected')})`}`,
		});
	}

	useMailConnections(onMailConnectionChange);

	return mailItem;
}
