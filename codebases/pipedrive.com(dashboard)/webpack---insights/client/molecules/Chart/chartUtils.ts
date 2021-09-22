import { Translator } from '@pipedrive/react-utils';

import { QuickFilters } from '../../types/apollo-query-types';
import { AssigneeType, Goal, GoalError } from '../../types/goals';
import {
	isQuickFilterSet,
	isUserFilterSetToEveryone,
	QuickFilterType,
	QuickFilterUserTypes,
} from '../../utils/quickFilterUtils';

const areGoalAssigneeAndUserFilterSameType = (
	goal: Goal,
	quickFilters: QuickFilters,
) => {
	if (quickFilters?.user?.type === goal?.assignee?.type) {
		return true;
	}

	if (isUserFilterSetToEveryone(quickFilters?.user)) {
		return goal?.assignee.type === AssigneeType.COMPANY;
	}

	return (
		quickFilters?.user?.type === QuickFilterUserTypes.USER &&
		goal?.assignee.type === AssigneeType.PERSON
	);
};

export const isGoalAndUserQuickFilterMismatch = ({
	quickFilters,
	goal,
}: {
	quickFilters: QuickFilters;
	goal: Goal;
}) => {
	if (!isQuickFilterSet(quickFilters, QuickFilterType.USER)) {
		return false;
	}

	if (areGoalAssigneeAndUserFilterSameType(goal, quickFilters)) {
		if (isUserFilterSetToEveryone(quickFilters?.user)) {
			return false;
		}

		return quickFilters.user?.operands[0].defaultValue !== goal.assignee.id;
	}

	return true;
};

export const getGoalErrorType = ({
	quickFilters,
	goal,
}: {
	quickFilters: QuickFilters;
	goal: Goal;
}): GoalError => {
	if (!goal) {
		return GoalError.RESTRICTED;
	}

	if (isGoalAndUserQuickFilterMismatch({ quickFilters, goal })) {
		return GoalError.USER_QUICK_FILTER_MISMATCH;
	}

	return null;
};

const getEditButtonText = (
	isGoalsReport: boolean,
	canEditDashboard: boolean,
	translator: Translator,
) => {
	if (!canEditDashboard) {
		return null;
	}

	return isGoalsReport
		? translator.gettext('Edit goal')
		: translator.gettext('Edit report');
};

export const getWidgetNoDataMessage = ({
	isGoalsReport,
	goalErrorType,
	canEditDashboard,
	translator,
}: {
	isGoalsReport: boolean;
	goalErrorType: GoalError | boolean;
	canEditDashboard: boolean;
	translator: Translator;
}): { messageText: string; buttonText: string } => {
	switch (goalErrorType) {
		case GoalError.USER_QUICK_FILTER_MISMATCH:
			return {
				messageText: translator.gettext(
					'This goal is not matching with chosen filters',
				),
				buttonText: canEditDashboard
					? translator.gettext('Edit goal')
					: translator.gettext('View goal'),
			};
		case GoalError.RESTRICTED:
			return {
				messageText: translator.gettext(
					"You don't have access to this goal",
				),
				buttonText: null,
			};
		default:
			return {
				messageText: translator.gettext(
					'No data to show with current filters or grouping',
				),
				buttonText: getEditButtonText(
					isGoalsReport,
					canEditDashboard,
					translator,
				),
			};
	}
};
