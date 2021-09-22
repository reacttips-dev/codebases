import React, { useCallback, useEffect } from 'react';
import { ConvertDealToLeadStatus } from 'Components/ConvertDealToLeadStatus/ConvertDealToLeadStatus';
import { ActionBar } from 'Leadbox/ActionBar/ActionBar';
import { BulkEditPanelWrapper } from 'Leadbox/BulkEditPanel/BulkEditPanelWrapper';
import { useListViewContext } from '@pipedrive/list-view';
import { useLeadFilterStatus } from 'Hooks/useLeadFilterStatus';
import { createFragmentContainer, graphql } from '@pipedrive/relay';

import { useListContext } from './context/ListProvider';
import type { LayoutHeader_data } from './__generated__/LayoutHeader_data.graphql';
import type { LayoutHeader_leadView } from './__generated__/LayoutHeader_leadView.graphql';
import { LeadsListInFlightOverlay } from './LeadsListInFlightOverlay';
import { LeadsListErrorMessage } from './ListView/LeadsListErrorMessage';

type Props = {
	data: LayoutHeader_data | null;
	leadView: LayoutHeader_leadView | null;
};

export const LayoutHeaderWithoutData = (props: Props) => {
	const { relayList } = useListContext();
	const listViewContext = useListViewContext();
	const leadFilterStatus = useLeadFilterStatus();

	// For the new list-view we pass this callback as a prop to all places where it's needed
	// We can most likely remove this and use directly `useListViewContext` where it's needed
	// when the old list view will be removed
	const resetSelection = useCallback(() => listViewContext.actions?.unselectAllRows(), [listViewContext.actions]);

	useEffect(() => {
		resetSelection();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [leadFilterStatus]);

	return (
		<div>
			<LeadsListInFlightOverlay />
			<LeadsListErrorMessage />
			<ActionBar data={props.data} leadView={props.leadView} resetSelection={resetSelection} />
			<ConvertDealToLeadStatus relayRefetch={relayList.refetch} />
			<BulkEditPanelWrapper resetSelection={resetSelection} />
		</div>
	);
};

export const LayoutHeader = createFragmentContainer(LayoutHeaderWithoutData, {
	leadView: graphql`
		fragment LayoutHeader_leadView on LeadTableConnection {
			...ActionBar_leadView
		}
	`,
	data: graphql`
		fragment LayoutHeader_data on RootQuery @argumentDefinitions(teamsFeature: { type: "Boolean!" }) {
			...ActionBar_data @arguments(teamsFeature: $teamsFeature)
		}
	`,
});
