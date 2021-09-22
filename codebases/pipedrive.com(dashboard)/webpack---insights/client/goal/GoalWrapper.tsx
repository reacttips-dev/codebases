import React from 'react';
import { Spinner } from '@pipedrive/convention-ui-react';
import { useReactiveVar } from '@apollo/client';

import SnackbarMessage from '../atoms/SnackbarMessage';
import Goal from './Goal';
import {
	Dashboard,
	SelectedItem,
	SelectedItemType,
} from '../types/apollo-query-types';
import { getGoals, getGoalById } from '../api/commands/goals';
import localState from '../utils/localState';
import { goalsState } from '../api/vars/goalsState';
import { cachedReportsVar } from '../api/vars/insightsApi';
import { ContentWrapper } from '../shared';
import { getLogger } from '../api/webapp';
import { findCachedReportById } from '../utils/reportsUtils';

import styles from './GoalWrapper.pcss';

interface GoalWrapperProps {
	selectedItem: SelectedItem;
	dashboards: Dashboard[];
	snackbarMessage: string;
	handleRoutingFallback: Function;
}

const GoalWrapper: React.FC<GoalWrapperProps> = ({
	selectedItem,
	handleRoutingFallback,
	dashboards,
	snackbarMessage,
}) => {
	const { setCachedReport } = localState();
	const { loading: goalsLoading } = useReactiveVar(goalsState);
	const cachedReports = useReactiveVar(cachedReportsVar);

	const goals = getGoals();
	const goal = getGoalById(selectedItem.id);

	if (goalsLoading) {
		return (
			<div className={styles.contentLoader}>
				<Spinner size="l" />
			</div>
		);
	}

	if (!goals[0] || !goal?.report_ids) {
		return handleRoutingFallback({
			items: goals,
			item: goal,
			itemType: SelectedItemType.GOALS,
			fallbackItem: dashboards[0],
			fallbackItemType: SelectedItemType.DASHBOARDS,
		});
	}

	let cachedGoalReport: any;

	try {
		cachedGoalReport = findCachedReportById(
			goal.report_ids[0],
			cachedReports,
			setCachedReport,
		);
	} catch {
		getLogger().remote(
			'error',
			`Could not get cached report with id: ${goal.report_ids[0]}, to assign to goal with id: ${goal.id}`,
		);

		return handleRoutingFallback({
			items: goals,
			itemType: SelectedItemType.GOALS,
			fallbackItem: dashboards[0],
			fallbackItemType: SelectedItemType.DASHBOARDS,
		});
	}

	return (
		<ContentWrapper>
			<Goal goal={goal} goalReport={cachedGoalReport} />
			<SnackbarMessage message={snackbarMessage} />
		</ContentWrapper>
	);
};

export default GoalWrapper;
