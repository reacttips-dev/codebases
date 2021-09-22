import moment from 'moment';
import { pick } from 'lodash';
import { Translator } from '@pipedrive/react-utils';

import { Interval, GoalType, Goal } from '../../types/goals';
import { DetailsModalType } from './GoalDetailsModal';

export const getIntervalLabel = (
	interval: Interval,
	translator: Translator,
): string => {
	switch (interval) {
		case Interval.YEARLY:
			return translator.gettext('Yearly');
		case Interval.QUARTERLY:
			return translator.gettext('Quarterly');
		case Interval.MONTHLY:
			return translator.gettext('Monthly');
		case Interval.WEEKLY:
			return translator.gettext('Weekly');
		default:
			return '';
	}
};

export const getIntervalForMoment = (
	interval: Interval,
): moment.unitOfTime.StartOf => {
	switch (interval) {
		case Interval.YEARLY:
			return 'year';
		case Interval.QUARTERLY:
			return 'quarter';
		case Interval.MONTHLY:
			return 'month';
		case Interval.WEEKLY:
			return 'week';
		default:
			return 'month';
	}
};

export const getGoalTypeLabel = (
	goalType: GoalType,
	translator: Translator,
): string => {
	switch (goalType) {
		case 'deals_progressed':
			return translator.gettext('Deals progressed');
		case 'deals_started':
			return translator.gettext('Deals added');
		case 'deals_won':
			return translator.gettext('Deals won');
		case 'activities_added':
			return translator.gettext('Activities added');
		case 'activities_completed':
			return translator.gettext('Activities completed');
		case 'revenue_forecast':
			return translator.gettext('Revenue forecast');
		default:
			return '';
	}
};

export const isActivityGoal = (goalType: GoalType) => {
	const activityGoalTypes: GoalType[] = [
		'activities_completed',
		'activities_added',
	];

	return activityGoalTypes.includes(goalType);
};

export const isDealGoal = (goalType: GoalType) => {
	const dealGoalTypes: GoalType[] = [
		'deals_won',
		'deals_progressed',
		'deals_started',
	];

	return dealGoalTypes.includes(goalType);
};

export const isRevenueGoal = (goalType: GoalType) =>
	goalType === 'revenue_forecast';

export const renameObjKey = (
	oldKey: string,
	newKey: string,
	{ [oldKey]: oldVal, ...others },
) => {
	return {
		[newKey]: oldVal,
		...others,
	};
};

export const getGoalPayload = (unsavedGoal: Goal) => {
	const GOAL_PAYLOAD_PROPERTIES_WHITELIST = [
		'title',
		'assignee',
		'duration',
		'expected_outcome',
		'interval',
		'type',
	];

	const transformedGoal = renameObjKey('name', 'title', unsavedGoal);

	return pick(transformedGoal, GOAL_PAYLOAD_PROPERTIES_WHITELIST);
};

export const getHeaderText = ({
	modalType,
	goalType,
	translator,
	goalName,
}: {
	modalType: DetailsModalType;
	goalType: GoalType;
	translator: Translator;
	goalName: string;
}) => {
	return modalType === 'create'
		? `${translator.gettext('Add goal')} 2/2 - ${getGoalTypeLabel(
				goalType,
				translator,
		  )}`
		: translator.gettext('Edit %s goal', goalName);
};
