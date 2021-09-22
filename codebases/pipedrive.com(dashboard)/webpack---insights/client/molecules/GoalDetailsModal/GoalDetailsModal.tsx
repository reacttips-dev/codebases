import React, { useState } from 'react';
import escape from 'escape-html';
import { Modal, Separator, Message } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import GoalDetailsModalFooter from './footer';
import DetailsSection from './sections';
import { Interval, GoalType, AssigneeType, GoalApi } from '../../types/goals';
import {
	isActivityGoal,
	isDealGoal,
	getHeaderText,
	getGoalTypeLabel,
	isRevenueGoal,
} from './goalDetailsModalUtils';
import ModalMessage from '../../atoms/ModalMessage';
import { useUnsavedGoal } from '../../hooks/goals';
import useGoalValidation from '../../hooks/goals/useGoalValidation';
import { resetUnsavedGoalCache } from '../../api/vars/unsavedGoalCache';
import { getTeamById, getUserById } from '../../api/webapp';

import styles from './GoalDetailsModal.pcss';

export type DetailsModalType = 'create' | 'edit';

export interface OnSaveProps {
	setError: (errorMessage: string) => void;
	setDuplicateGoal: (goal: GoalApi) => void;
	setLoading: (loading: boolean) => void;
}

export interface GoalDetailsModalProps {
	closeModal: () => void;
	modalType: DetailsModalType;
	goalId: string;
	onSave: (onSaveProps: OnSaveProps) => void;
	onBack?: () => void;
}

const GoalDetailsModal: React.FC<GoalDetailsModalProps> = ({
	closeModal,
	modalType,
	goalId,
	onSave,
	onBack,
}) => {
	const translator = useTranslator();
	const [duplicateGoal, setDuplicateGoal] = useState(null);
	const [loading, setLoading] = useState(false);
	const { unsavedGoalUtils, unsavedGoal } = useUnsavedGoal(goalId);
	const [error, setError] = useState<string>();
	const { validateInputFields, areRequiredFieldsFilled, errors } =
		useGoalValidation();

	const goalType: GoalType = unsavedGoalUtils.getGoalType();

	const onClose = () => {
		closeModal();
		resetUnsavedGoalCache();
	};

	const headerText = getHeaderText({
		modalType,
		goalType,
		translator,
		goalName: unsavedGoalUtils.getGoalName(),
	});

	const getGoalAssigneeLabel = () => {
		const {
			assignee: { type, id },
		} = unsavedGoal;

		switch (type) {
			case AssigneeType.COMPANY:
				return translator.gettext('Everyone');
			case AssigneeType.PERSON:
				return getUserById(id)?.name;
			case AssigneeType.TEAM:
				return getTeamById(id)?.name;
			default:
				return '';
		}
	};

	const getComposedGoalName = () => {
		const goalTypeLabel = getGoalTypeLabel(goalType, translator);
		const goalAssigneeLabel = getGoalAssigneeLabel();

		return `${goalTypeLabel} ${goalAssigneeLabel}`;
	};

	return (
		<Modal
			header={headerText}
			backdrop
			footer={
				<GoalDetailsModalFooter
					onSave={() => {
						validateInputFields(async () => {
							if (modalType === 'create') {
								unsavedGoalUtils.setGoalName(
									getComposedGoalName(),
								);
							}

							onSave({ setError, setDuplicateGoal, setLoading });
						});
					}}
					onCancel={onClose}
					onBack={onBack}
					isBackButtonVisible={modalType === 'create' ? true : false}
					isContinueButtonDisabled={
						!unsavedGoalUtils.isEditing() ||
						!areRequiredFieldsFilled
					}
					loading={loading}
				/>
			}
			onClose={onClose}
			spacing="none"
			visible
			data-test={`${modalType}-goal-details-modal`}
		>
			{error && <ModalMessage content={error} />}
			{duplicateGoal && (
				<div className={styles.messageContainer}>
					<Message
						color="yellow"
						icon="warning"
						alignCenter
						visible
						alternative
					>
						<p
							dangerouslySetInnerHTML={{
								__html: translator.pgettext(
									'A duplicate goal already exists: [goal name]. Please edit one of the goals.',
									'A duplicate goal already exists: %s. Please edit one of the goals.',
									`<strong class="${
										styles.textStrong
									}">${escape(duplicateGoal.title)}</strong>`,
								),
							}}
						/>
					</Message>
				</div>
			)}
			<div className={styles.container}>
				<DetailsSection.AssigneeSection
					assignee={unsavedGoalUtils.getAssignee()}
					setAssignee={unsavedGoalUtils.setAssignee}
				/>
				{isActivityGoal(goalType) && (
					<DetailsSection.ActivityTypeSection
						activityType={unsavedGoalUtils.getActivityType()}
						setActivityType={unsavedGoalUtils.setActivityType}
					/>
				)}
				<DetailsSection.PipelineSection
					pipeline={unsavedGoalUtils.getPipeline()}
					setPipeline={unsavedGoalUtils.setPipeline}
					stage={unsavedGoalUtils.getStage()}
					setStage={unsavedGoalUtils.setStage}
					isStageSelectionVisible={goalType === 'deals_progressed'}
				/>
				{isDealGoal(goalType) && (
					<DetailsSection.TrackingMetricSection
						trackingMetric={unsavedGoalUtils.getTrackingMetric()}
						setTrackingMetric={unsavedGoalUtils.setTrackingMetric}
					/>
				)}
				<DetailsSection.IntervalSection
					interval={unsavedGoalUtils.getInterval()}
					setInterval={(interval: Interval) => {
						unsavedGoalUtils.setInterval(interval);
					}}
				/>
				<DetailsSection.DurationSection
					duration={unsavedGoalUtils.getDuration()}
					setDuration={unsavedGoalUtils.setDuration}
					error={errors.duration}
					allowClearEnd={!isRevenueGoal(goalType)}
					label={
						isRevenueGoal(goalType)
							? translator.gettext('Forecast duration')
							: translator.gettext('Duration')
					}
				/>
			</div>
			<Separator type="block">
				{translator.gettext('Expected outcome')}
			</Separator>
			<div className={styles.container}>
				<DetailsSection.OutcomeSection
					interval={unsavedGoalUtils.getInterval()}
					value={unsavedGoalUtils.getValue()}
					setValue={unsavedGoalUtils.setValue}
					error={errors.target}
					trackingMetric={unsavedGoalUtils.getTrackingMetric()}
				/>
			</div>
		</Modal>
	);
};

export default GoalDetailsModal;
