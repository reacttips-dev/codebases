import { useContext } from 'react';
import { LeadboxRoutes } from 'Utils/LeadboxRoutes';
import { WebappApiContext } from 'Components/WebappApiContext';

// We close the Lead contextual view by removing the lead_id from the url
// When URL is changed the logic in LeadsLists is triggered and does all the
// logic around closing the contextual view
export function useUnselectLead() {
	const { router } = useContext(WebappApiContext);
	// This is the only routing function that is used from lead detail as well
	// which doesn't have any other routing capabilities. To make it simple, this
	// is the only place window.location is used directly.
	const isArchived = window.location.pathname.includes(LeadboxRoutes.Archived);

	return () => {
		const nextRoute = isArchived ? LeadboxRoutes.Archived : LeadboxRoutes.Inbox;

		router.navigateTo(`/leads${nextRoute}`);
	};
}
