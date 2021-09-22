/* eslint-disable relay/unused-fields */
import { fetchQuery, graphql, IEnvironment } from '@pipedrive/relay';

import { fetchFilterByInternalIdQuery } from './__generated__/fetchFilterByInternalIdQuery.graphql';

export const fetchFilterByInternalId = async (relayEnvironment: IEnvironment, internalId: number) => {
	const response = await fetchQuery<fetchFilterByInternalIdQuery>(
		relayEnvironment,
		graphql`
			query fetchFilterByInternalIdQuery($internalId: Int!) {
				filter(internalId: $internalId) {
					id
					legacyID: id(opaque: false)
					name
					visibleTo
					user {
						id
						legacyID: id(opaque: false)
					}
				}
			}
		`,
		{ internalId },
	).toPromise();

	return response?.filter;
};
