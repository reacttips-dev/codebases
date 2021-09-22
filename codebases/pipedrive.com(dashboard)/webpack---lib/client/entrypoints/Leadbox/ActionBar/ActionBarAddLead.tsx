import React, { useContext } from 'react';
import { Spinner } from '@pipedrive/convention-ui-react';
import { LeadboxFiltersContext } from 'Leadbox/LeadboxFiltersContext';
import { createFragmentContainer, graphql } from '@pipedrive/relay';
import { useTranslator } from '@pipedrive/react-utils';
import styled from 'styled-components';
import { useLeadFilterStatus } from 'Hooks/useLeadFilterStatus';

import { AddLeadButton } from './AddLeadButton/AddLeadButton';
import { LabelsFilter } from './LabelsFilter/LabelsFilter';
import { GlobalFilter } from './GlobalFilter/GlobalFilter';
import { SourceFilter } from './SourceFilter/SourceFilter';
import * as S from './ActionBar.styles';
import type { ActionBarAddLead_data } from './__generated__/ActionBarAddLead_data.graphql';
import type { ActionBarAddLead_leadView } from './__generated__/ActionBarAddLead_leadView.graphql';

type Props = {
	readonly data: ActionBarAddLead_data | null;
	readonly leadView: ActionBarAddLead_leadView | null;
	readonly isRefetching: boolean;
};

const LeadsCount = styled.div`
	padding-left: 16px;
	padding-right: 16px;
`;

const ActionBarAddLeadWithoutData: React.FC<Props> = ({ data, leadView, isRefetching }) => {
	const inboxFilters = useContext(LeadboxFiltersContext);
	const translator = useTranslator();
	const leadFilterStatus = useLeadFilterStatus();

	const totalCount = leadView?.totalCount ?? 0;
	const isEmptyWithoutFilters = totalCount === 0 && inboxFilters.is.active === false;

	const isInArchive = leadFilterStatus === 'ARCHIVED';

	return (
		<>
			<S.Section data-testid="ActionBarAddLead">{!isInArchive && <AddLeadButton />}</S.Section>
			<S.Section data-testid="ActionBarFilters" hasMarginsOnFilters>
				{isRefetching && <Spinner light />}
				{data && !isEmptyWithoutFilters && (
					<>
						{totalCount > 0 && (
							<LeadsCount>
								{translator.ngettext('%d lead', '%d leads', totalCount, totalCount)}
							</LeadsCount>
						)}
						<SourceFilter data={data} />
						<LabelsFilter data={data} />
						<GlobalFilter data={data} />
					</>
				)}
			</S.Section>
		</>
	);
};

export const ActionBarAddLead = createFragmentContainer(ActionBarAddLeadWithoutData, {
	leadView: graphql`
		fragment ActionBarAddLead_leadView on LeadTableConnection {
			totalCount: count
		}
	`,
	data: graphql`
		fragment ActionBarAddLead_data on RootQuery @argumentDefinitions(teamsFeature: { type: "Boolean!" }) {
			...SourceFilter_data
			...LabelsFilter_data
			...GlobalFilter_data @arguments(teamsFeature: $teamsFeature)
		}
	`,
});
