import React, { useMemo } from 'react';
import Logger from '@pipedrive/logger-fe';

import { SubMenuItem } from './SubMenuItem';
import useUserDataContext from '../../hooks/useUserDataContext';

const logger = new Logger('froot', 'thirdPartyLinks');

export default function ThirdPartyLinks() {
	const { user } = useUserDataContext();

	let links;

	try {
		links = useMemo(() => JSON.parse(user.settings.get('third_party_links')), [user]);
	} catch (err) {
		logger.logError(err, 'Could not parse third_party_links');
	}

	if (!links) {
		return <></>;
	}

	const elements = links.map((link) => {
		return (
			<SubMenuItem
				key={link.url}
				item={{
					key: link.url,
					target: '_blank',
					title: link.label,
					icon: 'star',
					path: link.url,
				}}
			/>
		);
	});

	return <>{elements}</>;
}
