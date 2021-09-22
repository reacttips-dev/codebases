import React, { useContext } from 'react';
import { Button, Icon } from '@pipedrive/convention-ui-react';
import { graphql } from '@pipedrive/relay';
import { useBulkMutations } from 'Leadbox/relay/useBulkMutations';
import { useUIContext } from 'Leadbox/useUIContext';
import { LeadboxFiltersContext } from 'Leadbox/LeadboxFiltersContext';
import { useTranslator } from '@pipedrive/react-utils';
import { useTracking } from 'Utils/metrics/useTracking';
import { bulkDeleted } from 'Utils/metrics/events/bulk/bulkDeleted';
import { useLeadFilterStatus } from 'Hooks/useLeadFilterStatus';
import { useListContext } from 'Leadbox/LeadsListView/context/ListProvider';

import type { BulkDeleteButtonDeletePartialLeadsMutation } from './__generated__/BulkDeleteButtonDeletePartialLeadsMutation.graphql';
import type { BulkDeleteButtonDeleteAllLeadsMutation } from './__generated__/BulkDeleteButtonDeleteAllLeadsMutation.graphql';

interface IProps {
	readonly resetSelection?: () => void;
}

export const BulkDeleteButton: React.FC<IProps> = (props) => {
	const inboxFilter = useContext(LeadboxFiltersContext);
	const leadFilterStatus = useLeadFilterStatus();
	const { selectedRows, sortedColumns } = useListContext();
	const uiContext = useUIContext();
	const translator = useTranslator();
	const tracking = useTracking();

	const [deletePartialLeadsMutation, deleteAllLeadsMutation] = useBulkMutations<
		BulkDeleteButtonDeletePartialLeadsMutation,
		BulkDeleteButtonDeleteAllLeadsMutation
	>(
		graphql`
			mutation BulkDeleteButtonDeletePartialLeadsMutation($ids: [ID!]!) {
				deleteLeadsBulk(ids: $ids) {
					__typename
					... on BulkSuccessResult {
						changedRecordsCount
						...bulkDeleted_tracking_data
					}
				}
			}
		`,
		graphql`
			mutation BulkDeleteButtonDeleteAllLeadsMutation(
				$filter: LeadsFilter!
				$status: LeadStatus!
				$legacySort: LeadsLegacySort
				$sort: [LeadsSort!]
				$excludeIds: [ID!]!
			) {
				deleteAllLeadsBulk(
					filter: $filter
					status: $status
					legacySort: $legacySort
					sort: $sort
					excludeIds: $excludeIds
				) {
					__typename
					... on BulkSuccessResult {
						changedRecordsCount
						...bulkDeleted_tracking_data
					}
				}
			}
		`,
	);

	const showSuccessSnackbar = (): void => {
		uiContext.snackBar.setProps({
			message: translator.gettext('Selected leads were successfully deleted'),
		});
	};

	const bulkDeleteLeads = () => {
		if (selectedRows.selectedMode === 'ALL' || selectedRows.selectedMode === 'PARTIAL_EXCLUDING') {
			deleteAllLeadsMutation({
				variables: {
					filter: inboxFilter.get.filter,
					status: leadFilterStatus,
					sort: sortedColumns,
					excludeIds: selectedRows.selectedIds,
				},
				onCompleted: ({ deleteAllLeadsBulk }) => {
					if (deleteAllLeadsBulk?.__typename === 'BulkSuccessResult') {
						showSuccessSnackbar();
						props.resetSelection?.();
						tracking.trackEvent(
							bulkDeleted({
								leadFilterStatus,
								bulkResultRef: deleteAllLeadsBulk,
								rowsDisplayedCount: selectedRows.totalLeads,
								selectAllApplied: true,
							}),
						);
					} else {
						uiContext.errorMessage.show();
					}
				},
			});
		} else {
			deletePartialLeadsMutation({
				variables: {
					ids: selectedRows.selectedIds,
				},
				onCompleted: ({ deleteLeadsBulk }) => {
					if (deleteLeadsBulk?.__typename === 'BulkSuccessResult') {
						showSuccessSnackbar();
						tracking.trackEvent(
							bulkDeleted({
								leadFilterStatus,
								bulkResultRef: deleteLeadsBulk,
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

	const openDialog = () => {
		const text = translator.gettext('Are you sure you want to delete all selected leads?');
		const confirmButtonText = translator.gettext('Delete');
		uiContext.dialog.show({
			onConfirm: () => bulkDeleteLeads(),
			text,
			confirmButtonText,
		});
	};

	return (
		<Button onClick={openDialog}>
			<Icon icon="trash" size="s" />
		</Button>
	);
};
