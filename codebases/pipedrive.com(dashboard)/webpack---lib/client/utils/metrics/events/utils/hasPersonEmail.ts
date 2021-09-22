import { graphql, readInlineData } from '@pipedrive/relay';

import type { hasPersonEmail$key } from './__generated__/hasPersonEmail.graphql';

export function hasPersonEmail(personRef: hasPersonEmail$key | null): boolean {
	const person = readInlineData(
		graphql`
			fragment hasPersonEmail on Person @inline {
				emails(first: 1) {
					__typename
				}
			}
		`,
		personRef,
	);

	if (person == null) {
		return false;
	}

	const numberOfEmails = person.emails?.length ?? 0;

	return numberOfEmails > 0;
}
