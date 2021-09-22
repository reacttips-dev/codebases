import React from 'react';
import { FrootRouter } from '@pipedrive/types';

import { useLeadURL } from './useRoutes';

export const useSetLeadDetailUrl = (router: FrootRouter) => {
	const setLeadURL = useLeadURL();

	return React.useCallback(
		(leadUUID: string) => {
			router.navigateTo(setLeadURL(leadUUID));
		},
		[setLeadURL, router],
	);
};
