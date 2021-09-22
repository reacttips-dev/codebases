import React from 'react';
import { Button, Dropmenu, Icon, Option } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { DialogType } from '../../utils/constants';
import SendToDashboardDropmenu from '../../molecules/SendToDashboardDropmenu';
import { SelectedItemType } from '../../types/apollo-query-types';
import { UnsavedGoal } from '../../api/vars/unsavedGoalCache';

import styles from './GoalButtons.pcss';

interface GoalButtonsProps {
	goal: UnsavedGoal;
	toggleModal: Function;
	toggleDialog: Function;
	canSeeCurrentReport?: boolean;
	isEditing: boolean;
	saveReport: () => {};
}

const GoalButtons: React.FC<GoalButtonsProps> = ({
	goal,
	toggleModal,
	toggleDialog,
	canSeeCurrentReport,
	isEditing,
	saveReport,
}) => {
	const translator = useTranslator();

	const getEditModeButtons = () => {
		return (
			<>
				<Button
					className={styles.goalButton}
					onClick={() =>
						toggleDialog(DialogType.GOAL_DISCARD_CHANGES)
					}
				>
					{translator.gettext('Discard changes')}
				</Button>
				<Button
					className={styles.goalButton}
					color="green"
					onClick={() => saveReport()}
				>
					{translator.gettext('Save')}
				</Button>
			</>
		);
	};

	return (
		<div className={styles.GoalButtons}>
			{isEditing ? (
				getEditModeButtons()
			) : (
				<>
					<SendToDashboardDropmenu
						toggleModal={toggleModal}
						reportId={goal.report_ids[0]}
						reportType={SelectedItemType.GOALS}
						canSeeCurrentReport={canSeeCurrentReport}
					/>
					<Dropmenu
						content={
							<>
								<Option
									className={styles.dropmenuOption}
									onClick={() =>
										toggleDialog(DialogType.GOAL_DELETE)
									}
									data-test="delete-button"
								>
									<Icon
										icon="trash"
										size="s"
										className={styles.dropdownOptionIcon}
									/>
									{translator.gettext('Delete')}
								</Option>
							</>
						}
						popoverProps={{ placement: 'bottom-end' }}
						closeOnClick
					>
						<Button
							data-test="ellipsis-menu"
							className={styles.goalButton}
						>
							<Icon icon="ellipsis" size="s" />
						</Button>
					</Dropmenu>
				</>
			)}
		</div>
	);
};

export default GoalButtons;
