import React, { useState } from 'react';
import classNames from 'classnames';
import {
	Panel,
	Icon,
	Button,
	Spacing,
	Tooltip,
	Dialog,
} from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import GoalDetailsModal from '../GoalDetailsModal';
import { useEditGoalOptions } from '../../hooks/modalAndDialogOptions/goalDetailsModal';
import useGoalDialogOptions from '../../hooks/modalAndDialogOptions/useGoalDialogOptions';
import CollapsingList from '../CollapsingList';
import { DialogType, ModalType } from '../../utils/constants';
import { Goal } from '../../types/goals';

import styles from './GoalDetailsPanel.pcss';

interface GoalCardItem {
	icon: string;
	label: string | number;
	tooltipText: string;
}

interface GoalCardData {
	[key: string]: GoalCardItem;
}

interface GoalDetailsPanelProps {
	goalCardData: GoalCardData;
	setGoalCardExpanded: (isGoalCardExpanded: boolean) => void;
	isGoalCardExpanded: boolean;
	isEditButtonVisible: boolean;
	goal: Goal;
	isEditing: boolean;
	visibleDialog: DialogType;
	setVisibleDialog: React.Dispatch<React.SetStateAction<DialogType>>;
	hideEditButton: () => void;
}

const GoalDetailsPanel: React.FC<GoalDetailsPanelProps> = ({
	goalCardData,
	setGoalCardExpanded,
	isGoalCardExpanded,
	isEditButtonVisible,
	goal,
	isEditing,
	visibleDialog,
	setVisibleDialog,
	hideEditButton,
}) => {
	const translator = useTranslator();

	const [isEditModalVisible, setEditModalVisible] = useState<ModalType>(null);
	const { getEditGoalOptions } = useEditGoalOptions(
		setEditModalVisible,
		goal,
		hideEditButton,
	);
	const dialogOptions = useGoalDialogOptions()({
		setVisibleDialog,
		goal,
	});

	const renderDialogs = () => {
		if (!visibleDialog) {
			return null;
		}

		return <Dialog {...(dialogOptions as any)[visibleDialog]()} />;
	};

	const renderEditButton = () => (
		<>
			<Spacing horizontal="s" />
			<Tooltip
				placement="top"
				content={translator.gettext('Edit goal details')}
				portalTo={document.body}
			>
				<Button
					onClick={() => {
						isEditing
							? setVisibleDialog(DialogType.GOAL_DISCARD_CHANGES)
							: setEditModalVisible(ModalType.GOAL_EDIT);
					}}
				>
					<Icon icon="pencil" size="s" />
				</Button>
			</Tooltip>
		</>
	);

	const goalSummaryData = Object.keys(goalCardData).map((item) => {
		const { label, tooltipText } = goalCardData[item];

		return {
			title: label,
			tooltip: `${tooltipText} ${label}`,
		};
	});

	return (
		<Spacing horizontal="m">
			<Panel
				noBorder
				elevation="01"
				className={classNames(styles.panel, {
					[styles.panelExpanded]: !!isGoalCardExpanded,
				})}
				spacing="none"
			>
				<Spacing horizontal="m" vertical="s">
					<div className={styles.header}>
						<div className={styles.title}>
							{translator.gettext('Goal details')}
						</div>
						{isEditButtonVisible && renderEditButton()}
						<div className={styles.summary}>
							<CollapsingList
								data={goalSummaryData}
								alignment="right"
							/>
						</div>
						<Button
							onClick={() =>
								setGoalCardExpanded(!isGoalCardExpanded)
							}
						>
							<Icon
								icon={
									isGoalCardExpanded ? 'collapse' : 'expand'
								}
								size="s"
							/>
						</Button>
					</div>
				</Spacing>
			</Panel>
			{isEditModalVisible && (
				<GoalDetailsModal {...getEditGoalOptions()} />
			)}
			{renderDialogs()}
		</Spacing>
	);
};

export default GoalDetailsPanel;
