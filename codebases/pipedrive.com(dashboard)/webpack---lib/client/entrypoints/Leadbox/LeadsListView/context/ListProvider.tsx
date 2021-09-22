import { createFragmentContainer, graphql, RelayRefetchProp } from '@pipedrive/relay';
import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { ListViewContextProvider } from '@pipedrive/list-view';

import { FilterInitializer } from './FilterInitializer';
import { useFetchLead } from './useFetchLead';
import { SortedColumn, useSortColumns } from './useSortColumns';
import { UseRefetchList, useRefetchList } from './useRefetchList';
import type { ListProvider_data } from './__generated__/ListProvider_data.graphql';
import { UseSelectedRows, useSelectedRows } from './useSelectedRows';

type Props = {
	children: ReactNode;
	data: ListProvider_data | null;
	refetch: RelayRefetchProp['refetch'];
};

export type Context = {
	sortedColumns: SortedColumn[];
	selectedRows: UseSelectedRows;
	fetchNewLead: (id: string) => void;
	relayList: UseRefetchList;
};

export const ListContext = createContext<Context | null>(null);

export const useListContext = () => {
	const context = useContext(ListContext);

	if (!context) {
		throw new Error('ListProvider context is not initialized yet');
	}

	return context;
};

export const ListProviderWithoutData = ({ data, refetch, children }: Props) => {
	const fetchNewLead = useFetchLead(data?.activeCustomView?.id);
	const { sortedColumns } = useSortColumns(data?.activeCustomView ?? null);
	const relayList = useRefetchList(refetch);
	const selectedRows = useSelectedRows({ totalLeads: data?.count ?? 0 });

	const context = useMemo(
		() => ({
			selectedRows,
			sortedColumns,
			fetchNewLead,
			relayList,
		}),
		[fetchNewLead, relayList, sortedColumns, selectedRows],
	);

	return (
		<ListViewContextProvider>
			<ListContext.Provider value={context}>
				{data?.activeFilters && <FilterInitializer activeFilters={data?.activeFilters} />}
				{children}
			</ListContext.Provider>
		</ListViewContextProvider>
	);
};

export const ListProvider = createFragmentContainer(ListProviderWithoutData, {
	data: graphql`
		fragment ListProvider_data on LeadTableConnection {
			count
			activeCustomView {
				...useSortColumns_customView
				id
			}
			activeFilters {
				...FilterInitializer_activeFilters
			}
		}
	`,
});
