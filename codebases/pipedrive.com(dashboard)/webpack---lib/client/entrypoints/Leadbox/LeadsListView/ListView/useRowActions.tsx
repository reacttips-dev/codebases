import { GetRowActions } from '@pipedrive/list-view/dist/types';
import { useTranslator } from '@pipedrive/react-utils';
import { useConvertModal } from 'Components/ConvertToDealModal/useConvertModal';
import { DeleteProps } from 'Components/MenuLeadActions/Options/Delete';
import { useArchiveLead } from 'Components/MenuLeadActions/Options/hooks/useArchiveLead';
import { useDeleteLead } from 'Components/MenuLeadActions/Options/hooks/useDeleteLead';
import { ToggleArchiveProps } from 'Components/MenuLeadActions/Options/ToggleArchive';
import { WebappApiContext } from 'Components/WebappApiContext';
import { useUIContext } from 'Leadbox/useUIContext';
import { useCallback, useContext, useState } from 'react';
import { useRelayConnection } from 'Relay/connection/useRelayConnection';
import { EntryPoint } from 'Utils/EntryPoint';

import { ListViewContent_rows } from './__generated__/ListViewContent_rows.graphql';

interface Props {
	rows: ListViewContent_rows;
	customViewId?: string;
}

export const useRowActions = ({ rows, customViewId }: Props) => {
	const [isConfirmVisible, setConfirmVisible] = useState(false);
	const [leadToDelete, setLeadToDelete] = useState('');
	const connectionHandler = useRelayConnection();

	const { snackBar } = useUIContext();
	const { router } = useContext(WebappApiContext);
	const translator = useTranslator();

	const openConfirmDialog = () => setConfirmVisible(true);
	const closeConfirmDialog = () => {
		setConfirmVisible(false);
	};

	const onDelete: DeleteProps['onDelete'] = (deleteLead) => {
		if (deleteLead?.__typename === 'LeadTableRow' && deleteLead.lead) {
			connectionHandler.deleteNodePermanently(deleteLead.id, deleteLead.lead.isArchived ? 'ARCHIVED' : 'ALL');
		}
	};

	const { deleteHandler } = useDeleteLead({
		entryPoint: EntryPoint.LeadsList,
		onComplete: closeConfirmDialog,
		onDelete,
		customViewId,
	});

	const onDeleteConfirm = () => deleteHandler(leadToDelete);

	const [openConvertModal] = useConvertModal({
		setSnackbar: snackBar.setProps,
		entryPoint: EntryPoint.LeadsList,
	});

	const isArchive = router.getCurrentPath().includes('archived');

	const toggleArchiveHandler: ToggleArchiveProps['onChange'] = (updateLead, isArchive) => {
		if (updateLead?.__typename === 'LeadTableRow' && updateLead.lead) {
			connectionHandler.moveNode(updateLead.id, isArchive ? 'ARCHIVED' : 'ALL');
		}
	};

	const { archiveHandler } = useArchiveLead({
		entryPoint: EntryPoint.LeadsList,
		onChange: toggleArchiveHandler,
	});

	const getRowActions: GetRowActions = useCallback(() => {
		const actions: ReturnType<GetRowActions> = [];

		if (!isArchive) {
			actions.push({
				title: translator.gettext('Convert to deal'),
				handler: (rowId: number) => {
					const leadId = rows[rowId].lead?.id;
					if (!leadId) {
						throw new Error('Lead not found');
					}
					openConvertModal(leadId);
				},
			});
		}

		actions.push(
			{
				title: isArchive ? translator.gettext('Unarchive') : translator.gettext('Archive'),
				handler: (rowId: number) => {
					const leadId = rows[rowId].lead?.id;
					const leadIsArchived = rows[rowId].lead?.isArchived;

					if (!leadId) {
						throw new Error('Lead not found');
					}
					archiveHandler(!leadIsArchived, leadId);
				},
			},
			{
				type: 'SEPARATOR',
			},
			{
				title: translator.gettext('Delete'),
				handler: (rowId: number) => {
					const leadId = rows[rowId].lead?.id;
					if (!leadId) {
						throw new Error('Lead not found');
					}
					setLeadToDelete(leadId);
					openConfirmDialog();
				},
			},
		);

		return actions;
	}, [archiveHandler, isArchive, openConvertModal, rows, translator]);

	return {
		getRowActions,
		isConfirmVisible,
		closeConfirmDialog,
		onDeleteConfirm,
	};
};
