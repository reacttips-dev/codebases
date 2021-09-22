import { graphql, readInlineData } from '@pipedrive/relay';

import type { getSource$key } from './__generated__/getSource.graphql';

export function getSource(leadRef: getSource$key | null) {
	const lead = readInlineData(
		graphql`
			fragment getSource on Lead @inline {
				sourceInfo {
					source {
						name
					}
				}
			}
		`,
		leadRef,
	);

	const sourceName = lead?.sourceInfo?.source?.name;

	if (sourceName == null || sourceName === '') {
		return 'Manually created';
	}

	if (sourceName === 'Leadbooster') {
		return 'Chatbot';
	}

	return sourceName;
}
