import { useContext, useState } from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { EntryPoint } from 'Utils/EntryPoint';
import { WebappApiContext } from 'Components/WebappApiContext';
import { useRelayEnvironment } from '@pipedrive/relay';
import { Snackbar } from 'Components/SnackbarMessage/SnackbarContext';
import { useUnselectLead } from 'Hooks/useUnselectLead';
import { useRelayConnection } from 'Relay/connection/useRelayConnection';

import { fetchLatestLeadData } from './fetchLatestLeadData';
import { getDealPrefillData, isLeadAlreadyConverted } from './getDealPrefillData';
import { getPersonPrefillData } from './getPersonPrefillData';
import { getOrganizationPrefillData } from './getOrganizationPrefillData';
import { updateLeadAfterConvert } from './updateLeadAfterConvert';
import { getDealAddedTrackingData } from './getDealAddedTrackingData';

type DealApiResponse = {
	success: boolean;
	data?: {
		id: number;
		org_id?: number;
		person_id?: number;
	};
};

type UseConvertModal = {
	entryPoint: EntryPoint;
	onClose?: () => void;
	setSnackbar: Snackbar['setProps'];
};

export const useConvertModal = ({
	entryPoint,
	onClose,
	setSnackbar,
}: UseConvertModal): [(leadId: string) => void, boolean] => {
	const connectionHandler = useRelayConnection();
	const { componentLoader, userSelf } = useContext(WebappApiContext);
	const translator = useTranslator();
	const unselectLead = useUnselectLead();
	const RelayEnvironment = useRelayEnvironment();
	const [isLoading, setIsLoading] = useState(false);

	const closeLeadDetail = () => {
		onClose && onClose();

		// @todo we will need to check if this will be needed when LeadDetail
		// loaded outside leadbox
		unselectLead();
	};

	const openModal = async (leadId: string) => {
		setIsLoading(true);
		const latestLeadData = await fetchLatestLeadData(RelayEnvironment, leadId);

		const dealPrefill = getDealPrefillData(latestLeadData, userSelf);

		if (isLeadAlreadyConverted(dealPrefill)) {
			setSnackbar({
				message: translator.gettext('Lead was already converted.'),
				actionText: translator.gettext('Show'),
				href: `/deal/${dealPrefill.dealId}`,
			});
			setIsLoading(false);
			closeLeadDetail();

			return;
		}
		const personPrefill = getPersonPrefillData(latestLeadData);
		const organizationPrefill = getOrganizationPrefillData(latestLeadData);

		const metricsData = getDealAddedTrackingData(latestLeadData, entryPoint);

		const modals = await componentLoader.load('froot:modals');
		setIsLoading(false);

		modals.open('add-modals:froot', {
			type: 'deal',
			title: translator.gettext('Convert to deal'),
			prefill: dealPrefill,
			prefillRelatedEntities: {
				person: personPrefill,
				organization: organizationPrefill,
			},
			source: { type: 'lead' },
			metricsData,
			onSave: async (response: DealApiResponse) => {
				const dealId = response.data?.id;

				if (!dealId || !response.success) {
					throw new Error('Failed to create the deal via add deal modal.');
				}

				try {
					const markLeadAsConvertedForView = await updateLeadAfterConvert({
						relayEnvironment: RelayEnvironment,
						leadId,
						dealId,
						orgId: response.data?.org_id,
						personId: response.data?.person_id,
					});

					if (markLeadAsConvertedForView?.__typename === 'LeadTableRow' && markLeadAsConvertedForView.lead) {
						connectionHandler.deleteNode(
							markLeadAsConvertedForView.id,
							markLeadAsConvertedForView?.lead.isArchived ? 'ARCHIVED' : 'ALL',
						);
					}
				} catch (err) {
					throw new Error(`Could not update a lead after converting a lead to deal. Original error: ${err}`);
				}

				closeLeadDetail();
			},
		});
	};

	return [openModal, isLoading];
};
