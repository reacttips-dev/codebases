import { LeadFilterStatus } from 'Types/types';

import { useIsInboxRoute } from './useRoutes';

export const useLeadFilterStatus = () => {
	const isInboxRoute = useIsInboxRoute();

	return (isInboxRoute ? 'ALL' : 'ARCHIVED') as LeadFilterStatus;
};
