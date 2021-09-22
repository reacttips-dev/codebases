import React from 'react';

import SimpleModal from '../../atoms/SimpleModal';
import { NewItemModal } from '../../shared';
import {
	NEW_MODAL_FROM_URL_PATH,
	UPSELL_MODAL_FROM_URL_PATH,
} from '../../pages/App/insightsWrapper/newReportFromUrl';
import GoalDetailsModal from '../../molecules/GoalDetailsModal';
import {
	ModalType,
	PERMISSION_TYPES,
	UrlEntityType,
} from '../../utils/constants';
import { ModalView } from '../../types/modal';
import useDashboardModalAndDialogOptions from '../../hooks/modalAndDialogOptions/useDashboardModalAndDialogOptions';
import useReportModalAndDialogOptions from '../../hooks/modalAndDialogOptions/useReportModalAndDialogOptions';
import useGoalModalOptions from '../../hooks/modalAndDialogOptions/useGoalModalOptions';
import { useAddGoalOptions } from '../../hooks/modalAndDialogOptions/goalDetailsModal';
import usePlanPermissions from '../../hooks/usePlanPermissions';
import SidemenuCreateNewModalLockedDialog from './SidemenuCreateNewModalLockedDialog';

interface SidemenuCreateNewModalProps {
	type: ModalView;
	itemId: string;
	itemType: string;
	visibleModal: ModalType;
	setVisibleModal: React.Dispatch<React.SetStateAction<ModalType>>;
	setVisibleUpsellModal?: React.Dispatch<React.SetStateAction<boolean>>;
	hasReachedReportsLimit?: boolean;
}

const handleNewModalFromUrl = (
	itemId: string,
	itemType: string,
	type: ModalView,
	setVisibleModal: React.Dispatch<React.SetStateAction<ModalType>>,
	setVisibleUpsellModal: React.Dispatch<React.SetStateAction<boolean>>,
	hasReachedReportsLimit: boolean,
): void => {
	if (
		![NEW_MODAL_FROM_URL_PATH, UPSELL_MODAL_FROM_URL_PATH].includes(itemId)
	) {
		return;
	}

	const showUpsellInsteadOfNewModalWhenLimitReached =
		hasReachedReportsLimit && itemId === NEW_MODAL_FROM_URL_PATH;
	const showUpsell =
		itemType === UrlEntityType.REPORT &&
		itemId === UPSELL_MODAL_FROM_URL_PATH &&
		hasReachedReportsLimit;

	if (showUpsell || showUpsellInsteadOfNewModalWhenLimitReached) {
		setVisibleUpsellModal(true);
		return;
	}

	if (itemType === UrlEntityType.DASHBOARD && type === ModalView.DASHBOARDS) {
		setVisibleModal(ModalType.DASHBOARD_CREATE);
	}

	if (itemType === UrlEntityType.REPORT && type === ModalView.REPORTS) {
		setVisibleModal(ModalType.REPORT_CREATE);
	}

	if (itemType === UrlEntityType.GOAL && type === ModalView.GOALS) {
		setVisibleModal(ModalType.GOAL_CREATE);
	}
};

const SidemenuCreateNewModal: React.FC<SidemenuCreateNewModalProps> = ({
	type,
	itemId,
	itemType,
	visibleModal,
	setVisibleModal,
	setVisibleUpsellModal,
	hasReachedReportsLimit,
}) => {
	const dashboardOptions = useDashboardModalAndDialogOptions();
	const reportOptions = useReportModalAndDialogOptions();
	const getGoalModalOptions = useGoalModalOptions();
	const { getAddGoalOptions } = useAddGoalOptions(setVisibleModal);
	const { hasPermission } = usePlanPermissions();
	const canHaveMultipleDashboards = hasPermission(
		PERMISSION_TYPES.static.haveMultipleDashboards,
	);

	const dashboardModalOptions = dashboardOptions({
		setVisibleModal,
	});

	const reportModalAndDialogOptions = reportOptions({
		setVisibleModal,
		reportId: itemId,
	});

	const goalModalOptions = getGoalModalOptions({
		setVisibleModal,
	});
	const modalOptions = {
		reports: reportModalAndDialogOptions.modal(),
		goals: goalModalOptions,
		dashboards: dashboardModalOptions.modal(),
	};

	handleNewModalFromUrl(
		itemId,
		itemType,
		type,
		setVisibleModal,
		setVisibleUpsellModal,
		hasReachedReportsLimit,
	);

	if (!visibleModal) {
		return null;
	}

	if (type === 'dashboards') {
		return canHaveMultipleDashboards ? (
			<SimpleModal
				{...(dashboardModalOptions.modal() as any)[visibleModal]()}
			/>
		) : (
			<SidemenuCreateNewModalLockedDialog
				setVisibleModal={setVisibleModal}
			/>
		);
	}

	if (visibleModal === ModalType.GOAL_CREATE_DETAILS) {
		return <GoalDetailsModal {...getAddGoalOptions()} />;
	}

	return <NewItemModal {...(modalOptions[type] as any)[visibleModal]()} />;
};

export default React.memo(SidemenuCreateNewModal);
