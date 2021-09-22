import React, { useState } from 'react';
import classNames from 'classnames';
import { Button, Icon, Tooltip } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { removeLastChar } from '../../utils/helpers';
import { SidemenuSettings } from '../../types/apollo-query-types';
import {
	ModalType,
	DialogType,
	SideMenuItemGroup,
} from '../../utils/constants';
import { ModalView } from '../../types/modal';
import SidemenuCreateNewModal from './SidemenuCreateNewModal';
import SidemenuCreateNewDialog from './SidemenuCreateNewDialog';
import BulkDeleteModal from '../../shared/bulkDeleteModal/BulkDeleteModal';
import { MenuItem } from '../../pages/App/insightsWrapper/sideMenuUtils';
import { goalsState } from '../../api/vars/goalsState';
import CappingCounter from '../../atoms/CappingCounter';
import CappingUsagePopover from '../../atoms/CappingUsagePopover';
import CappingUpsellModal from '../../atoms/CappingUpsellModal';
import { getCapMapping, getCappings } from '../../api/commands/capping';
import { CAPPING_REPORT_KEY } from '../../shared/featureCapping/cappingConstants';
import localState from '../../utils/localState';
import {
	getReportsLimitData,
	getNextTierLimit,
	showCappingFeatures,
} from '../../shared/featureCapping/cappingUtils';

import styles from './SidemenuCollapseHeader.pcss';

interface SidemenuCollapseHeaderProps {
	type: keyof SidemenuSettings;
	collapsed: boolean;
	setCollapsed: (type: boolean) => void;
	isCollapsingDisabled: boolean;
	isNewReport: boolean;
	isEditingReport: boolean;
	itemId: string;
	itemType: string;
	items: MenuItem[];
}

const SidemenuCollapseHeader: React.FC<SidemenuCollapseHeaderProps> = ({
	type,
	collapsed,
	setCollapsed,
	isCollapsingDisabled,
	isNewReport,
	isEditingReport,
	itemId,
	itemType,
	items,
}) => {
	const translator = useTranslator();
	const typeForTranslation = removeLastChar(type);
	const isGoal = type === ModalView.GOALS;
	const isReport = type === SideMenuItemGroup.REPORTS;
	const { cap: cappingLimit } = getCappings();
	const { nextTier, mapping } = getCapMapping();
	const { getCurrentUserSettings } = localState();
	const { reports } = getCurrentUserSettings();
	const { numberOfReports, hasReachedReportsLimit } = getReportsLimitData(
		reports,
		cappingLimit,
	);
	const nextTierLimit = getNextTierLimit({
		nextTier,
		cappingKey: CAPPING_REPORT_KEY,
		mapping,
	});

	const { error: goalsError } = goalsState();
	const [visibleModal, setVisibleModal] = useState<ModalType>(null);
	const [visibleDialog, setVisibleDialog] = useState<DialogType>(null);
	const [visibleUpsellModal, setVisibleUpsellModal] =
		useState<boolean>(false);

	const isAddingDisabledBeforeDiscard = isNewReport || isEditingReport;

	const MODAL_TYPES = {
		[ModalView.DASHBOARDS]: ModalType.DASHBOARD_CREATE,
		[ModalView.GOALS]: ModalType.GOAL_CREATE,
		[ModalView.REPORTS]: ModalType.REPORT_CREATE,
	};

	const handleCollapseClick = () =>
		!isCollapsingDisabled && setCollapsed(!collapsed);

	const add = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (e) {
			e.stopPropagation();
		}

		if (hasReachedReportsLimit) {
			setVisibleUpsellModal(true);

			return;
		}

		if (isAddingDisabledBeforeDiscard) {
			const dialogType = isNewReport
				? DialogType.REPORT_DISCARD
				: DialogType.REPORT_DISCARD_CHANGES;

			setVisibleDialog(dialogType);
		} else {
			const modalType = MODAL_TYPES[type];

			setVisibleModal(modalType);
		}
	};

	const headerSectionLabels = {
		dashboards: translator.gettext('dashboards'),
		goals: translator.gettext('goals'),
		reports: translator.gettext('reports'),
	} as any;

	const shouldShowCappingInformation = (isReport: boolean) =>
		isReport && showCappingFeatures(false);

	const renderCappingInformation = (isReport: boolean) => {
		if (!shouldShowCappingInformation(isReport)) {
			return null;
		}

		return (
			<>
				<CappingCounter
					usage={numberOfReports}
					cappingLimit={cappingLimit}
				/>
				<CappingUsagePopover
					usage={numberOfReports}
					cappingLimit={cappingLimit}
					nextTierLimit={nextTierLimit}
				/>
				{visibleUpsellModal && (
					<CappingUpsellModal
						visible={visibleUpsellModal}
						setVisible={setVisibleUpsellModal}
					/>
				)}
			</>
		);
	};

	return (
		<>
			<div
				className={classNames(styles.header, {
					[styles.disabled]: isCollapsingDisabled,
				})}
				role="button"
				tabIndex={0}
				{...(!isReport &&
					!showCappingFeatures(false) && {
						onClick: handleCollapseClick,
					})}
				onKeyPress={handleCollapseClick}
			>
				<span
					className={styles.text}
					{...(shouldShowCappingInformation && {
						onClick: handleCollapseClick,
					})}
				>
					{headerSectionLabels[type]}
					{isGoal}
					<Icon
						icon={collapsed ? 'arrow-right' : 'arrow-down'}
						color="black"
						className={styles.icon}
					/>
				</span>
				<div className={styles.headerRightSideActions}>
					{renderCappingInformation(isReport)}
					{showCappingFeatures(false) && isReport && (
						<BulkDeleteModal items={items} />
					)}
					{!showCappingFeatures(false) && (
						<Tooltip
							placement="top"
							portalTo={document.body}
							className={styles.tooltip}
							content={
								<span>
									{translator.gettext(
										'Add new %s',
										typeForTranslation,
									)}
								</span>
							}
						>
							<Button
								data-test={`${type}-create-button`}
								size="s"
								onClick={add}
								disabled={isGoal && !!goalsError}
							>
								<Icon icon="plus" size="s" />
							</Button>
						</Tooltip>
					)}
				</div>
			</div>
			{isAddingDisabledBeforeDiscard ? (
				<SidemenuCreateNewDialog
					type={type as ModalView}
					visibleDialog={visibleDialog}
					setVisibleDialog={setVisibleDialog}
					setVisibleModal={setVisibleModal}
					itemId={itemId}
				/>
			) : (
				<SidemenuCreateNewModal
					type={type as ModalView}
					visibleModal={visibleModal}
					setVisibleModal={setVisibleModal}
					itemId={itemId}
					itemType={itemType}
					setVisibleUpsellModal={setVisibleUpsellModal}
					hasReachedReportsLimit={hasReachedReportsLimit}
				/>
			)}
		</>
	);
};

export default React.memo(SidemenuCollapseHeader);
