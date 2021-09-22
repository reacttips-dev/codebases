import React, { useRef } from 'react';
import classnames from 'classnames';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { Separator, Spacing } from '@pipedrive/convention-ui-react';

import { Report } from '../../../types/apollo-query-types';
import ResizeHandle from '../../../utils/svg/ResizeHandle.svg';
import {
	ENTRYPOINT_PROPERTIES,
	REPORT_OPENED_SOURCE_PROPERTIES,
} from '../../../utils/metrics/analytics-properties';
import { isPublicPage } from '../../../utils/helpers';
import { REPORTS_WITH_TITLE } from '../../../utils/constants';
import ChartTitleWrapper from '../../../atoms/ChartTitle';
import { MapDataReturnType } from '../../../types/data-layer';
import PaginationButtons from '../../../atoms/PaginationButtons';
import { Goal } from '../../../types/goals';
import CollapsingList from '../../../molecules/CollapsingList';
import { canEditItem } from '../../../utils/sharingUtils';
import WidgetTop from './widgetTop/WidgetTop';
import {
	getAppliedFiltersForReport,
	getWidgetTitle,
	shouldShowPagination,
	getIsWidgetLegendVisible,
	shouldNotNavigate,
} from './widgetWrapperUtils';
import { getQuickFilters } from '../../../api/commands/quick-filters';
import { findDashboardById } from '../../../api/commands/dashboards';
import { trackingParamsVar } from '../../../api/vars/settingsApi';
import { getCurrentUserId } from '../../../api/webapp';
import { isStackedBarOrderReversed } from '../../../atoms/ChartTypes/chartTypeUtils';

import styles from './WidgetWrapper.pcss';

interface WidgetWrapperProps {
	report: Report;
	hasNoData?: boolean;
	navigateToReportDetails: () => void;
	hasSegment: boolean;
	children?: React.ReactNode;
	reportData?: MapDataReturnType;
	showFooterOnHover?: boolean;
	pageNumber?: number;
	setPageNumber?: (page: number) => void;
	hasNextPage?: boolean;
	dashboardId?: string;
	isFirstWidget?: boolean;
	goal?: Goal;
}

