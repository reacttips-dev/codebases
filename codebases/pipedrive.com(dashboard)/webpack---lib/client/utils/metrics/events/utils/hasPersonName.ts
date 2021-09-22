import { graphql, readInlineData } from '@pipedrive/relay';

import { isNotEmpty } from './isNotEmpty';
import type { hasPersonName$key } from './__generated__/hasPersonName.graphql';

export function hasPersonName(personRef: hasPersonName$key | null): boolean {
	const person = readInlineData(
		graphql`
			fragment hasPersonName on Person @inline {
				name
			}
		`,
		personRef,
	);

	return isNotEmpty(person?.name);
}
