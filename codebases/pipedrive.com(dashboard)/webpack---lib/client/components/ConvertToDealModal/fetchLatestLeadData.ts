/* eslint-disable relay/must-colocate-fragment-spreads */
import { fetchQuery, graphql, IEnvironment } from '@pipedrive/relay';

import { fetchLatestLeadDataQuery } from './__generated__/fetchLatestLeadDataQuery.graphql';

export const fetchLatestLeadData = async (relayEnvironment: IEnvironment, leadID: string) => {
	const response = await fetchQuery<fetchLatestLeadDataQuery>(
		relayEnvironment,
		graphql`
			query fetchLatestLeadDataQuery($leadID: ID!) {
				leadRef: node(id: $leadID) {
					... on Lead {
						__typename
						...getDealPrefillData
						...getPersonPrefillData
						...getOrganizationPrefillData
						...getDealAddedTrackingData_lead
					}
				}
			}
		`,
		{ leadID },
	).toPromise();

	if (response?.leadRef === null || response?.leadRef.__typename !== 'Lead') {
		throw new Error('Could not fetch latest lead data.');
	}

	return response.leadRef;
};
