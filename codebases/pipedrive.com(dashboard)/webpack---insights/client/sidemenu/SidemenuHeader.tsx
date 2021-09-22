import React, { useState } from 'react';
import {
	Button,
	Icon,
	Dropmenu,
	Option,
	Tooltip,
} from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { useQuery } from '@apollo/client';
import { get } from 'lodash';

import { GET_CACHED_REPORT_IS_EDITING } from '../api/graphql/index';
import { InsightsApiClient } from '../api/apollo/insightsApiClient';
import { goalsState } from '../api/vars/goalsState';
import { ModalType, DialogType, CoachmarkTags } from '../utils/constants';
import { ModalView } from '../types/modal';
import SidemenuCreateNewModal from '../sidemenu/sidemenuCollapseHeader/SidemenuCreateNewModal';
import useReportModalAndDialogOptions from '../hooks/modalAndDialogOptions/useReportModalAndDialogOptions';
import Dialog from '../atoms/Dialog';
import Coachmark from '../atoms/Coachmark';
import useOnboardingCoachmarks from '../utils/onboardingCoachmarkUtils';
import ConditionalWrapper from '../utils/ConditionalWrapper';

import styles from './SidemenuHeader.pcss';
import { getCappings } from '../api/commands/capping';
import localState from '../utils/localState';
import { getReportsLimitData } from '../shared/featureCapping/cappingUtils';
import CappingUpsellModal from '../atoms/CappingUpsellModal';

interface SidemenuHeaderProps {
	itemId: string;
	itemType: string;
	isNewReport: boolean;
}
interface NewItemConfig {
	name: string;
	modalType: ModalType;
	type: ModalView;
	key: string;
}

enum EntityType {
	REPORT = 'report',
	DASHBOARD = 'dashboard',
	GOAL = 'goal',
}

type NewItemKey =
	| ModalType.REPORT_CREATE
	| ModalType.DASHBOARD_CREATE
	| ModalType.GOAL_CREATE;

const SidemenuHeader: React.FC<SidemenuHeaderProps> = ({
	itemId,
	itemType,
	isNewReport,
}) => {
	const translator = useTranslator();
	const [visibleModal, setVisibleModal] = useState<NewItemKey | null>(null);
	const [visibleDialog, setVisibleDialog] = useState<
		DialogType.REPORT_DISCARD | DialogType.REPORT_DISCARD_CHANGES | null
	>(null);
	const [visibleUpsellModal, setVisibleUpsellModal] =
		useState<boolean>(false);
	const { INSIGHTS_CAPPING_COACHMARK } = CoachmarkTags;
	const { visible: coachMarkIsVisible, close: closeCoachmark } =
		useOnboardingCoachmarks()[INSIGHTS_CAPPING_COACHMARK];
	const reportOptions = useReportModalAndDialogOptions();
	const { error: goalsError } = goalsState();
	const isEditingQuery = useQuery(GET_CACHED_REPORT_IS_EDITING, {
		client: InsightsApiClient,
		variables: { id: itemId },
	});
	const { cap: cappingLimit } = getCappings();
	const { getCurrentUserSettings } = localState();
	const { reports } = getCurrentUserSettings();
	const { hasReachedReportsLimit } = getReportsLimitData(
		reports,
		cappingLimit,
	);
	const isEditing = get(
		isEditingQuery,
		'data.cachedReports.unsavedReport.is_editing',
	);
	const isAddingDisabledBeforeDiscard = isNewReport || isEditing;
	const addNewItemConfig: {
		[key in NewItemKey]: NewItemConfig;
	} = {
		[ModalType.REPORT_CREATE]: {
			name: translator.gettext('Report'),
			modalType: ModalType.REPORT_CREATE,
			type: ModalView.REPORTS,
			key: EntityType.REPORT,
		},
		[ModalType.DASHBOARD_CREATE]: {
			name: translator.gettext('Dashboard'),
			modalType: ModalType.DASHBOARD_CREATE,
			type: ModalView.DASHBOARDS,
			key: EntityType.DASHBOARD,
		},
		[ModalType.GOAL_CREATE]: {
			name: translator.gettext('Goal'),
			modalType: ModalType.GOAL_CREATE,
			type: ModalView.GOALS,
			key: EntityType.GOAL,
		},
	};

	const add = (e: any, item: any) => {
		if (e) {
			e.stopPropagation();
		}

		setVisibleModal(item.modalType);
	};

	const onTriggerClick = () => {
		if (isAddingDisabledBeforeDiscard) {
			const dialogType = isNewReport
				? DialogType.REPORT_DISCARD
				: DialogType.REPORT_DISCARD_CHANGES;

			setVisibleDialog(dialogType);
		}
	};

	const ConfirmationDialog = () => {
		const reportModalAndDialogOptions = reportOptions({
			setVisibleDialog: setVisibleDialog as any,
			reportId: itemId,
		});
		const dialogOptions = reportModalAndDialogOptions.dialog() as any;
		const dialogOption = dialogOptions[visibleDialog]();

		return <Dialog {...dialogOption} />;
	};

	const AddNewItemButton = () => (
		<Dropmenu
			className={styles.dropmenu}
			popoverProps={{
				portalTo: document.body,
				placement: 'bottom-start',
			}}
			content={({ closePopover }) => (
				<div className={styles.content}>
					{Object.keys(addNewItemConfig).map(
						(conf: NewItemKey, index) => {
							const item: NewItemConfig = addNewItemConfig[conf];

							return (
								<Option
									onClick={(e) => {
										closePopover();
										closeCoachmark();

										if (
											item.key === EntityType.REPORT &&
											hasReachedReportsLimit
										) {
											setVisibleUpsellModal(true);
										} else {
											add(e, item);
										}
									}}
									key={index}
									className={styles.option}
								>
									<Icon
										icon={item.key}
										size="s"
										className={styles.icon}
									/>
									{item.name}
								</Option>
							);
						},
					)}
				</div>
			)}
		>
			<span>
				<Tooltip
					placement="bottom"
					content={translator.gettext('Add new')}
				>
					<ConditionalWrapper
						condition={coachMarkIsVisible}
						wrapper={(children) => (
							<Coachmark coachmark={INSIGHTS_CAPPING_COACHMARK}>
								{children}
							</Coachmark>
						)}
					>
						<Button
							className={styles.button}
							onClick={() => {
								closeCoachmark();
							}}
						>
							<Icon icon="plus" />
						</Button>
					</ConditionalWrapper>
				</Tooltip>
			</span>
		</Dropmenu>
	);

	return (
		<>
			{isAddingDisabledBeforeDiscard ? (
				<Button
					className={styles.button}
					onClick={onTriggerClick}
					disabled={itemType === 'goals' && !!goalsError}
				>
					<Icon icon="plus" size="s" />
				</Button>
			) : (
				AddNewItemButton()
			)}

			{visibleUpsellModal && (
				<CappingUpsellModal
					visible={visibleUpsellModal}
					setVisible={setVisibleUpsellModal}
				/>
			)}

			{visibleDialog && isAddingDisabledBeforeDiscard && (
				<ConfirmationDialog />
			)}

			{visibleModal && (
				<SidemenuCreateNewModal
					type={addNewItemConfig[visibleModal]?.type}
					visibleModal={visibleModal}
					setVisibleModal={setVisibleModal}
					itemId={itemId}
					itemType={itemType}
				/>
			)}
		</>
	);
};

export default SidemenuHeader;
