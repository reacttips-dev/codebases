import { Icon, Tooltip } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { createFragmentContainer, graphql } from '@pipedrive/relay';
import { WebappApiContext } from 'Components/WebappApiContext';
import { useLeadFilterStatus } from 'Hooks/useLeadFilterStatus';
import { useIsArchivedRoute } from 'Hooks/useRoutes';
import React, { useContext, useEffect, useState } from 'react';
import { LeadboxRoutes } from 'Utils/LeadboxRoutes';
import { useInFlightState } from 'Leadbox/useUIContext';
import { useFeatureFlags } from 'Hooks/useFeatureFlags';
import { ReportInaccurateLeadModal } from 'Leadbox/ActionBar/ReportInaccurateLeadModal/ReportInaccurateLeadModal';
import { useListContext } from 'Leadbox/LeadsListView/context/ListProvider';

import * as S from './ActionBar.styles';
import { ActionBarAddLead } from './ActionBarAddLead';
import { ActionBarBulkActions } from './ActionBarBulkActions';
import type { ActionBar_data } from './__generated__/ActionBar_data.graphql';
import { MoreActions } from './MoreActions/MoreActions';
import type { ActionBar_leadView } from './__generated__/ActionBar_leadView.graphql';

type Props = {
	readonly data: ActionBar_data | null;
	readonly leadView: ActionBar_leadView | null;
	readonly resetSelection?: () => void;
};

function hasNoLead(data: ActionBar_data | null) {
	const inboxLeadsCount = data?.inboxCount;
	const archivedLeadsCount = data?.archivedCount;

	return inboxLeadsCount === 0 && archivedLeadsCount === 0;
}

function useEmptyArchiveRedirect(data: ActionBar_data | null, isInFlight: boolean) {
	const { router } = useContext(WebappApiContext);
	const isInArchive = useIsArchivedRoute();

	useEffect(() => {
		if (data === null) {
			// do nothing, data not loaded yet
			return;
		}

		if (isInArchive && hasNoLead(data) && !isInFlight) {
			// Redirect in case all archived leads are removed in order to display Add lead button
			router.navigateTo(`/leads${LeadboxRoutes.Inbox}`);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isInFlight]);
}

function useIsDataLoaded(data: ActionBar_data | null) {
	const [isDataLoaded, setIsDataLoaded] = useState(false);

	useEffect(() => {
		if (data === null) {
			// do nothing, data not loaded yet
			return;
		}

		if (hasNoLead(data)) {
			setIsDataLoaded(false);
		} else {
			setIsDataLoaded(true);
		}
	}, [data]);

	return isDataLoaded;
}

const ActionBarWithoutData: React.FC<Props> = ({ data, leadView, resetSelection }) => {
	const translator = useTranslator();
	const isDataLoaded = useIsDataLoaded(data);
	const { selectedRows, relayList } = useListContext();
	const leadFilterStatus = useLeadFilterStatus();
	const inFlight = useInFlightState();
	const [LEADS_EXPORT, PROSPECTOR_OPTIMIZED_FLOWS] = useFeatureFlags(['LEADS_EXPORT', 'PROSPECTOR_OPTIMIZED_FLOWS']);

	useEmptyArchiveRedirect(data, inFlight.isActive);

	const isInAllSection = leadFilterStatus === 'ALL';
	const isInArchivedSection = leadFilterStatus === 'ARCHIVED';
	const isLeadSelected = selectedRows.hasRowSelected;

	return (
		<S.ActionBarWrapper id="action-bar-wrapper">
			{isDataLoaded && (
				<S.Buttons $displayBorderSeparator={isInAllSection || isLeadSelected}>
					<a href={`/leads${LeadboxRoutes.Inbox}`}>
						<Tooltip content={translator.gettext('Inbox')} placement="bottom">
							<S.IconButton active={isInAllSection}>
								<Icon icon="inbox" size="s" />
							</S.IconButton>
						</Tooltip>
					</a>
					<a href={`/leads${LeadboxRoutes.Archived}`}>
						<Tooltip content={translator.gettext('Archive')} placement="bottom">
							<S.IconButton active={isInArchivedSection}>
								<Icon icon="archive" size="s" />
							</S.IconButton>
						</Tooltip>
					</a>
				</S.Buttons>
			)}

			<S.Wrapper isLastInRow={!LEADS_EXPORT}>
				{isLeadSelected ? (
					<ActionBarBulkActions isRefetching={relayList.loading} resetSelection={resetSelection} />
				) : (
					<ActionBarAddLead isRefetching={relayList.loading} leadView={leadView} data={data} />
				)}
			</S.Wrapper>
			{(LEADS_EXPORT || PROSPECTOR_OPTIMIZED_FLOWS) && isDataLoaded && (
				<MoreActions isLeadSelected={isLeadSelected} />
			)}
			<ReportInaccurateLeadModal />
		</S.ActionBarWrapper>
	);
};

export const ActionBar = createFragmentContainer(ActionBarWithoutData, {
	leadView: graphql`
		fragment ActionBar_leadView on LeadTableConnection {
			...ActionBarAddLead_leadView
		}
	`,
	data: graphql`
		fragment ActionBar_data on RootQuery @argumentDefinitions(teamsFeature: { type: "Boolean!" }) {
			...ActionBarAddLead_data @arguments(teamsFeature: $teamsFeature)
			inboxCount: leadsCount(page: INBOX)
			archivedCount: leadsCount(page: ARCHIVE)
		}
	`,
});
