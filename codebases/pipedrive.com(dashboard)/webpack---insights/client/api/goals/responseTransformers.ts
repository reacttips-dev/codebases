import { GoalApi, Goal } from '../../types/goals';
import { renameObjKey } from '../../molecules/GoalDetailsModal/goalDetailsModalUtils';

const transformGoal = (goal: GoalApi) => renameObjKey('title', 'name', goal);

export const getTransformedGoals = (goals: GoalApi[]): Goal[] => {
	return goals.map(transformGoal);
};

export const getTransformedGoal = (goal: GoalApi): Goal => {
	return transformGoal(goal);
};
