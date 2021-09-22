import React, { useContext } from 'react';
import { Button, Icon } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import styled from 'styled-components';
import { graphql } from '@pipedrive/relay';
import { useBulkMutations } from 'Leadbox/relay/useBulkMutations';
import { useUIContext } from 'Leadbox/useUIContext';
import { useTracking } from 'Utils/metrics/useTracking';
import { bulkArchived } from 'Utils/metrics/events/bulk/bulkArchived';
import { LeadboxFiltersContext } from 'Leadbox/LeadboxFiltersContext';
import { useLeadFilterStatus } from 'Hooks/useLeadFilterStatus';
import { useListContext } from 'Leadbox/LeadsListView/context/ListProvider';

import type { BulkArchiveButtonArchiveAllMutation } from './__generated__/BulkArchiveButtonArchiveAllMutation.graphql';
import type { BulkArchiveButtonArchivePartialMutation } from './__generated__/BulkArchiveButtonArchivePartialMutation.graphql';

const ArchiveButton = styled(Button)`
	margin-right: 8px;
`;

interface IProps {
	readonly resetSelection?: () => void;
}

export const BulkArchiveButton: React.FC<IProps> = (props) => {
	const translator = useTranslator();
	const inboxFilter = useContext(LeadboxFiltersContext);
	const { selectedRows, sortedColumns } = useListContext();
	const leadFilterStatus = useLeadFilterStatus();
	const uiContext = useUIContext();
	const tracking = useTracking();

	const [archivePartialMutation, archiveAllMutation] = useBulkMutations<
		BulkArchiveButtonArchivePartialMutation,
		BulkArchiveButtonArchiveAllMutation
	>(
		graphql`
			mutation BulkArchiveButtonArchivePartialMutation($ids: [ID!]!) {
				archiveLeadsBulk(ids: $ids) {
					__typename
					... on BulkSuccessResult {
						changedRecordsCount
						...bulkArchived_tracking_data
					}
				}
			}
		`,
		graphql`
			mutation BulkArchiveButtonArchiveAllMutation(
				$filter: LeadsFilter!
				$status: LeadStatus!
				$legacySort: LeadsLegacySort
				$sort: [LeadsSort!]
				$excludeIds: [ID!]!
			) {
				archiveAllLeadsBulk(
					filter: $filter
					status: $status
					legacySort: $legacySort
					sort: $sort
					excludeIds: $excludeIds
				) {
					__typename
					... on BulkSuccessResult {
						changedRecordsCount
						...bulkArchived_tracking_data
					}
				}
			}
		`,
	);

	const showSuccessSnackbar = (): void => {
		uiContext.snackBar.setProps({
			message: translator.gettext('Selected leads were successfully archived'),
		});
	};

	const bulkArchiveLeads = () => {
		if (selectedRows.selectedMode === 'ALL' || selectedRows.selectedMode === 'PARTIAL_EXCLUDING') {
			const excludedIds = selectedRows.selectedIds;
			archiveAllMutation({
				variables: {
					filter: inboxFilter.get.filter,
					status: leadFilterStatus,
					sort: sortedColumns,
					excludeIds: excludedIds,
				},
				onCompleted: ({ archiveAllLeadsBulk }) => {
					if (archiveAllLeadsBulk?.__typename === 'BulkSuccessResult') {
						showSuccessSnackbar();
						props.resetSelection?.();
						tracking.trackEvent(bulkArchived(archiveAllLeadsBulk, selectedRows.totalLeads, true));
					} else {
						uiContext.errorMessage.show();
					}
				},
			});
		} else {
			const includedIds = selectedRows.selectedIds;
			archivePartialMutation({
				variables: { ids: includedIds },
				onCompleted: ({ archiveLeadsBulk }) => {
					if (archiveLeadsBulk?.__typename === 'BulkSuccessResult') {
						showSuccessSnackbar();
						tracking.trackEvent(bulkArchived(archiveLeadsBulk, selectedRows.totalLeads, false));
					} else {
						uiContext.errorMessage.show();
					}
				},
			});
		}
	};

	const openConfirmationDialog = (): void => {
		uiContext.dialog.show({
			onConfirm: () => bulkArchiveLeads(),
			text: translator.gettext('Are you sure you want to archive all selected leads?'),
			confirmButtonText: translator.gettext('Archive'),
		});
	};

	return (
		<ArchiveButton onClick={openConfirmationDialog}>
			<Icon icon="archive" size="s" />
			{translator.gettext('Archive')}
		</ArchiveButton>
	);
};
