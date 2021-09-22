import React, { useState, useEffect, useMemo } from 'react';
import { useReactiveVar } from '@apollo/client';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import classNames from 'classnames';
import 'react-grid-layout/css/styles.css';
import { useTranslator } from '@pipedrive/react-utils';

import {
	isReportAlreadyInDashboard,
	hasMaximumAmountOfReportsInDashboard,
	uid,
	addReportPropertiesToDashboardReport,
	removeInvalidReports,
} from '../utils/helpers';
import { ReportAddedToDashboardSource } from '../utils/metrics/report-analytics';
import { trackDashboardOpened } from '../utils/metrics/dashboard-analytics';
import {
	DialogType,
	CoachmarkTags,
	ACCEPTED_DROP_TARGET_ITEMS,
	SideMenuItemGroup,
} from '../utils/constants';
import LockedMessage, {
	LockedMessageType,
} from '../atoms/NotAvailableMessage/LockedMessage';
import DashboardActionBar from './actionBar/DashboardActionBar';
import EmptyDashboardMessage from '../atoms/EmptyDashboardMessage';
import RemoveArea from '../atoms/RemoveArea/RemoveArea';
import useSettingsApi from '../hooks/useSettingsApi';
import localState from '../utils/localState';
import usePlanPermissions from '../hooks/usePlanPermissions';
import {
	Report,
	Dashboard as DashboardType,
} from '../types/apollo-query-types';
import IntroDialog from '../molecules/IntroDialog';
import useOnboardingCoachmarks from '../utils/onboardingCoachmarkUtils';
import { getOwnItems, doesItemHaveAnotherOwner } from '../utils/sharingUtils';
import { getGoalById } from '../api/commands/goals';
import { getCurrentUserId } from '../api/webapp';
import { Board } from '../shared';
import { canAddReportToDashboard } from '../utils/dragAndDropUtils';
import DashboardGrid from './grid/DashboardGrid';
import { generateLayout } from '../utils/styleUtils';
import { getReports } from './DashboardUtils';
import { isDraggingReportVar, isViewInFocusVar } from '../api/vars/settingsApi';

import styles from './Dashboard.pcss';

interface DashboardProps {
	dashboard: DashboardType;
	canSeeCurrentDashboard: boolean;
}

const uniqueId = uid();

const onDrop = async ({
	isGoalTypeReport,
	report,
	dashboard,
	currentUserId,
	addReportToDashboard,
}: {
	isGoalTypeReport: boolean;
	report: Report;
	dashboard: DashboardType;
	currentUserId: number;
	addReportToDashboard: (
		id: string,
		reportId: string,
		dragArea: string,
	) => Promise<void>;
}): Promise<void> => {
	const reportId = isGoalTypeReport
		? getGoalById(report.id).report_ids[0]
		: report.id;

	if (
		canAddReportToDashboard({
			dashboard,
			report,
			reportId,
			currentUserId,
		})
	) {
		await addReportToDashboard(
			dashboard.id,
			reportId,
			ReportAddedToDashboardSource.DRAG_TO_DASHBOARD_AREA,
		);
	}
};

const onCollect = ({
	monitor,
	dashboard,
	currentUserId,
}: {
	monitor: DropTargetMonitor;
	dashboard: DashboardType;
	currentUserId: number;
}): {
	canDrop: boolean;
	isMaximumReportsReached: boolean;
	isAlreadyInDashboard: boolean;
	isGoalTypeReport: boolean;
	isOtherUserReport: boolean;
} => {
	const item = monitor.getItem();
	const isGoalTypeReport = item?.type === SideMenuItemGroup.GOALS;
	const reportId = isGoalTypeReport
		? getGoalById(item?.id)?.report_ids[0]
		: item?.id;

	return {
		canDrop:
			monitor.canDrop() &&
			canAddReportToDashboard({
				dashboard,
				report: item,
				reportId,
				currentUserId,
			}),
		isMaximumReportsReached:
			hasMaximumAmountOfReportsInDashboard(dashboard),
		isAlreadyInDashboard: isReportAlreadyInDashboard(dashboard, reportId),
		isGoalTypeReport,
		isOtherUserReport: doesItemHaveAnotherOwner(item, currentUserId),
	};
};

