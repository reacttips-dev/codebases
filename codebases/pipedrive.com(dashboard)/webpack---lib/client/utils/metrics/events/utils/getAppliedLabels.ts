import { graphql, readInlineData } from '@pipedrive/relay';

import type { getAppliedLabels$key } from './__generated__/getAppliedLabels.graphql';

export function getAppliedLabels(leadRef: getAppliedLabels$key | null): ReadonlyArray<string> {
	const lead = readInlineData(
		graphql`
			fragment getAppliedLabels on Lead @inline {
				labels {
					legacyID: id(opaque: false)
					name
				}
			}
		`,
		leadRef,
	);

	const labels = lead?.labels ?? [];

	return labels?.map((label) => {
		return label?.name ?? `unknown name (id: ${label?.legacyID})`;
	});
}
