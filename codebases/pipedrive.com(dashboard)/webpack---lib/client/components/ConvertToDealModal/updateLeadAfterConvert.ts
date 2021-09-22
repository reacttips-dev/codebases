import { IEnvironment, commitMutation, graphql } from '@pipedrive/relay';

import type { updateLeadAfterConvertMutation } from './__generated__/updateLeadAfterConvertMutation.graphql';

type UpdateLeadAfterConvert = {
	relayEnvironment: IEnvironment;
	leadId: string;
	dealId: number;
	orgId: number | undefined;
	personId: number | undefined;
};

export const updateLeadAfterConvert = ({
	relayEnvironment,
	leadId,
	dealId,
	orgId,
	personId,
}: UpdateLeadAfterConvert): Promise<updateLeadAfterConvertMutation['response']['markLeadAsConvertedForView']> => {
	return new Promise((resolve, reject) => {
		commitMutation<updateLeadAfterConvertMutation>(relayEnvironment, {
			mutation: graphql`
				mutation updateLeadAfterConvertMutation(
					$leadId: ID!
					$dealId: Int!
					$personId: Int
					$organizationId: Int
					$customViewId: ID
				) {
					markLeadAsConvertedForView(
						input: {
							leadId: $leadId
							dealId: $dealId
							personId: $personId
							organizationId: $organizationId
						}
						customViewId: $customViewId
					) {
						__typename
						... on LeadTableRow {
							id
							lead {
								id
								isArchived
							}
						}
					}
				}
			`,
			variables: {
				leadId,
				dealId,
				personId: personId ?? null,
				organizationId: orgId ?? null,
			},
			onCompleted: ({ markLeadAsConvertedForView }) => {
				if (markLeadAsConvertedForView?.__typename === 'LeadTableRow') {
					resolve(markLeadAsConvertedForView);
				} else {
					reject();
				}
			},
			onError: () => {
				reject();
			},
		});
	});
};