const Dashboard: React.FC<DashboardProps> = ({
	dashboard,
	canSeeCurrentDashboard,
}) => {
	const translator = useTranslator();
	const [showRemoveArea, setShowRemoveArea] = useState(false);
	const [layouts, setLayouts] = useState({ lg: [], md: [], sm: [] });
	const isDraggingReport = useReactiveVar(isDraggingReportVar);

	const { addReportToDashboard } = useSettingsApi();
	const { getCurrentUserSettings } = localState();
	const { dashboards, reports } = getCurrentUserSettings();
	const currentUserId = getCurrentUserId();
	const isViewInFocus = useReactiveVar(isViewInFocusVar);

	const dashboardReports = useMemo(
		() =>
			addReportPropertiesToDashboardReport(
				removeInvalidReports(dashboard.reports, reports),
				reports,
			),
		[dashboard.id, dashboard.reports.length],
	);

	useEffect(() => {
		if (isViewInFocus) {
			trackDashboardOpened(dashboard, currentUserId);
		}
	}, [dashboard.id, isViewInFocus]);

	const [
		{
			canDrop,
			isMaximumReportsReached,
			isGoalTypeReport,
			isAlreadyInDashboard,
			isOtherUserReport,
		},
		drop,
	] = useDrop({
		accept: ACCEPTED_DROP_TARGET_ITEMS,
		drop: async (report: Report): Promise<void> =>
			onDrop({
				isGoalTypeReport,
				report,
				dashboard,
				currentUserId,
				addReportToDashboard,
			}),
		collect: (monitor) => onCollect({ monitor, dashboard, currentUserId }),
	});

	const { isAdmin } = usePlanPermissions();

	useEffect(() => {
		const layout = generateLayout(
			uniqueId,
			getReports({
				dashboard,
				dashboardReports,
				uniqueId,
				layouts,
				isDraggingReport,
			}),
		);

		setLayouts({
			lg: layout,
			md: layout,
			sm: layout,
		});
	}, [
		isDraggingReport,
		layouts.lg.length,
		dashboard.id,
		dashboard.reports.length,
	]); // eslint-disable-line

	const { INSIGHTS_ONBOARDING_INTRO_DIALOG } = CoachmarkTags;

	const { visible: coachMarkIsVisible, close: closeCoachmark } =
		useOnboardingCoachmarks()[INSIGHTS_ONBOARDING_INTRO_DIALOG];

	const renderLockedMessage = () => (
		<LockedMessage
			type={LockedMessageType.DASHBOARD}
			hasMargin
			title={translator.gettext(
				'Multiple dashboards available on Professional',
			)}
			message={
				isAdmin
					? translator.pgettext(
							'This dashboard is no longer available on your plan. Upgrade to the Professional plan to regain access.',
							'This dashboard is no longer available on your plan. Upgrade to the %s%s%s plan to regain access.',
							[
								`<strong class="${styles.textStrong}">`,
								`${translator.gettext('Professional')}`,
								`</strong>`,
							],
					  )
					: translator.pgettext(
							'Multiple dashboards are no longer available on your plan. Ask an admin user to upgrade to the Professional plan to regain access.',
							'Multiple dashboards are no longer available on your plan. Ask an admin user to upgrade to the %s%s%s plan to regain access.',
							[
								`<strong class="${styles.textStrong}">`,
								`${translator.gettext('Professional')}`,
								`</strong>`,
							],
					  )
			}
			showUpgrade={isAdmin}
			buttonText={translator.gettext('Delete this dashboard')}
			buttonAction={DialogType.DASHBOARD_DELETE}
		/>
	);

	if (Object.keys(dashboard).length === 0) {
		return null;
	}

	const ownDashboardsCount = getOwnItems(dashboards, currentUserId)?.length;

	return (
		<div className={styles.dashboard}>
			{coachMarkIsVisible && isViewInFocus && (
				<IntroDialog
					onClose={() => {
						closeCoachmark();
					}}
				/>
			)}
			<DashboardActionBar
				dashboard={dashboard}
				ownDashboardsCount={ownDashboardsCount}
				canSeeCurrentDashboard={canSeeCurrentDashboard}
				isPeerItem={doesItemHaveAnotherOwner(dashboard, currentUserId)}
			/>
			{canSeeCurrentDashboard ? (
				<Board
					ref={drop}
					className={classNames({
						[styles.boardEmpty]: layouts.lg.length === 0,
					})}
				>
					{layouts.lg.length === 0 ? (
						<EmptyDashboardMessage isHover={isDraggingReport} />
					) : (
						<DashboardGrid
							dashboard={dashboard}
							dashboardReports={dashboardReports}
							layouts={layouts}
							setShowRemoveArea={setShowRemoveArea}
							canDrop={canDrop}
							isMaximumReportsReached={isMaximumReportsReached}
							isAlreadyInDashboard={isAlreadyInDashboard}
							isGoalTypeReport={isGoalTypeReport}
							isOtherUserReport={isOtherUserReport}
						/>
					)}
					<RemoveArea isShown={showRemoveArea} />
				</Board>
			) : (
				renderLockedMessage()
			)}
		</div>
	);
};

export default Dashboard;
