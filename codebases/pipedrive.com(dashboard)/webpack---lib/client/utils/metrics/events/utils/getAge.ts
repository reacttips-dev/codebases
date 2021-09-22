import { graphql, readInlineData } from '@pipedrive/relay';

import type { getAge$key } from './__generated__/getAge.graphql';

/**
 * Returns Lead age in days.
 */
export function getAge(leadRef: getAge$key | null): number {
	const lead = readInlineData(
		graphql`
			fragment getAge on Lead @inline {
				timeCreated
			}
		`,
		leadRef,
	);

	const timeCreated = lead?.timeCreated ?? new Date();

	const created = new Date(timeCreated);
	const current = new Date();
	const msDiff = current.getTime() - created.getTime();

	return Math.floor(msDiff / 86400000); // to days
}
