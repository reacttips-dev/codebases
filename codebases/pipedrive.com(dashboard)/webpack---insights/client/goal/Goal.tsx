import { isEmpty, get } from 'lodash';
import React, { useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Spacing, Panel } from '@pipedrive/convention-ui-react';

import { useGoalCard, useGoalPermissions } from '../hooks/goals';
import { InsightsApiClient } from '../api/apollo/insightsApiClient';
import { GET_CACHED_REPORT_IS_EDITING } from '../api/graphql';
import useBlockNavigation from '../hooks/useBlockNavigation';
import usePlanPermissions from '../hooks/usePlanPermissions';
import useSettingsApi from '../hooks/useSettingsApi';
import GoalCard from '../molecules/GoalCard';
import GoalDetailsPanel from '../molecules/GoalDetailsPanel';
import ErrorMessage from '../molecules/ErrorMessage';
import GoalActionBar from './actionBar/GoalActionBar';
import { DialogType, ModalType } from '../utils/constants';
import GoalReportArea from './chartAndTableArea/GoalReportArea';
import { Report } from '../types/apollo-query-types';
import { Goal as GoalType } from '../types/goals';

import NoConnectionWider from '../utils/svg/NoConnectionWider.svg';
import styles from './Goal.pcss';

interface GoalProps {
	goal: GoalType;
	goalReport: Report;
}

const Goal: React.FC<GoalProps> = ({ goal, goalReport }) => {
	const { hasViewOnlyPermission } = useGoalPermissions();

	const goalCardData = useGoalCard({ goal });

	const { saveUnsavedReport } = useSettingsApi();
	const { canSeeReport } = usePlanPermissions();
	const canSeeCurrentReport = canSeeReport(goalReport);

	const [isGoalCardExpanded, setGoalCardExpanded] = useState<boolean>(true);
	const [hoveredOnGoalCard, setHoveredOnGoalCard] = useState<boolean>(false);
	const [visibleModal, setVisibleModal] = useState<ModalType>(null);
	const [visibleDialog, setVisibleDialog] = useState<DialogType>(null);

	const userCanOnlyViewGoal = hasViewOnlyPermission(goal);
	const isEditButtonVisible = !userCanOnlyViewGoal && hoveredOnGoalCard;

	const isEditingQuery = useQuery(GET_CACHED_REPORT_IS_EDITING, {
		client: InsightsApiClient,
		variables: { id: goalReport.id },
	});
	const isEditing = get(
		isEditingQuery,
		'data.cachedReports.unsavedReport.is_editing',
	);

	useBlockNavigation({
		isBlocked: isEditing,
		onNavigate: () => {
			setVisibleDialog(DialogType.GOAL_DISCARD_CHANGES);
		},
	});

	const showEditButton = () => {
		if (canSeeCurrentReport) {
			setHoveredOnGoalCard(true);
		}
	};

	const hideEditButton = () => setHoveredOnGoalCard(false);

	const GoalCardTopBar = (
		<div onMouseEnter={showEditButton} onMouseLeave={hideEditButton}>
			<GoalDetailsPanel
				goal={goal}
				goalCardData={goalCardData}
				setGoalCardExpanded={setGoalCardExpanded}
				isGoalCardExpanded={isGoalCardExpanded}
				isEditButtonVisible={isEditButtonVisible}
				isEditing={isEditing}
				visibleDialog={visibleDialog}
				setVisibleDialog={setVisibleDialog}
				hideEditButton={hideEditButton}
			/>
		</div>
	);

	const GoalCardContent = (
		<div onMouseEnter={showEditButton} onMouseLeave={hideEditButton}>
			<Spacing horizontal="m">
				<GoalCard goalCardData={goalCardData} />
			</Spacing>
		</div>
	);

	const saveReport = useCallback(async () => {
		await saveUnsavedReport(goalReport.id);
	}, [goalReport.id]);

	const getGoalCardPanel = (canSeeCurrentReport: boolean) => {
		return (
			<>
				<div className={styles.stickyHeader}>
					<GoalActionBar
						goal={goal}
						visibleDialog={visibleDialog}
						setVisibleDialog={setVisibleDialog}
						visibleModal={visibleModal}
						setVisibleModal={setVisibleModal}
						canSeeCurrentReport={canSeeCurrentReport}
						isEditing={isEditing}
						saveReport={saveReport}
					/>
					{GoalCardTopBar}
				</div>
				{isGoalCardExpanded && GoalCardContent}
			</>
		);
	};

	if (isEmpty(goalReport)) {
		return (
			<div className={styles.container}>
				{getGoalCardPanel(false)}
				<Spacing all="m" className={styles.errorMessageArea}>
					<Panel className={styles.errorMessagePanel}>
						<ErrorMessage
							allowed
							hasRetryButton
							svg={<NoConnectionWider />}
							data-test="error-message-container"
						/>
					</Panel>
				</Spacing>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			{getGoalCardPanel(canSeeCurrentReport)}
			<GoalReportArea goal={goal} goalReport={goalReport} />
		</div>
	);
};

export default React.memo(Goal);
