import { Reference } from '@apollo/client';

import {
	ADD_GOAL,
	DELETE_GOAL,
	GET_GOALS,
	GoalsApiClient as client,
	GOAL_PROPS_FRAGMENT,
	UPDATE_GOAL,
} from '../goals';
import { getGoalPayload } from '../../molecules/GoalDetailsModal/goalDetailsModalUtils';
import { Goal, GoalApi } from '../../types/goals';
import {
	trackGoalAdded,
	trackGoalDeleted,
	trackGoalEdited,
} from '../../utils/metrics/goal-analytics';
import { GOALS_AUTH_PARAMS } from '../../hooks/goals/goalUtils';
import {
	resetUnsavedGoalCache,
	unsavedGoalCache,
} from '../vars/unsavedGoalCache';

interface GoalReference extends Goal, Reference {}

export const getGoals = (): Goal[] => {
	try {
		const { goals } = client.readQuery({
			query: GET_GOALS,
		});

		return goals;
	} catch (error) {
		return [];
	}
};

export const getGoalById = (goalId: string): Goal => {
	return getGoals().find((goal: Goal) => goal.id === goalId);
};

export const addGoal = async () => {
	return client.mutate({
		mutation: ADD_GOAL,
		variables: {
			path: `?${GOALS_AUTH_PARAMS}`,
			payload: getGoalPayload(unsavedGoalCache()),
		},
		update: (cache, { data: { addGoal } }) => {
			cache.modify({
				fields: {
					goals(existingGoals: GoalReference[] = []) {
						const newGoalRef = cache.writeFragment({
							data: addGoal,
							fragment: GOAL_PROPS_FRAGMENT,
						});

						return [newGoalRef].concat(existingGoals);
					},
				},
			});

			trackGoalAdded(addGoal);
		},
	});
};

export const updateGoal = async (
	goalId: string,
	payload?: Partial<GoalApi>,
) => {
	await client.mutate({
		mutation: UPDATE_GOAL,
		variables: {
			path: `/${goalId}?${GOALS_AUTH_PARAMS}`,
			payload: payload ?? getGoalPayload(unsavedGoalCache()),
		},
	});

	trackGoalEdited();
	resetUnsavedGoalCache();
};

export const deleteGoal = async (goalId: string) => {
	return client.mutate({
		mutation: DELETE_GOAL,
		variables: {
			path: `/${goalId}?${GOALS_AUTH_PARAMS}`,
		},
		update: (cache) => {
			cache.modify({
				fields: {
					goals(existingGoals: GoalReference[] = [], { readField }) {
						return existingGoals.filter(
							(goal) => readField('id', goal) !== goalId,
						);
					},
				},
			});

			trackGoalDeleted();
		},
	});
};
