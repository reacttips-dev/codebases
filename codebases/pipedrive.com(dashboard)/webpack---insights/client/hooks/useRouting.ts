import { useEffect, useCallback } from 'react';

import { selectedItemFromUrl, getInsightsUrlFromPath } from '../utils/helpers';
import useRouter from './useRouter';
import { setSelectedItem } from '../utils/localState/settingsApiState';

const useRouting = () => {
	const [, on, off] = useRouter();
	const handleUrlChange = useCallback(
		async ({ path }) => {
			const url = getInsightsUrlFromPath(path);

			if (url) {
				await setSelectedItem(selectedItemFromUrl(url, true));
			}
		},
		[setSelectedItem],
	);

	useEffect(() => {
		on('routeChange', handleUrlChange);

		return () => off('routeChange', handleUrlChange);
	}, [handleUrlChange]);
};

export default useRouting;
