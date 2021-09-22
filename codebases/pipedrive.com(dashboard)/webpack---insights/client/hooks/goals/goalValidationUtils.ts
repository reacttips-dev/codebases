import moment from 'moment';

import {
	AssigneeType,
	Goal,
	GoalType,
	GoalValidationError,
	Interval,
	TrackingMetric,
} from '../../types/goals';

interface FlatGoal {
	assigneeId: number;
	assigneeType: AssigneeType;
	durationStart: string;
	interval: Interval;
	target: number;
	pipelineId: number;
	stageId: number;
	activityTypeId: number;
}

export const validateFormFields = (goal: Goal) => {
	const {
		assignee: { id: assigneeId, type: assigneeType },
		duration: { start: durationStart },
		expected_outcome: { target },
		interval,
		type: {
			name: goalType,
			params: {
				pipeline_id: pipelineId,
				stage_id: stageId,
				activity_type_id: activityTypeId,
			},
		},
	} = goal;

	const flatGoal: FlatGoal = {
		assigneeId,
		assigneeType,
		durationStart,
		interval,
		target,
		pipelineId,
		stageId,
		activityTypeId,
	};

	const BASE_VALIDATION_FIELDS = [
		'assigneeId',
		'assigneeType',
		'durationStart',
		'target',
		'interval',
	];

	const validationFields: { [type in GoalType]: string[] } = {
		deals_started: [...BASE_VALIDATION_FIELDS],
		deals_progressed: [...BASE_VALIDATION_FIELDS, 'pipelineId', 'stageId'],
		deals_won: [...BASE_VALIDATION_FIELDS],
		activities_added: [...BASE_VALIDATION_FIELDS, 'activityTypeId'],
		activities_completed: [...BASE_VALIDATION_FIELDS, 'activityTypeId'],
		revenue_forecast: [...BASE_VALIDATION_FIELDS],
	};

	return !validationFields[goalType]?.some((field: keyof FlatGoal) => {
		const fieldValue = flatGoal[field];

		return (
			fieldValue === undefined || fieldValue === null || fieldValue === ''
		);
	});
};

export const validateUserInput = (goal: Goal) => {
	const errors: GoalValidationError = {};

	const { duration, expected_outcome } = goal;

	const validateDuration = () => {
		const isInfiniteDuration = duration.end === null;

		if (isInfiniteDuration) {
			return;
		}

		const isValidDateRange = moment(duration.end).isSameOrAfter(
			duration.start,
		);

		if (!isValidDateRange) {
			errors.duration = 'Earlier than start date';
		}
	};

	const validateTarget = () => {
		if (expected_outcome.target === 0) {
			errors.target = "Can't be 0";
		} else if (expected_outcome.target < 0) {
			errors.target = "Can't be negative";
		} else if (!expected_outcome.target) {
			errors.target = 'Incorrect value';
		}

		const isValueGoal =
			expected_outcome.tracking_metric === TrackingMetric.VALUE;

		if (
			expected_outcome.target &&
			!isValueGoal &&
			!Number.isInteger(expected_outcome.target)
		) {
			errors.target = 'Value must be an integer';
		}
	};

	validateDuration();
	validateTarget();

	return errors;
};
