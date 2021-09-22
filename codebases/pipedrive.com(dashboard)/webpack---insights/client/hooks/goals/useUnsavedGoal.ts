import { useEffect } from 'react';
import { useReactiveVar } from '@apollo/client';

import {
	TrackingMetric,
	Interval,
	GoalType,
	Assignee,
	Duration,
} from '../../types/goals';
import { composeUnsavedGoalInitialState } from './goalUtils';
import { UnsavedGoal, unsavedGoalCache } from '../../api/vars/unsavedGoalCache';
import { getGoalById } from '../../api/commands/goals';
import { NEW_GOAL_ID } from '../../utils/constants';
import {
	getActivityTypes,
	getCurrentUserId,
	getDefaultCurrencyId,
	getPipelines,
	getPipelineStages,
} from '../../api/webapp';

const useUnsavedGoal = (goalId?: string) => {
	const unsavedGoal = useReactiveVar(unsavedGoalCache);

	const setUnsavedGoal = (
		updatedProperties: UnsavedGoal,
		isEditing = true,
	) => {
		unsavedGoalCache({
			...unsavedGoal,
			...updatedProperties,
			isEditing,
		});
	};

	useEffect(() => {
		if (goalId && goalId !== unsavedGoal.id) {
			const isNewReport = goalId === NEW_GOAL_ID;

			const goal = isNewReport
				? {
						id: goalId,
				  }
				: getGoalById(goalId);

			setUnsavedGoal(goal, isNewReport);
		}
	});

	const setDefaultUnsavedGoal = (goalType: GoalType) => {
		setUnsavedGoal(
			composeUnsavedGoalInitialState({
				goalType,
				getCurrentUserId,
				getDefaultCurrencyId,
				getPipelines,
				getPipelineStages,
				getActivityTypes,
			}),
		);
	};

	const setGoalType = (goalType: GoalType) => {
		setUnsavedGoal({
			type: {
				...unsavedGoal.type,
				name: goalType,
			},
		});
	};

	const getGoalType = (): GoalType => unsavedGoal.type?.name;

	const setGoalName = (name: string) =>
		setUnsavedGoal({
			name,
		});

	const getGoalName = (): string => unsavedGoal.name;

	const setPipeline = (pipelineId: number) => {
		setUnsavedGoal({
			type: {
				...unsavedGoal.type,
				params: {
					...unsavedGoal.type?.params,
					pipeline_id: pipelineId,
				},
			},
		});
	};

	const getPipeline = () => unsavedGoal.type?.params?.pipeline_id;

	const setActivityType = (activityTypeId: number) => {
		setUnsavedGoal({
			type: {
				...unsavedGoal?.type,
				params: {
					...unsavedGoal.type?.params,
					activity_type_id: activityTypeId,
				},
			},
		});
	};

	const getActivityType = () => unsavedGoal.type?.params?.activity_type_id;

	const setStage = (stageId: number) => {
		setUnsavedGoal({
			type: {
				...unsavedGoal.type,
				params: {
					...unsavedGoal.type?.params,
					stage_id: stageId,
				},
			},
		});
	};

	const getStage = () => unsavedGoal.type?.params?.stage_id;

	const setAssignee = (assignee: Assignee) => {
		setUnsavedGoal({ assignee });
	};

	const getAssignee = () => unsavedGoal.assignee;

	const setValue = (value: number) => {
		setUnsavedGoal({
			expected_outcome: {
				...unsavedGoal.expected_outcome,
				target: value,
			},
		});
	};

	const getValue = () => unsavedGoal.expected_outcome?.target;

	const setTrackingMetric = (trackingMetric: TrackingMetric) => {
		setUnsavedGoal({
			expected_outcome: {
				target: unsavedGoal.expected_outcome.target,
				tracking_metric: trackingMetric,
				...(trackingMetric === TrackingMetric.VALUE && {
					currency_id: getDefaultCurrencyId(),
				}),
			},
		});
	};

	const getTrackingMetric = () =>
		unsavedGoal.expected_outcome?.tracking_metric;

	const setInterval = (interval: Interval) => {
		setUnsavedGoal({
			interval,
		});
	};

	const getInterval = () => unsavedGoal.interval;

	const setDuration = (duration: Duration) => {
		if (duration.end === '') {
			duration.end = null;
		}

		setUnsavedGoal({
			duration,
		});
	};

	const getDuration = () => unsavedGoal.duration;

	const isEditing = () => unsavedGoal.isEditing;

	const setIsEditing = (isEditing: boolean) => {
		setUnsavedGoal({
			isEditing,
		});
	};

	const setIsNew = (isNew: boolean) => {
		setUnsavedGoal({
			isNew,
		});
	};

	const getIsNew = () => unsavedGoal.isNew;

	return {
		unsavedGoal,
		unsavedGoalUtils: {
			setDefaultUnsavedGoal,
			setGoalType,
			getGoalType,
			setPipeline,
			getPipeline,
			setActivityType,
			getActivityType,
			setStage,
			getStage,
			setAssignee,
			getAssignee,
			setValue,
			getValue,
			setTrackingMetric,
			getTrackingMetric,
			setInterval,
			getInterval,
			setDuration,
			getDuration,
			isEditing,
			setIsEditing,
			getGoalName,
			setGoalName,
			setIsNew,
			getIsNew,
		},
	};
};

export default useUnsavedGoal;
