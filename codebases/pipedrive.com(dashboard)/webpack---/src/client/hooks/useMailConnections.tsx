import { useEffect, useState } from 'react';

import useToolsContext from './useToolsContext';
import { useRootSelector } from '../store';

export default function useMailConnections(onMailConnectionChange) {
	const { componentLoader } = useToolsContext();
	const { hasRegisteredAllExternals } = useRootSelector((s) => s.navigation);
	const [mailConnections, setMailConnections] = useState(null);

	async function getMailConnections() {
		const mailConnections = await componentLoader.load('webapp:mail-connections');

		mailConnections.onReady(() => {
			setMailConnections(mailConnections);
		});
	}

	useEffect(() => {
		if (hasRegisteredAllExternals) {
			getMailConnections();
		}
	}, [hasRegisteredAllExternals]);

	useEffect(() => {
		if (mailConnections) {
			// check for active nylas connection on first load
			if (mailConnections.hasNeverConnected()) {
				return;
			}

			onMailConnectionChange(mailConnections);

			mailConnections.on('change', () => onMailConnectionChange(mailConnections));

			return () => {
				mailConnections.off('change', () => onMailConnectionChange(mailConnections));
			};
		}
	}, [mailConnections]);
}
