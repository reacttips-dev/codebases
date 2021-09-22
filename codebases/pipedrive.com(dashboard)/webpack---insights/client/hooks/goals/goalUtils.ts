import moment from 'moment';
import { getCookieValue } from '@pipedrive/fetch';
import { periods } from '@pipedrive/insights-core';

import {
	getIntervalForMoment,
	isActivityGoal,
	isDealGoal,
	isRevenueGoal,
} from '../../molecules/GoalDetailsModal/goalDetailsModalUtils';
import { GoalsApiCache } from '../../api/goals/goalsCache';
import {
	AssigneeType,
	Duration,
	GoalType,
	Interval,
	TrackingMetric,
	Goal,
} from '../../types/goals';
import { GET_GOALS } from '../../api/goals';
import { UnsavedGoal } from '../../api/vars/unsavedGoalCache';
import { NEW_GOAL_ID } from '../../utils/constants';

export const GOALS_AUTH_PARAMS = `session_token=${getCookieValue(
	'pipe-session-token',
)}&strict_mode=true`;

export const getGoals = () => {
	const cacheResponse = GoalsApiCache.readQuery({
		query: GET_GOALS,
	});

	return (cacheResponse as any)?.goals;
};

export const getGoalByReportId = (reportId: string) => {
	const goals = getGoals();

	return goals?.find((goal: Goal) => goal?.report_ids?.[0] === reportId);
};

export const getDefaultDuration = (interval: Interval, goalType: GoalType) => {
	const intervalFormattedForMoment = getIntervalForMoment(interval);

	if (isRevenueGoal(goalType)) {
		return {
			start: moment().startOf('year').format(periods.dateFormat),
			end: moment().endOf('year').format(periods.dateFormat),
		};
	}

	return {
		start: moment()
			.startOf(intervalFormattedForMoment)
			.format(periods.dateFormat),
		end: null,
	} as Duration;
};

export const composeUnsavedGoalInitialState = ({
	goalType,
	getCurrentUserId,
	getDefaultCurrencyId,
	getPipelines,
	getPipelineStages,
	getActivityTypes,
}: {
	goalType: GoalType;
	getCurrentUserId: () => number;
	getDefaultCurrencyId: () => number;
	getPipelines: () => Pipedrive.Pipeline[];
	getPipelineStages: (pipelineId: number) => Pipedrive.Stage[];
	getActivityTypes: () => Pipedrive.ActivityType[];
}): UnsavedGoal => {
	const pipelines = getPipelines();
	const selectedPipeline = pipelines.find(
		(pipeline: Pipedrive.Pipeline) => pipeline.selected,
	);

	const { id: defaultPipelineId } = selectedPipeline || pipelines[0];

	const defaultPipeline =
		isDealGoal(goalType) || isRevenueGoal(goalType)
			? defaultPipelineId
			: null;

	const defaultStage = getPipelineStages(defaultPipeline)?.[0]?.id;

	const defaultAssignee = {
		type: AssigneeType.PERSON,
		id: getCurrentUserId(),
	};

	const defaultActivityId = isActivityGoal(goalType)
		? getActivityTypes()[0].id
		: null;

	const DEFAULT_MONETARY_GOAL_TYPES = ['deals_won', 'revenue_forecast'];

	const defaultTrackingMetric = DEFAULT_MONETARY_GOAL_TYPES.includes(goalType)
		? TrackingMetric.VALUE
		: TrackingMetric.COUNT;

	const defaultInterval =
		isDealGoal(goalType) || isRevenueGoal(goalType)
			? Interval.MONTHLY
			: Interval.WEEKLY;

	return {
		id: NEW_GOAL_ID,
		name: 'New Goal',
		isNew: false,
		isEditing: false,
		type: {
			name: goalType,
			params: {
				pipeline_id: defaultPipeline,
				...(isActivityGoal(goalType) && {
					activity_type_id: defaultActivityId,
				}),
				...(goalType === 'deals_progressed' && {
					stage_id: defaultStage,
				}),
			},
		},
		assignee: defaultAssignee,
		expected_outcome: {
			target: null,
			tracking_metric: defaultTrackingMetric,
			...(defaultTrackingMetric === TrackingMetric.VALUE && {
				currency_id: getDefaultCurrencyId(),
			}),
		},
		interval: defaultInterval,
		duration: getDefaultDuration(defaultInterval, goalType),
	};
};
