import { getPdMetrics } from '../../api/webapp';
import { wrapWithTryCatch } from './helpers';
import { Goal } from '../../types/goals';

export const trackGoalAdded = wrapWithTryCatch((goal: Goal) => {
	getPdMetrics().trackUsage(null, 'goal', 'added', {
		assignee_type: goal?.assignee?.type,
		expected_outcome_type: goal?.expected_outcome?.tracking_metric,
		goal_type: goal?.type?.name,
	});
});

export const trackGoalEdited = wrapWithTryCatch(() => {
	getPdMetrics().trackUsage(null, 'goal', 'edited');
});

export const trackGoalDeleted = wrapWithTryCatch(() => {
	getPdMetrics().trackUsage(null, 'goal', 'deleted');
});

export const trackGoalOpened = wrapWithTryCatch((goalId: string) => {
	getPdMetrics().trackUsage(null, 'goal', 'opened', {
		goal_id: goalId,
	});
});

export const trackGoalRenamed = wrapWithTryCatch((goalId: string) => {
	getPdMetrics().trackUsage(null, 'goal', 'renamed', {
		goal_id: goalId,
	});
});
