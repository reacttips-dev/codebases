import { useEffect } from 'react';

import { getRouter } from '../api/webapp';

export default function useBlockNavigation({
	isBlocked,
	onNavigate,
}: {
	isBlocked: boolean;
	onNavigate: Function;
}) {
	const router = getRouter();

	useEffect(() => {
		if (isBlocked) {
			router.blockNavigation(onNavigate);
		} else {
			router.restoreBlockedNavigation();
		}

		return () => router.unblockNavigation();
	}, [isBlocked]);
}
