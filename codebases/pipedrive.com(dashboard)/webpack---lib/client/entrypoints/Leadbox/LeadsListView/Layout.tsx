import React from 'react';
import { createRefetchContainer, graphql, RelayRefetchProp } from '@pipedrive/relay';
import { LoadUIState } from 'Leadbox/LoadUIState/LoadUIState';

import { ListProvider } from './context/ListProvider';
import { ListView } from './ListView/ListView';
import { LayoutHeader } from './LayoutHeader';
import type { Layout_data } from './__generated__/Layout_data.graphql';

type Props = {
	relay: RelayRefetchProp;
	data: Layout_data | null;
};

const LayoutWithoutData: React.FC<Props> = (props) => {
	const { data } = props;

	const leadCount = data?.leadView?.count;

	return (
		<ListProvider data={data?.leadView ?? null} refetch={props.relay.refetch}>
			<LayoutHeader data={data} leadView={data?.leadView ?? null} />
			<LoadUIState leadCount={leadCount} inboxCount={data?.inboxCount} archivedCount={data?.archivedCount}>
				{data && <ListView data={data} />}
			</LoadUIState>
		</ListProvider>
	);
};

export const Layout = createRefetchContainer(
	LayoutWithoutData,
	{
		data: graphql`
			fragment Layout_data on RootQuery
			@argumentDefinitions(
				status: { type: "LeadStatus!" }
				first: { type: "Int!" }
				after: { type: "String" }
				filter: { type: "LeadsFilter" }
				sort: { type: "[LeadsSort!]" }
				teamsFeature: { type: "Boolean!" }
			) {
				inboxCount: leadsCount(page: INBOX)
				archivedCount: leadsCount(page: ARCHIVE)
				...LayoutHeader_data @arguments(teamsFeature: $teamsFeature)
				...ListView_data @arguments(status: $status, first: $first, filter: $filter, sort: $sort)
				leadView(first: $first, after: $after, status: $status, filter: $filter, sort: $sort)
					@connection(key: "ListView_leadView") {
					count
					...LayoutHeader_leadView
					...ListProvider_data
					# Necessary because of @connection(key: "ListView_leadView")
					# which must be here to trigger re-render when we commit local update to connection
					# eslint-disable-next-line relay/unused-fields
					edges {
						__typename
					}
				}
			}
		`,
	},
	graphql`
		query LayoutRefetchQuery(
			$status: LeadStatus!
			$first: Int!
			$filter: LeadsFilter!
			$sort: [LeadsSort!]
			$teamsFeature: Boolean!
		) {
			...Layout_data
				@arguments(status: $status, first: $first, filter: $filter, sort: $sort, teamsFeature: $teamsFeature)
		}
	`,
);
