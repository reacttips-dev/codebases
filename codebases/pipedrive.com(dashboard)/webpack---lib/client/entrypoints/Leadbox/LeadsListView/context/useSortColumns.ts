import { graphql, readInlineData } from '@pipedrive/relay';

import type { useSortColumns_customView$key } from './__generated__/useSortColumns_customView.graphql';

type Props = useSortColumns_customView$key;

export type SortedColumn = {
	readonly id: string;
	readonly direction: 'ASC' | 'DESC';
};

const SORT_COLUMN = graphql`
	fragment useSortColumns_customView on CustomView @inline {
		fields {
			id
			sortDirection
			sortSequence
		}
	}
`;

export const useSortColumns = (customView: Props | null) => {
	const data = readInlineData(SORT_COLUMN, customView);

	const sortedColumns = (data?.fields ?? [])
		.map((field) => ({
			id: field.id,
			direction: field.sortDirection,
			sequence: field.sortSequence,
		}))
		.sort((e1, e2) => (e1.sequence && e2.sequence ? e1.sequence - e2.sequence : 0))
		.reduce<SortedColumn[]>((acc, e) => {
			if ((e.direction && e.direction === 'ASC') || (e.direction === 'DESC' && e.sequence)) {
				return [...acc, { id: e.id, direction: e.direction }];
			}

			return acc;
		}, [] as SortedColumn[]);

	return { sortedColumns };
};
