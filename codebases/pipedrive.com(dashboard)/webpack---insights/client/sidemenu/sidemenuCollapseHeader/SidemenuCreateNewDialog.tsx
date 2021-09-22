import React from 'react';

import Dialog from '../../atoms/Dialog';
import { ModalType, DialogType } from '../../utils/constants';
import { ModalView } from '../../types/modal';
import useReportModalAndDialogOptions from '../../hooks/modalAndDialogOptions/useReportModalAndDialogOptions';

interface SidemenuCreateNewDialogProps {
	type: ModalView;
	itemId: string;
	visibleDialog: DialogType;
	setVisibleDialog: React.Dispatch<React.SetStateAction<DialogType>>;
	setVisibleModal: React.Dispatch<React.SetStateAction<ModalType>>;
}

const SidemenuCreateNewDialog: React.FC<SidemenuCreateNewDialogProps> = ({
	type,
	itemId,
	setVisibleModal,
	visibleDialog,
	setVisibleDialog,
}) => {
	const reportOptions = useReportModalAndDialogOptions();

	const MODAL_TYPES = {
		[ModalView.DASHBOARDS]: ModalType.DASHBOARD_CREATE,
		[ModalView.GOALS]: ModalType.GOAL_CREATE,
		[ModalView.REPORTS]: ModalType.REPORT_CREATE,
	};
	const modalType = MODAL_TYPES[type];

	const reportModalAndDialogOptions = reportOptions({
		setVisibleModal,
		setVisibleDialog,
		reportId: itemId,
	});

	if (!visibleDialog) {
		return null;
	}

	return (
		<Dialog
			{...(reportModalAndDialogOptions.dialog() as any)[visibleDialog](
				() => setVisibleModal(modalType),
			)}
		/>
	);
};

export default React.memo(SidemenuCreateNewDialog);
