import { graphql, readInlineData } from '@pipedrive/relay';

import type { hasPersonPhone$key } from './__generated__/hasPersonPhone.graphql';

export function hasPersonPhone(personVariantRef: hasPersonPhone$key | null): boolean {
	const person = readInlineData(
		graphql`
			fragment hasPersonPhone on Person @inline {
				phones(first: 1) {
					__typename
				}
			}
		`,
		personVariantRef,
	);

	if (person == null) {
		return false;
	}

	const numberOfPhones = person.phones?.length ?? 0;

	return numberOfPhones > 0;
}
