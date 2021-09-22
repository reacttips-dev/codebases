import { types as insightsTypes } from '@pipedrive/insights-core';

import {
	isDealGoal,
	isRevenueGoal,
	isActivityGoal,
} from '../../../molecules/GoalDetailsModal/goalDetailsModalUtils';
import { GoalType, GoalDataType } from '../../../types/goals';
import { Entity, SubEntity } from '../../../types/modal';

export const getGoalEntity = (goalType: GoalType): Entity => {
	if (!goalType || isDealGoal(goalType)) {
		return Entity.DEAL;
	}

	if (isRevenueGoal(goalType)) {
		return Entity.REVENUE;
	}

	return Entity.ACTIVITY;
};

export const getGoalEntitySubtype = (
	entity: Entity,
	goalType: GoalType,
): SubEntity => {
	if (!entity || !goalType) {
		return null;
	}

	return (
		entity === Entity.REVENUE
			? SubEntity.REVENUE_FORECAST
			: goalType.split('_')?.[1]
	) as SubEntity;
};

export const getGoalDataType = (goalType: GoalType): GoalDataType => {
	if (!goalType) {
		return null;
	}

	return isActivityGoal(goalType)
		? insightsTypes.DataType.ACTIVITIES
		: insightsTypes.DataType.DEALS;
};
