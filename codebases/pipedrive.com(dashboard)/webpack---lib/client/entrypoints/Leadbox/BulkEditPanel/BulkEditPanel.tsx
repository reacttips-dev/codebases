import React, { useContext, useState, useCallback } from 'react';
import { Button } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { graphql } from '@pipedrive/relay';
import { useBulkMutations } from 'Leadbox/relay/useBulkMutations';
import { useUIContext } from 'Leadbox/useUIContext';
import { LeadboxFiltersContext } from 'Leadbox/LeadboxFiltersContext';
import { colors, fonts } from '@pipedrive/convention-ui-css/dist/js/variables';
import styled from 'styled-components';
import { useTracking } from 'Utils/metrics/useTracking';
import { bulkEditSaved, bulkEditCancelled } from 'Utils/metrics/events/bulk/bulkEdit';
import { getEmptiedFields, getReplacedFields } from 'Utils/metrics/events/bulk/utils/getTrackingFields';
import { useLeadFilterStatus } from 'Hooks/useLeadFilterStatus';
import { useListContext } from 'Leadbox/LeadsListView/context/ListProvider';

import { BulkEditFieldsList } from './BulkEditFieldsList';
import type {
	LeadsBulkUpdateDataInput,
	BulkEditPanelInnerUpdateLeadsBulkMutation,
} from './__generated__/BulkEditPanelInnerUpdateLeadsBulkMutation.graphql';
import type { BulkEditPanelInnerUpdateAllLeadsBulkMutation } from './__generated__/BulkEditPanelInnerUpdateAllLeadsBulkMutation.graphql';

const Wrapper = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
`;

const Title = styled.div`
	display: flex;
	align-items: center;
	flex: 0 0 46px;
	background: ${colors.white};
	padding: 10px 20px;
	font: ${fonts.fontTitleM};
	border-bottom: 1px solid ${colors.black12};
`;

const ContentWrapper = styled.div`
	overflow-y: auto;
	padding: 10px 20px;
	background: ${colors.black4};
	flex: 1 1 auto;
`;

const CancelButton = styled(Button)`
	margin-right: 8px;
`;

const ButtonsWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	flex: 0 0 48px;
	padding: 10px 20px;
	background: ${colors.white};
	border-top: 1px solid ${colors.black12};
`;

interface IProps {
	readonly resetSelection?: () => void;
}

export const BulkEditPanel: React.FC<IProps> = (props) => {
	const [bulkEditValue, setBulkEditValue] = useState<LeadsBulkUpdateDataInput>({});
	const { selectedRows } = useListContext();
	const inboxFilter = useContext(LeadboxFiltersContext);
	const leadFilterStatus = useLeadFilterStatus();
	const { sortedColumns } = useListContext();
	const uiContext = useUIContext();
	const translator = useTranslator();
	const tracking = useTracking();

	const idsCount = selectedRows.totalSelected;

	const [updateLeadsBulkMutation, updateAllLeadsBulkMutation] = useBulkMutations<
		BulkEditPanelInnerUpdateLeadsBulkMutation,
		BulkEditPanelInnerUpdateAllLeadsBulkMutation
	>(
		graphql`
			mutation BulkEditPanelInnerUpdateLeadsBulkMutation($ids: [ID!]!, $data: LeadsBulkUpdateDataInput!) {
				updateLeadsBulk(ids: $ids, data: $data) {
					... on BulkSuccessResult {
						__typename
					}
				}
			}
		`,
		graphql`
			mutation BulkEditPanelInnerUpdateAllLeadsBulkMutation(
				$excludeIds: [ID!]!
				$filter: LeadsFilter!
				$status: LeadStatus!
				$legacySort: LeadsLegacySort
				$sort: [LeadsSort!]
				$data: LeadsBulkUpdateDataInput!
			) {
				updateAllLeadsBulk(
					excludeIds: $excludeIds
					filter: $filter
					status: $status
					legacySort: $legacySort
					sort: $sort
					data: $data
				) {
					... on BulkSuccessResult {
						__typename
					}
				}
			}
		`,
	);

	const onSuccess = () => {
		props.resetSelection?.();
		tracking.trackEvent(
			bulkEditSaved({
				emptiedFields: getEmptiedFields<LeadsBulkUpdateDataInput>(bulkEditValue),
				replacedFields: getReplacedFields<LeadsBulkUpdateDataInput>(bulkEditValue),
				leadFilterStatus,
				totalVisibleCount: selectedRows.totalLeads,
				affectingEverything: selectedRows.selectedMode === 'ALL',
				totalSelectedCount: selectedRows.totalSelected,
			}),
		);
		uiContext.snackBar.setProps({
			message: translator.gettext('Selected leads were successfully updated'),
		});
	};

	const handleBulkUpdate = (): void => {
		if (selectedRows.selectedMode === 'ALL' || selectedRows.selectedMode === 'PARTIAL_EXCLUDING') {
			updateAllLeadsBulkMutation({
				variables: {
					excludeIds: selectedRows.selectedIds,
					filter: inboxFilter.get.filter,
					status: leadFilterStatus,
					sort: sortedColumns,
					data: bulkEditValue,
				},
				onCompleted: ({ updateAllLeadsBulk }) => {
					if (updateAllLeadsBulk?.__typename === 'BulkSuccessResult') {
						onSuccess();
					} else {
						uiContext.errorMessage.show();
					}
				},
			});
		} else {
			updateLeadsBulkMutation({
				variables: {
					ids: selectedRows.selectedIds,
					data: bulkEditValue,
				},
				onCompleted: ({ updateLeadsBulk }) => {
					if (updateLeadsBulk?.__typename === 'BulkSuccessResult') {
						onSuccess();
					} else {
						uiContext.errorMessage.show();
					}
				},
			});
		}
	};

	const handleBulkCancel = (): void => {
		props.resetSelection?.();
		tracking.trackEvent(
			bulkEditCancelled({
				emptiedFields: getEmptiedFields<LeadsBulkUpdateDataInput>(bulkEditValue),
				replacedFields: getReplacedFields<LeadsBulkUpdateDataInput>(bulkEditValue),
				leadFilterStatus,
				totalVisibleCount: selectedRows.totalLeads,
				affectingEverything: selectedRows.selectedMode === 'ALL',
				totalSelectedCount: selectedRows.totalSelected,
			}),
		);

		selectedRows.reset();
	};

	const handleOnValueChange = useCallback((newVal: LeadsBulkUpdateDataInput) => {
		setBulkEditValue((prevState) => ({
			...prevState,
			...newVal,
		}));
	}, []);

	const handleOnValueReset = useCallback((property: keyof LeadsBulkUpdateDataInput) => {
		setBulkEditValue((prevState: LeadsBulkUpdateDataInput) => {
			delete prevState[property];

			return prevState;
		});
	}, []);

	return (
		<Wrapper>
			<Title>{translator.ngettext('Bulk edit %d lead', 'Bulk edit %d leads', idsCount, idsCount)}</Title>
			<ContentWrapper>
				<BulkEditFieldsList onValueChange={handleOnValueChange} onValueReset={handleOnValueReset} />
			</ContentWrapper>
			<ButtonsWrapper>
				<CancelButton onClick={handleBulkCancel}>{translator.gettext('Cancel')}</CancelButton>
				<Button color="green" onClick={handleBulkUpdate}>
					{translator.gettext('Update')}
				</Button>
			</ButtonsWrapper>
		</Wrapper>
	);
};
