import { graphql, readInlineData } from '@pipedrive/relay';

import { isNotEmpty } from './isNotEmpty';
import type { hasOrganizationAddress$key } from './__generated__/hasOrganizationAddress.graphql';

export function hasOrganizationAddress(organizationRef: hasOrganizationAddress$key | null): boolean {
	const organization = readInlineData(
		graphql`
			fragment hasOrganizationAddress on Organization @inline {
				address
			}
		`,
		organizationRef,
	);

	return isNotEmpty(organization?.address);
}
