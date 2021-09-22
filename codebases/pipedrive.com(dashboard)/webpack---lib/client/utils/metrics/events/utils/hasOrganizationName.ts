import { graphql, readInlineData } from '@pipedrive/relay';

import { isNotEmpty } from './isNotEmpty';
import type { hasOrganizationName$key } from './__generated__/hasOrganizationName.graphql';

export function hasOrganizationName(organizationRef: hasOrganizationName$key | null): boolean {
	const organization = readInlineData(
		graphql`
			fragment hasOrganizationName on Organization @inline {
				name
			}
		`,
		organizationRef,
	);

	return isNotEmpty(organization?.name);
}
