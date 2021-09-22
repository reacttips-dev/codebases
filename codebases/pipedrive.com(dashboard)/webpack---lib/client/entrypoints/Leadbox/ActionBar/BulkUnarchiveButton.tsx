import React, { useContext } from 'react';
import { Button, Icon } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import styled from 'styled-components';
import { graphql } from '@pipedrive/relay';
import { useBulkMutations } from 'Leadbox/relay/useBulkMutations';
import { useUIContext } from 'Leadbox/useUIContext';
import { useTracking } from 'Utils/metrics/useTracking';
import { bulkUnarchived } from 'Utils/metrics/events/bulk/bulkUnarchived';
import { LeadboxFiltersContext } from 'Leadbox/LeadboxFiltersContext';
import { useLeadFilterStatus } from 'Hooks/useLeadFilterStatus';
import { useListContext } from 'Leadbox/LeadsListView/context/ListProvider';

import type { BulkUnarchiveButtonUnarchiveAllMutation } from './__generated__/BulkUnarchiveButtonUnarchiveAllMutation.graphql';
import type { BulkUnarchiveButtonUnrchivePartialMutation } from './__generated__/BulkUnarchiveButtonUnrchivePartialMutation.graphql';

const UnarchiveButton = styled(Button)`
	margin-right: 8px;
`;

interface IProps {
	readonly resetSelection?: () => void;
}

export const BulkUnarchiveButton: React.FC<IProps> = (props) => {
	const translator = useTranslator();
	const inboxFilter = useContext(LeadboxFiltersContext);
	const leadFilterStatus = useLeadFilterStatus();
	const { selectedRows, sortedColumns } = useListContext();
	const uiContext = useUIContext();
	const tracking = useTracking();

	const [unarchivePartialMutation, unarchiveAllMutation] = useBulkMutations<
		BulkUnarchiveButtonUnrchivePartialMutation,
		BulkUnarchiveButtonUnarchiveAllMutation
	>(
		graphql`
			mutation BulkUnarchiveButtonUnrchivePartialMutation($ids: [ID!]!) {
				unarchiveLeadsBulk(ids: $ids) {
					__typename
					... on BulkSuccessResult {
						changedRecordsCount
						...bulkUnarchived_tracking_data
					}
				}
			}
		`,
		graphql`
			mutation BulkUnarchiveButtonUnarchiveAllMutation(
				$filter: LeadsFilter!
				$status: LeadStatus!
				$legacySort: LeadsLegacySort
				$sort: [LeadsSort!]
				$excludeIds: [ID!]!
			) {
				unarchiveAllLeadsBulk(
					filter: $filter
					status: $status
					legacySort: $legacySort
					sort: $sort
					excludeIds: $excludeIds
				) {
					__typename
					... on BulkSuccessResult {
						changedRecordsCount
						...bulkUnarchived_tracking_data
					}
				}
			}
		`,
	);

	const showSuccessSnackbar = (): void => {
		uiContext.snackBar.setProps({
			message: translator.gettext('Selected leads were successfully unarchived'),
		});
	};

	const bulkUnarchiveLeads = () => {
		if (selectedRows.selectedMode === 'ALL' || selectedRows.selectedMode === 'PARTIAL_EXCLUDING') {
			const excludedIds = selectedRows.selectedIds;
			unarchiveAllMutation({
				variables: {
					filter: inboxFilter.get.filter,
					status: leadFilterStatus,
					sort: sortedColumns,
					excludeIds: excludedIds,
				},
				onCompleted: ({ unarchiveAllLeadsBulk }) => {
					if (unarchiveAllLeadsBulk?.__typename === 'BulkSuccessResult') {
						showSuccessSnackbar();
						props.resetSelection?.();
						tracking.trackEvent(
							bulkUnarchived({
								leadFilterStatus,
								bulkResultRef: unarchiveAllLeadsBulk,
								rowsDisplayedCount: selectedRows.totalLeads,
								selectAllApplied: true,
							}),
						);
					} else {
						uiContext.errorMessage.show();
					}
				},
			});
		}

		if (selectedRows.selectedMode === 'PARTIAL_INCLUDING') {
			const includedIds = selectedRows.selectedIds;
			unarchivePartialMutation({
				variables: { ids: includedIds },
				onCompleted: ({ unarchiveLeadsBulk }) => {
					if (unarchiveLeadsBulk?.__typename === 'BulkSuccessResult') {
						showSuccessSnackbar();
						tracking.trackEvent(
							bulkUnarchived({
								leadFilterStatus,
								bulkResultRef: unarchiveLeadsBulk,
								rowsDisplayedCount: selectedRows.totalLeads,
								selectAllApplied: false,
							}),
						);
					} else {
						uiContext.errorMessage.show();
					}
				},
			});
		}
	};

	const openConfirmationDialog = (): void => {
		uiContext.dialog.show({
			onConfirm: () => bulkUnarchiveLeads(),
			text: translator.gettext('Are you sure you want to unarchive all selected leads?'),
			confirmButtonText: translator.gettext('Unarchive'),
		});
	};

	return (
		<UnarchiveButton onClick={openConfirmationDialog}>
			<Icon icon="ac-uparrow" size="s" />
			{translator.gettext('Unarchive')}
		</UnarchiveButton>
	);
};
