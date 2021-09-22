import React, { useContext, useMemo } from 'react';
import { graphql, QueryRendererSilent } from '@pipedrive/relay';
import styled from 'styled-components';
import { colors } from '@pipedrive/convention-ui-css/dist/js/variables';
import { useLeadFilterStatus } from 'Hooks/useLeadFilterStatus';
import { LIST_PAGE_SIZE } from 'Relay/constants';
import { LeadboxFiltersContext } from 'Leadbox/LeadboxFiltersContext';
import { WebappApiContext } from 'Components/WebappApiContext';

import { Layout } from './Layout';
import type { LeadsListViewQuery } from './__generated__/LeadsListViewQuery.graphql';

const Wrapper = styled.section`
	display: flex;
	flex-grow: 1;
	overflow: hidden;
	flex-direction: column;
	background-color: ${colors.black4Opaque};

	.cui4-table.cui4-table--full-width {
		height: 100%;
	}
	.cui4-table__body-sections {
		border-bottom: 1px solid ${colors.black12Opaque};
	}
	// Temporary, while this is not updated
	// on the CUI directly
	.cui4-table-wrapper {
		overflow-y: hidden;
	}
`;

const query = graphql`
	query LeadsListViewQuery($first: Int!, $status: LeadStatus!, $filter: LeadsFilter, $teamsFeature: Boolean!) {
		...Layout_data @arguments(status: $status, first: $first, filter: $filter, teamsFeature: $teamsFeature)
	}
`;

export const LeadsListView = () => {
	const leadFilterStatus = useLeadFilterStatus();
	const filterContext = useContext(LeadboxFiltersContext);
	const { teamsFeature } = useContext(WebappApiContext);

	const queryVariables = useMemo(
		() => ({
			first: LIST_PAGE_SIZE,
			status: leadFilterStatus,
			filter: {
				...filterContext.get.filter,
				useStoredFilters: !filterContext.is.initialized,
			},
			teamsFeature,
		}),
		// We want to get fresh values only when this component renders or when we change the
		// status (transition Inbox <-> Archive). Rest of the filters are being managed by child
		// component with refresh container to achieve smooth UI.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[leadFilterStatus],
	);

	return (
		<Wrapper>
			<QueryRendererSilent<LeadsListViewQuery>
				query={query}
				variables={queryVariables}
				render={(data) => {
					return data ? <Layout data={data} /> : null;
				}}
			/>
		</Wrapper>
	);
};
