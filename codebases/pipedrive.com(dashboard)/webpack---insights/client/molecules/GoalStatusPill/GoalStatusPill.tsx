import React from 'react';
import { Pill } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { isFutureDate, isPastDate } from '../../utils/helpers';
import { Goal } from '../../types/goals';

interface GoalStatusPillProps {
	goal: Goal;
}

export const GoalStatusPill: React.FC<GoalStatusPillProps> = ({ goal }) => {
	const translator = useTranslator();

	const {
		duration: { start: goalStartDate, end: goalEndDate },
	} = goal;

	const isFutureGoal = isFutureDate(goalStartDate);
	const isPastGoal = isPastDate(goalEndDate);

	if (isFutureGoal) {
		return (
			<Pill size="s" color="blue">
				{translator.gettext('Future goal')}
			</Pill>
		);
	}

	if (isPastGoal) {
		return <Pill size="s">{translator.gettext('Past goal')}</Pill>;
	}

	return null;
};

export default GoalStatusPill;
