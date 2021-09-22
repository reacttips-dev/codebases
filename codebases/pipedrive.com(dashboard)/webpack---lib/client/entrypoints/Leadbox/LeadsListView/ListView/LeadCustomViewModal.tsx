/* eslint-disable relay/unused-fields */
import React, { useContext, useMemo } from 'react';
import { createFragmentContainer, graphql } from '@pipedrive/relay';
import { CustomViewModal } from 'Components/CustomViewModal/CustomViewModal';
import { WebappApiContext } from 'Components/WebappApiContext';
import { useListContext } from 'Leadbox/LeadsListView/context/ListProvider';
import { useInFlightState } from 'Leadbox/useUIContext';
import styled from 'styled-components';

import { LeadCustomViewModal_customView } from './__generated__/LeadCustomViewModal_customView.graphql';
import { mapToCustomViewField } from './mapToCustomViewField';

type Props = {
	customView?: LeadCustomViewModal_customView | null;
	toggleModal: (status?: boolean) => void;
	portalTo: React.RefObject<HTMLDivElement>;
};

const RESTRICTED_LEAD_FIELDS = new Set([
	'id',
	'seen',
	'next_activity_date',
	'next_activity_status',
	'source_reference_id',
	'deal_id',
	'org_address',
	'org_name',
	'person_email',
	'person_name',
	'person_phone',
	// we are not supporting deal_expected_close_date in Leads Inbox right now
	// but this field should be removed from the restricted list once it is supported
	'deal_expected_close_date',
]);

export const LeadCustomViewModalPortal = styled.div`
	position: absolute;
	right: 4px;
	top: 94px;
	z-index: 20;
	width: 370px;
`;

export const LeadCustomViewModalWithoutData = ({ customView, toggleModal, portalTo }: Props) => {
	const { fields, trackUsage } = useContext(WebappApiContext);
	const { relayList } = useListContext();
	const inFlight = useInFlightState();

	const selectedFields = useMemo(
		() =>
			(customView?.fields ?? []).flatMap((field) => {
				if (field && field.fieldDefinition?.key && field.fieldDefinition?.entityType) {
					return [
						{
							itemType: field.fieldDefinition.entityType,
							key: field.fieldDefinition.key,
						},
					];
				}

				return [];
			}),
		[customView?.fields],
	);

	const areColumnsSavedWithFilter = !!customView?.filter;
	const customViewId = parseInt(customView?.customViewId ?? '', 10);
	const refetchList = async () => {
		inFlight.setIsActive(true);
		await relayList?.refetch();
		inFlight.setIsActive(false);
	};

	return (
		<CustomViewModal
			portalTo={portalTo}
			onClose={() => toggleModal(false)}
			onSubmitFieldVisibilityOptions={refetchList}
			onSelectDefaultCustomView={refetchList}
			customViewFields={selectedFields}
			customViewId={customViewId}
			areColumnsSavedWithFilter={areColumnsSavedWithFilter}
			entityFields={{
				lead: fields.lead.filter((e) => !RESTRICTED_LEAD_FIELDS.has(e.key)).map(mapToCustomViewField),
				person: fields.person.map(mapToCustomViewField),
				organization: fields.organization.map(mapToCustomViewField),
			}}
			tracking={{
				trackUsage,
				view: 'leads_inbox',
				listViewType: 'lead',
			}}
		/>
	);
};

export const LeadCustomViewModal = createFragmentContainer(LeadCustomViewModalWithoutData, {
	customView: graphql`
		fragment LeadCustomViewModal_customView on CustomView {
			customViewId: id(opaque: false)
			fields {
				fieldDefinition {
					entityType
					key
				}
				width
				sortDirection
				sortSequence
			}
			filter {
				id
			}
		}
	`,
});
