import React from 'react';
import {
	Responsive,
	WidthProvider,
	ReactGridLayoutProps,
	Layout,
} from 'react-grid-layout';
import classNames from 'classnames';
import 'react-grid-layout/css/styles.css';
import { useTranslator } from '@pipedrive/react-utils';

import { getReportById } from '../../utils/helpers';
import {
	trackDashboardReportResized,
	trackDashboardReportReordered,
} from '../../utils/metrics/dashboard-analytics';
import Widget from '../widget';
import DropNewReportArea from '../../atoms/DropNewReportArea';
import localState from '../../utils/localState';
import {
	Dashboard as DashboardType,
	DashboardReport,
} from '../../types/apollo-query-types';
import { parseQuickFilters } from '../../utils/quickFilterUtils';
import {
	canEditItem,
	doesItemHaveAnotherOwner,
} from '../../utils/sharingUtils';
import { getMoveItemToDashboardWarningMessage } from '../../utils/messagesUtils';
import {
	getFirstWidget,
	handleUpdateDashboardReports,
} from './DashboardGridUtils';
import { updateDashboardReports } from '../../api/commands/dashboards';
import { getCurrentUserId, getUserById } from '../../api/webapp';

import styles from './DashboardGrid.pcss';

interface DashboardGridProps {
	dashboard: DashboardType;
	dashboardReports: DashboardReport[];
	layouts: any;
	canDrop: boolean;
	isMaximumReportsReached: boolean;
	isAlreadyInDashboard: boolean;
	isGoalTypeReport: boolean;
	isOtherUserReport: boolean;
	setShowRemoveArea: Function;
}

// eslint-disable-next-line new-cap
const GridLayout = WidthProvider(Responsive);

const DashboardGrid: React.FC<DashboardGridProps> = ({
	dashboard,
	dashboardReports,
	layouts,
	setShowRemoveArea,
	canDrop,
	isMaximumReportsReached,
	isAlreadyInDashboard,
	isGoalTypeReport,
	isOtherUserReport,
}) => {
	const translator = useTranslator();

	const { getCurrentUserSettings } = localState();
	const { dashboards, reports } = getCurrentUserSettings();
	const userId = getCurrentUserId();
	const currentUserId = getCurrentUserId();
	const canEditDashboard = canEditItem(dashboard, currentUserId);

	const onDragStart = () => {
		setShowRemoveArea(true);
	};

	// eslint-disable-next-line max-params
	const onDrag: ReactGridLayoutProps['onDrag'] = (
		layout: any,
		oldItem: any,
		newItem: any,
		placeholder: any,
		e: any,
		element: HTMLElement,
	) => {
		element.classList.toggle(
			'react-grid-item-scaled',
			e.clientY > window.outerHeight - 400,
		);
	};

	const handleUpdateDashboardDefaultProps = {
		dashboardReports,
		dashboard,
		reports,
		dashboards,
		updateDashboardReports,
		translator,
	};

	// eslint-disable-next-line max-params
	const onDragStop = async (
		layout: Layout[],
		oldItem: Layout,
		newItem: Layout,
		placeholder: Layout,
		event: any,
		element: HTMLElement,
	) => {
		const report = getReportById(newItem.i, reports);
		const isRemoveEvent =
			event?.target.dataset.targetId === 'REMOVE-REPORT';

		await handleUpdateDashboardReports({
			...handleUpdateDashboardDefaultProps,
			layout,
			newItem,
			element,
			event,
		});

		if (!isRemoveEvent) {
			trackDashboardReportReordered(report.id, dashboard.id);
		}

		setShowRemoveArea(false);
	};

	const onResizeStop = (
		layout: Layout[],
		oldItem: Layout,
		newItem: Layout,
	) => {
		const report = getReportById(newItem.i, reports);

		handleUpdateDashboardReports({
			...handleUpdateDashboardDefaultProps,
			layout,
			newItem,
		});
		trackDashboardReportResized(report.id, dashboard.id);
	};

	const isOtherUserDashboard = doesItemHaveAnotherOwner(
		dashboard,
		currentUserId,
	);

	const dropNewReportAreaTitle = canDrop
		? translator.gettext('Drag report here')
		: getMoveItemToDashboardWarningMessage({
				isMaximumReportsReached,
				isAlreadyInDashboard,
				isGoalTypeReport,
				translator,
				isOtherUserReport,
				isOtherUserDashboard,
				...(isOtherUserDashboard && {
					dashboardOwnerName: getUserById(dashboard.user_id)?.name,
				}),
		  });

	return (
		<GridLayout
			layouts={layouts}
			rowHeight={60}
			cols={{ lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 }}
			breakpoints={{ lg: 1200, md: 950, sm: 768, xs: 480, xxs: 0 }}
			margin={[8, 8]}
			containerPadding={[16, 16]}
			onDragStart={onDragStart}
			onDrag={onDrag}
			onDragStop={onDragStop}
			onResizeStop={onResizeStop}
			draggableHandle=".widget-drag-handle"
			isResizable={canEditDashboard}
			isDraggable={canEditDashboard}
		>
			{layouts.lg.map((pos: any) => {
				const currentReport = dashboardReports.find(
					(i) => i.id === pos.i,
				);

				// Last report in array is considered as the first report in UI
				const lastReportInArray = layouts.lg[layouts.lg.length - 1];
				const currentReportId = currentReport && currentReport.id;
				const firstItem = currentReportId === lastReportInArray.i;
				const leftTopItem = getFirstWidget(layouts);

				return (
					<div
						key={pos.i}
						className={classNames({
							[styles.firstGridItem]: firstItem,
						})}
					>
						{currentReport ? (
							<Widget
								reportId={currentReport.id}
								dashboardId={dashboard.id}
								reports={reports}
								quickFilters={parseQuickFilters(
									dashboard.quick_filters,
									userId,
								)}
								isFirstWidget={
									currentReport.id === leftTopItem.i
								}
							/>
						) : (
							<DropNewReportArea
								title={dropNewReportAreaTitle}
								isAlreadyInDashboard={!canDrop}
							/>
						)}
					</div>
				);
			})}
		</GridLayout>
	);
};

export default DashboardGrid;
