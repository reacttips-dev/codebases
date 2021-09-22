import { readInlineData, graphql } from '@pipedrive/relay';
import { removeEmpty } from 'Utils/utils';

import { composeDealPrefillCustomFieldsReducer } from './composeDealModalPrefillCustomFields';
import type { getOrganizationPrefillData$key } from './__generated__/getOrganizationPrefillData.graphql';

type OrganizationPrefill = {
	address?: string;
};

export const getOrganizationPrefillData = (
	leadRef: getOrganizationPrefillData$key | null,
): OrganizationPrefill | undefined => {
	const lead = readInlineData(
		graphql`
			fragment getOrganizationPrefillData on Lead @inline {
				organization {
					address
					customFields {
						...composeDealModalPrefillCustomFieldsReducer
					}
				}
			}
		`,
		leadRef,
	);

	const organization = lead?.organization;

	if (!organization) {
		return;
	}

	const customFields = organization?.customFields?.reduce(composeDealPrefillCustomFieldsReducer, {}) ?? {};

	return removeEmpty({
		address: organization.address ?? undefined,
		...customFields,
	});
};
