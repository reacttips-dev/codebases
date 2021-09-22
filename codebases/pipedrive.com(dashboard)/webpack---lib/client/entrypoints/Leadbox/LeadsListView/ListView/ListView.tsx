import React, { useRef, useCallback } from 'react';
import { createPaginationContainer, graphql, RelayPaginationProp } from '@pipedrive/relay';
import { ListViewContent } from 'Leadbox/LeadsListView/ListView/ListViewContent';
import { LeadDetailLoader } from 'Leadbox/LeadsListView/LeadDetailLoader';
import type { ListViewRef } from 'Types/types';

import type { ListView_data } from './__generated__/ListView_data.graphql';
import type { ListViewPaginationQueryVariables } from './__generated__/ListViewPaginationQuery.graphql';

type Props = {
	relay: RelayPaginationProp;
	data: ListView_data | null;
};

const ListViewWithoutData = ({ data, relay }: Props) => {
	const listViewRef = useRef<ListViewRef>(null);
	const onScrollToItem = useCallback(
		(index: number) => {
			listViewRef.current?.scrollToItem(index);
		},
		[listViewRef],
	);
	const headers = data?.leadView?.activeCustomView?.fields;
	const rows = data?.leadView?.edges?.flatMap((edge) => {
		const tableRow = edge?.node;

		return tableRow ? [tableRow] : [];
	});

	return (
		<>
			<LeadDetailLoader data={data?.leadView || null} onScrollToItem={onScrollToItem} />
			{headers?.length && rows?.length && (
				<ListViewContent
					ref={listViewRef}
					paginationHandler={relay}
					rows={rows}
					customView={data?.leadView?.activeCustomView}
				/>
			)}
		</>
	);
};

export const ListView = createPaginationContainer(
	ListViewWithoutData,
	{
		data: graphql`
			fragment ListView_data on RootQuery
			@argumentDefinitions(
				status: { type: "LeadStatus!" }
				first: { type: "Int!" }
				after: { type: "String" }
				filter: { type: "LeadsFilter" }
				sort: { type: "[LeadsSort!]" }
			) {
				leadView(first: $first, after: $after, status: $status, filter: $filter, sort: $sort)
					@connection(key: "ListView_leadView") {
					activeCustomView {
						fields {
							__typename
						}
						...ListViewContent_customView
					}
					edges {
						node {
							...ListViewContent_rows
						}
					}
					...LeadDetailLoader_data
				}
			}
		`,
	},
	{
		direction: 'forward',
		getVariables: (props, { count, cursor }, fragmentVariables): ListViewPaginationQueryVariables => {
			return {
				status: fragmentVariables.status,
				filter: fragmentVariables.filter,
				sort: fragmentVariables.sort,
				first: count,
				after: cursor,
			};
		},
		// pagination query to be fetched upon calling 'loadMore'
		query: graphql`
			query ListViewPaginationQuery(
				$status: LeadStatus!
				$first: Int!
				$after: String
				$filter: LeadsFilter
				$sort: [LeadsSort!]
			) {
				...ListView_data @arguments(status: $status, first: $first, after: $after, filter: $filter, sort: $sort)
			}
		`,
	},
);
