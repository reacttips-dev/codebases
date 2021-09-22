import { LeadboxRoutes } from 'Utils/LeadboxRoutes';
import { useParams, useMatch } from 'react-router-dom';
import { useCallback } from 'react';

export const useAppParams = () => useParams();

export const useBaseRoute = () => {
	const routeMatch = useMatch('/leads/:section/*');

	if (!routeMatch) {
		throw new Error('Unknown route');
	}

	return `/${routeMatch.params.section}`;
};

export const useIsRoute = (route: LeadboxRoutes) => {
	const baseRoute = useBaseRoute();

	return baseRoute === route;
};

export const useIsInboxRoute = () => useIsRoute(LeadboxRoutes.Inbox);
export const useIsArchivedRoute = () => useIsRoute(LeadboxRoutes.Archived);
export const useLeadURL = () => {
	const baseRoute = useBaseRoute();

	return useCallback(
		(uuid: string) => {
			if (baseRoute === LeadboxRoutes.Archived) {
				return `/leads${LeadboxRoutes.Archived}/${uuid}`;
			}

			return `/leads${LeadboxRoutes.Inbox}/${uuid}`;
		},
		[baseRoute],
	);
};
