import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { Icon, Tooltip, Button } from '@pipedrive/convention-ui-react';

import { DialogType, ModalType, PERMISSION_TYPES } from '../../utils/constants';
import localState from '../../utils/localState';
import GoalButtons from '../../atoms/GoalButtons';
import Dialog from '../../atoms/Dialog';
import SimpleModal from '../../atoms/SimpleModal';
import { useGoalPermissions } from '../../hooks/goals';
import usePlanPermissions from '../../hooks/usePlanPermissions';
import useGoalModalOptions from '../../hooks/modalAndDialogOptions/useGoalModalOptions';
import useGoalDialogOptions from '../../hooks/modalAndDialogOptions/useGoalDialogOptions';
import useActionBarTitle from '../../hooks/useActionBarTitle';
import { Goal } from '../../types/goals';
import GoalStatusPill from '../../molecules/GoalStatusPill';
import SendToDashboardDropmenu from '../../molecules/SendToDashboardDropmenu';
import { SelectedItemType } from '../../types/apollo-query-types';
import { getUserById } from '../../api/webapp';
import { updateGoal } from '../../api/commands/goals';
import { trackGoalRenamed } from '../../utils/metrics/goal-analytics';
import {
	ActionBar,
	ActionBarFirstRow,
	ActionButtons,
	ActionBarTitle,
	DashboardLockedDialog,
} from '../../shared';

import styles from './GoalActionBar.pcss';

interface GoalActionBarProps {
	goal: Goal;
	visibleModal: ModalType;
	visibleDialog: DialogType;
	setVisibleDialog: React.Dispatch<React.SetStateAction<DialogType>>;
	setVisibleModal: React.Dispatch<React.SetStateAction<ModalType>>;
	canSeeCurrentReport?: boolean;
	isEditing: boolean;
	saveReport: () => {};
}

const GoalActionBar: React.FC<GoalActionBarProps> = ({
	goal,
	visibleModal,
	setVisibleModal,
	visibleDialog,
	setVisibleDialog,
	canSeeCurrentReport,
	isEditing,
	saveReport,
}) => {
	const translator = useTranslator();
	const { actionBarTitle, actionBarTitleKey, changeActionBarTitle } =
		useActionBarTitle(goal);
	const { hasViewOnlyPermission } = useGoalPermissions();
	const { hasPermission, isAdmin } = usePlanPermissions();
	const { resetUnsavedReport } = localState();
	const userCanOnlyViewGoal = hasViewOnlyPermission(goal);
	const canHaveMultipleDashboards = hasPermission(
		PERMISSION_TYPES.static.haveMultipleDashboards,
	);

	const modalOptions = useGoalModalOptions()({
		setVisibleModal,
		goal,
	});
	const dialogOptions = useGoalDialogOptions()({
		setVisibleDialog,
		goal,
	});

	const isActiveGoal = goal.is_active;

	const renderDialogs = () => {
		if (!visibleDialog) {
			return null;
		}

		return <Dialog {...(dialogOptions as any)[visibleDialog]()} />;
	};

	const renderModals = () => {
		if (!visibleModal) {
			return null;
		}

		const { DASHBOARD_CREATE_AND_ADD_REPORT } = ModalType;

		if (
			[DASHBOARD_CREATE_AND_ADD_REPORT].includes(visibleModal) &&
			!canHaveMultipleDashboards
		) {
			return (
				<DashboardLockedDialog
					isAdmin={isAdmin}
					setVisibleModal={setVisibleModal}
					translator={translator}
				/>
			);
		}

		return <SimpleModal {...(modalOptions as any)[visibleModal]()} />;
	};

	return (
		<ActionBar>
			<ActionBarFirstRow>
				<div className={styles.actionBarTitleWrapper}>
					<ActionBarTitle
						key={actionBarTitleKey}
						title={actionBarTitle}
						onChange={(title: string) =>
							changeActionBarTitle(title, async () => {
								await updateGoal(goal.id, { title });
								trackGoalRenamed(goal.id);
							})
						}
					/>
					{!isActiveGoal && <GoalStatusPill goal={goal} />}
				</div>

				<ActionButtons>
					{userCanOnlyViewGoal ? (
						<>
							<Tooltip
								content={translator.pgettext(
									'Only goal creator [User name] or an admin user can make changes to this goal',
									'Only goal creator %s or an admin user can make changes to this goal',
									getUserById(goal?.owner_id)?.name,
								)}
								placement="bottom-end"
								portalTo={document.body}
							>
								<div className={styles.viewOnlyTextWrapper}>
									<Icon
										icon="pencil-off"
										size="s"
										color="black-64"
									/>
									<div className={styles.viewOnlyText}>
										{translator.gettext('View only')}
									</div>
								</div>
							</Tooltip>
							{isEditing ? (
								<Button
									onClick={() =>
										resetUnsavedReport(
											goal?.report_ids?.[0],
										)
									}
								>
									{translator.gettext('Clear changes')}
								</Button>
							) : (
								<SendToDashboardDropmenu
									toggleModal={setVisibleModal}
									reportId={goal.report_ids[0]}
									reportType={SelectedItemType.GOALS}
									canSeeCurrentReport={canSeeCurrentReport}
								/>
							)}
						</>
					) : (
						<GoalButtons
							goal={goal}
							toggleModal={setVisibleModal}
							toggleDialog={setVisibleDialog}
							canSeeCurrentReport={canSeeCurrentReport}
							isEditing={isEditing}
							saveReport={saveReport}
						/>
					)}
				</ActionButtons>
				{renderDialogs()}
				{renderModals()}
			</ActionBarFirstRow>
		</ActionBar>
	);
};

export default GoalActionBar;
