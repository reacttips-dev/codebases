import { RelayRefetchProp } from '@pipedrive/relay';
import { InboxFilter } from 'Leadbox/LeadboxFiltersContext';
import { useState } from 'react';

import { SortedColumn } from './useSortColumns';

type Props = RelayRefetchProp['refetch'];

type RefetchVariables = {
	sort?: SortedColumn[];
	filter?: InboxFilter;
};

export type UseRefetchList = {
	loading: boolean;
	refetch: (variables?: RefetchVariables) => Promise<void>;
};

export const useRefetchList = (relayRefetch: Props): UseRefetchList => {
	const [loading, setLoading] = useState(false);

	const refetch = (newVariables: RefetchVariables = {}) => {
		setLoading(true);

		return new Promise<void>((resolve) => {
			relayRefetch(
				(fragmentVariables) => ({ ...fragmentVariables, ...newVariables }),
				null,
				() => {
					setLoading(false);
					resolve();
				},
				{ force: true },
			);
		});
	};

	return {
		loading,
		refetch,
	};
};
