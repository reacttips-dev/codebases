import { useRelayEnvironment, fetchQuery, graphql } from '@pipedrive/relay';
import { useCallback } from 'react';
import { useRelayConnection } from 'Relay/connection/useRelayConnection';

import type { useFetchLeadQuery } from './__generated__/useFetchLeadQuery.graphql';

const NEW_LEAD_QUERY = graphql`
	query useFetchLeadQuery($leadInternalId: String!, $customViewId: ID!) {
		leadTableRow(leadInternalId: $leadInternalId, customViewId: $customViewId) {
			id
			# This fragment here is to fetch the data to list when a lead is created
			# eslint-disable-next-line relay/must-colocate-fragment-spreads
			...ListViewContent_rows
		}
	}
`;

export const useFetchLead = (customViewId?: string) => {
	const connectionHandler = useRelayConnection();
	const environment = useRelayEnvironment();

	const fetchNewLead = useCallback(
		async (leadInternalId: string) => {
			if (!customViewId) {
				return;
			}
			const response = await fetchQuery<useFetchLeadQuery>(environment, NEW_LEAD_QUERY, {
				leadInternalId,
				customViewId,
			}).toPromise();

			if (response?.leadTableRow?.id) {
				connectionHandler.insertNode(response?.leadTableRow?.id, 'ALL');
			}
		},
		[connectionHandler, customViewId, environment],
	);

	return fetchNewLead;
};
