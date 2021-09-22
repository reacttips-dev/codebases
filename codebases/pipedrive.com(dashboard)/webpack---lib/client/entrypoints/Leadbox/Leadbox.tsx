import styled from 'styled-components';
import { colors } from '@pipedrive/convention-ui-css/dist/js/variables';
import React, { useEffect } from 'react';
import { useSubscriptionActivity } from 'Relay/subscriptions/useSubscriptionActivity';
import { leadsListOpened } from 'Utils/metrics/events/lead/leads.listOpened';
import { useTracking } from 'Utils/metrics/useTracking';
import { LeadsListView } from 'Leadbox/LeadsListView/LeadsListView';

import { LeadsEmailIntegrationModal } from './LeadsEmailIntegrationModal/LeadsEmailIntegrationModal';

const LeadboxWrapper = styled.div`
	background-color: ${colors.white};
	display: flex;
	position: relative;
	height: 100%;
	width: 100%;
`;

export const Leadbox: React.FC = () => {
	const tracking = useTracking();

	useSubscriptionActivity();

	useEffect(() => {
		tracking.trackEvent(leadsListOpened());
	}, [tracking]);

	return (
		<LeadboxWrapper data-testid="LeadsInboxWrapper">
			<LeadsListView />
			<LeadsEmailIntegrationModal />
		</LeadboxWrapper>
	);
};