const WidgetWrapper: React.FC<WidgetWrapperProps> = ({
	hasNoData = false,
	navigateToReportDetails,
	hasSegment = false,
	children,
	reportData,
	report,
	showFooterOnHover = false,
	pageNumber,
	setPageNumber,
	hasNextPage,
	dashboardId,
	isFirstWidget,
	goal,
}) => {
	const filtersListSummaryNode = useRef<HTMLDivElement>(null);
	const contentAreaNode = useRef<HTMLDivElement>(null);

	const isViewingPublicPage = isPublicPage();
	const currentUserId = getCurrentUserId();
	const dashboard = findDashboardById(dashboardId, isViewingPublicPage);
	const canEditDashboard = canEditItem(dashboard, currentUserId);

	const {
		id: reportId,
		name: reportName,
		is_goals_report: isGoalsReport,
		chart_type: chartType,
		report_type: reportType,
		data_type: reportDataType,
		parameters,
	} = report;

	const widgetTitle = getWidgetTitle(goal, reportName);
	const isRestrictedGoal = isGoalsReport && !goal;
	const isWidgetClickable = !isViewingPublicPage && !isRestrictedGoal;
	const isChartTypeScorecard =
		chartType === insightsTypes.ChartType.SCORECARD;
	const isChartTypeTable = chartType === insightsTypes.ChartType.TABLE;
	const isChartTypeBar = chartType === insightsTypes.ChartType.BAR;

	const isChartWithTitle =
		REPORTS_WITH_TITLE.includes(reportType) && !isChartTypeScorecard;
	const quickFilters = getQuickFilters(dashboardId);
	const appliedFiltersForReport = getAppliedFiltersForReport(
		parameters.filter_by,
		quickFilters,
	);
	const isWidgetLegendVisible = getIsWidgetLegendVisible({
		hasSegment,
		reportData,
		isChartTypeScorecard,
		isChartTypeTable,
	});
	const chartMetaData = reportData?.chartMetaData;
	const showPagination = shouldShowPagination({
		chartMetaData,
		chartType,
		pageNumber,
		goal,
		quickFilters,
		isGoalsReport,
	});

	const isCollapsingListOrderReversed =
		!isStackedBarOrderReversed(parameters?.segment_by) &&
		reportType !== insightsTypes.ReportType.DEALS_CONVERSION_OVERALL;

	const resizeHandle = (
		<div
			className={classnames('widget-resize-handle', styles.resizeHandle)}
		>
			<ResizeHandle />
		</div>
	);

	const handleNavigation = (
		event: React.MouseEvent | React.KeyboardEvent,
	) => {
		if (
			shouldNotNavigate({
				hasNoData,
				isChartTypeTable,
				contentAreaNode,
				filtersListSummaryNode,
				event,
				isWidgetClickable,
			})
		) {
			return;
		}

		trackingParamsVar({
			source: REPORT_OPENED_SOURCE_PROPERTIES.dashboard,
			entryPoint: ENTRYPOINT_PROPERTIES.reports,
		});

		navigateToReportDetails();
	};

	return (
		<div data-test={`widget-${widgetTitle}`}>
			<WidgetTop
				reportId={reportId}
				reportName={reportName}
				reportType={reportType}
				reportDataType={reportDataType}
				isGoalsReport={isGoalsReport}
				dashboardId={dashboardId}
				handleNavigation={handleNavigation}
				appliedFiltersForReport={appliedFiltersForReport}
				isFirstWidget={isFirstWidget}
				goal={goal}
			/>

			{isChartWithTitle && !hasNoData && (
				<>
					<Spacing vertical="s" horizontal="m">
						<ChartTitleWrapper
							reportType={reportType}
							reportData={reportData}
							chartType={chartType}
							measureByFilter={parameters.measure_by}
							isInWidget
						/>
					</Spacing>

					<Separator />
				</>
			)}

			<div
				className={classnames(styles.chartArea, {
					[styles.withoutLegendArea]: !isWidgetLegendVisible,
					[styles.chartWithTitleArea]: isChartWithTitle,
					[styles.TableArea]: isChartTypeTable && !hasNoData,
					[styles.withoutData]: hasNoData,
					[styles.fadedBars]: showPagination,
					[styles.fadedBarsHorizontal]:
						showPagination && isChartTypeBar,

					[styles.fadeFirst]: pageNumber > 0,
					[styles.fadeLast]: hasNextPage,
					[styles.fadeFirstHoriz]: pageNumber > 0 && isChartTypeBar,
					[styles.fadeLastHoriz]: hasNextPage && isChartTypeBar,
					[styles.clickableWidget]: isWidgetClickable,
				})}
				ref={contentAreaNode}
			>
				{children}
				{showPagination && (
					<PaginationButtons
						isWidget
						pageNumber={pageNumber}
						setPageNumber={setPageNumber}
						chartType={chartType}
						hasNextPage={hasNextPage}
						chartMetaData={chartMetaData}
					/>
				)}
			</div>

			{isWidgetLegendVisible && !hasNoData && (
				<div
					className={classnames(
						'insight-widget-footer',
						styles.widgetFooter,
						{
							[styles.showFooterOnHover]: showFooterOnHover,
						},
					)}
				>
					<Separator />
					<Spacing vertical="s" horizontal="m">
						<CollapsingList
							data={reportData?.legendData}
							alignment="left"
							type="legend"
							forwardedRef={filtersListSummaryNode}
							isOrderReversed={isCollapsingListOrderReversed}
						/>
					</Spacing>
				</div>
			)}
			{!isViewingPublicPage && canEditDashboard && resizeHandle}
		</div>
	);
};

export default WidgetWrapper;
