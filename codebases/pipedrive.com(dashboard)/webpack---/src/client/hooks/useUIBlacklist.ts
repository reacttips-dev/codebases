import { useEffect } from 'react';

import { updateCurrentRule, updateUI, updateNavItems } from '../utils/uiBlacklist';

/**
 * @summary A hook to trigger all blacklist UI updates on the
 * current path change.
 */
export function useUIBlacklist({ currentPath, items, blacklist, dispatch }) {
	useEffect(() => {
		if (!blacklist) {
			return;
		}

		updateCurrentRule({ currentPath, blacklist, dispatch });
		updateUI({ blacklist, currentPath, dispatch });
		updateNavItems({ items, blacklist, dispatch });
	}, [currentPath]);
}
