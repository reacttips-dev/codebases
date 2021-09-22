import React from 'react';
import classnames from 'classnames';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes, helpers } from '@pipedrive/insights-core';

import useRouter from '../../hooks/useRouter';
import StatsChart from './StatsChart';
import RevenueForecastChart from './RevenueForecastChart';
import OverallConversionChart from './OverallConversionChart';
import ProgressChart from './ProgressChart';
import RecurringRevenueMovementChart from './RecurringRevenueMovementChart';
import RevenueChart from './RevenueChart';
import DurationChart from './DurationChart';
import ActivityChart from './ActivityChart';
import MailsChart from './MailsChart';
import WidgetWrapper from '../../dashboard/widget/widgetWrapper/WidgetWrapper';
import ConversionFunnel from '../../atoms/ChartTypes/ConversionFunnel';
import { getValueFromUnsavedOrOriginalReport } from '../../utils/reportObjectHelpers';
import { isPublicPage } from '../../utils/helpers';
import {
	FunnelChartSummaryDataObject,
	MapDataReturnType,
} from '../../types/data-layer';
import { isGroupByTime } from '../../atoms/ChartGroupByFilter/chartGroupByUtils';
import { Goal } from '../../types/goals';
import { SideMenuItemGroup } from '../../utils/constants';
import { getGoalErrorType } from './chartUtils';
import { QuickFilters } from '../../types/apollo-query-types';
import { ListViewSegmentDataType } from '../../types/list-view';
import ChartWidgetNoData from '../ChartWidgetNoData';
import { findDashboardById } from '../../api/commands/dashboards';
import { getCurrentUserId } from '../../api/webapp';
import { canEditItem } from '../../utils/sharingUtils';

import styles from './Chart.pcss';

interface ChartProps {
	report: any;
	widget?: boolean;
	groupByFilter: string;
	measureByFilter: string;
	segmentByFilter: string;
	hasSegment: boolean;
	measureByCustomName?: string;
	intervalFilter: insightsTypes.Interval;
	hasNoData: boolean;
	hasNextPage: boolean;
	paginationLineRightPosition?: number;
	setPaginationLineRightPosition: any;
	showListView?: (data: ListViewSegmentDataType) => void;
	reportData: MapDataReturnType;
	pageNumber?: number;
	setPageNumber?: (page: number) => void;
	dashboardId?: string;
	goal?: Goal;
	isFirstWidget?: boolean;
	quickFilters?: QuickFilters;
}

const Chart: React.FC<ChartProps> = ({
	report,
	widget = false,
	reportData,
	groupByFilter,
	measureByFilter,
	segmentByFilter,
	hasSegment = false,
	measureByCustomName,
	intervalFilter,
	hasNoData = false,
	hasNextPage = false,
	paginationLineRightPosition,
	setPaginationLineRightPosition,
	showListView,
	pageNumber,
	setPageNumber,
	dashboardId,
	goal,
	isFirstWidget,
	quickFilters,
}) => {
	const [goTo] = useRouter();
	const translator = useTranslator();
	const {
		chartSummaryData,
		groupedAndSegmentedData,
		uniqueSegments,
		legendData,
	} = reportData;
	const currentUserId = getCurrentUserId();
	const isViewingPublicPage = isPublicPage();
	const dashboard = findDashboardById(dashboardId, isViewingPublicPage);
	const canEditDashboard = canEditItem(dashboard, currentUserId);

	const reportDataType = report.data_type;
	const isGoalsReport = report.is_goals_report;

	const handleNavigationToReportDetails = () => {
		goTo(
			isGoalsReport
				? {
						id: goal?.id,
						type: SideMenuItemGroup.GOALS,
				  }
				: {
						id: report.id,
						type: SideMenuItemGroup.REPORTS,
				  },
		);
	};
	const reportType = getValueFromUnsavedOrOriginalReport(
		report,
		'report_type',
	);
	const chartType = getValueFromUnsavedOrOriginalReport(report, 'chart_type');

	const isGroupedByTime = isGroupByTime(groupByFilter);
	const isMeasureByMonetary =
		helpers.deals.isMeasureByMonetary(measureByFilter);

	const axisDataKey =
		segmentByFilter === groupByFilter ||
		!segmentByFilter ||
		!isGroupedByTime
			? 'name'
			: groupByFilter;
	const segmentBy = segmentByFilter || groupByFilter;

	const getDealsChartComponent = () => {
		switch (reportType) {
			case insightsTypes.ReportType.DEALS_CONVERSION_OVERALL:
				return (
					<OverallConversionChart
						chartType={chartType}
						data={groupedAndSegmentedData}
						isShownAsWidget={widget}
						legendData={legendData}
						measureByFilter={measureByFilter}
					/>
				);
			case insightsTypes.ReportType.DEALS_RECURRING_REVENUE:
				return (
					<RevenueChart
						chartType={chartType}
						data={groupedAndSegmentedData}
						isShownAsWidget={widget}
						legendData={legendData}
						measureByFilter={measureByFilter}
						showChartListView={showListView}
					/>
				);
			case insightsTypes.ReportType.DEALS_PROGRESS:
				return (
					<ProgressChart
						chartType={chartType}
						isShownAsWidget={widget}
						hasSegment={hasSegment}
						groupedAndSegmentedData={groupedAndSegmentedData}
						groupByFilter={groupByFilter}
						segmentByFilter={segmentByFilter}
						isMeasureByMonetary={isMeasureByMonetary}
						uniqueSegments={uniqueSegments}
						intervalFilter={intervalFilter}
						axisDataKey={axisDataKey}
						showChartListView={showListView}
						measureByFilter={measureByFilter}
						isGoalsReport={isGoalsReport}
						goal={goal}
					/>
				);
			case insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT:
				return (
					<RecurringRevenueMovementChart
						chartType={chartType}
						data={groupedAndSegmentedData}
						isShownAsWidget={widget}
						legendData={legendData}
						measureByFilter={measureByFilter}
						showChartListView={showListView}
					/>
				);
			case insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION:
				return (
					<ConversionFunnel
						data={groupedAndSegmentedData}
						isShownAsWidget={widget}
						measureByFilter={measureByFilter}
						hasNextPage={hasNextPage}
						translator={translator}
						paginationLineRightPosition={
							paginationLineRightPosition
						}
						setPaginationLineRightPosition={
							setPaginationLineRightPosition
						}
						measureByCustomName={measureByCustomName}
						chartSummaryData={
							chartSummaryData as FunnelChartSummaryDataObject
						}
					/>
				);
			case insightsTypes.ReportType.DEALS_REVENUE_FORECAST:
				return (
					<RevenueForecastChart
						chartType={chartType}
						isShownAsWidget={widget}
						groupedAndSegmentedData={groupedAndSegmentedData}
						segmentBy={segmentBy}
						measureByFilter={measureByFilter}
						uniqueSegments={uniqueSegments}
						intervalFilter={intervalFilter}
						axisDataKey={axisDataKey}
						showChartListView={showListView}
						isGoalsReport={isGoalsReport}
						goal={goal}
					/>
				);
			case insightsTypes.ReportType.DEALS_STATS:
				return (
					<StatsChart
						chartType={chartType}
						isShownAsWidget={widget}
						hasSegment={hasSegment}
						groupedAndSegmentedData={groupedAndSegmentedData}
						segmentBy={segmentBy}
						measureByFilter={measureByFilter}
						segmentByFilter={segmentByFilter}
						uniqueSegments={uniqueSegments}
						intervalFilter={intervalFilter}
						axisDataKey={axisDataKey}
						showChartListView={showListView}
						isGoalsReport={isGoalsReport}
						goal={goal}
					/>
				);
			case insightsTypes.ReportType.DEALS_DURATION:
				return (
					<DurationChart
						groupByFilter={groupByFilter}
						chartType={chartType}
						isShownAsWidget={widget}
						data={groupedAndSegmentedData}
						uniqueSegments={uniqueSegments}
						intervalFilter={intervalFilter}
						showChartListView={showListView}
						chartSummaryData={chartSummaryData}
						measureByFilter={measureByFilter}
					/>
				);
			default:
				return null;
		}
	};

	const getActivitiesChartComponent = () => {
		if (reportType === insightsTypes.ReportType.ACTIVITIES_STATS) {
			return (
				<ActivityChart
					measureByFilter={measureByFilter}
					chartType={chartType}
					isShownAsWidget={widget}
					hasSegment={hasSegment}
					data={groupedAndSegmentedData}
					segmentByFilter={segmentBy}
					groupByFilter={groupByFilter}
					uniqueSegments={uniqueSegments}
					intervalFilter={intervalFilter}
					axisDataKey={axisDataKey}
					showChartListView={showListView}
					isGoalsReport={isGoalsReport}
					goal={goal}
				/>
			);
		}

		return null;
	};

	const getMailsChartComponent = () => {
		if (reportType === insightsTypes.ReportType.MAILS_STATS) {
			return (
				<MailsChart
					chartType={chartType}
					isShownAsWidget={widget}
					hasSegment={hasSegment}
					data={groupedAndSegmentedData}
					segmentByFilter={segmentBy}
					uniqueSegments={uniqueSegments}
					intervalFilter={intervalFilter}
					axisDataKey={axisDataKey}
					showChartListView={showListView}
					measureByFilter={measureByFilter}
				/>
			);
		}

		return null;
	};

	const renderChartType = () => {
		const isDealsChart = reportDataType === insightsTypes.DataType.DEALS;
		const isActivitiesChart =
			reportDataType === insightsTypes.DataType.ACTIVITIES;
		const isMailsChart = reportDataType === insightsTypes.DataType.MAILS;

		return (
			<div
				className={classnames(styles.chart, {
					[styles['is-widget']]: widget,
					[styles['is-goalChart']]: goal,
				})}
			>
				{!hasNoData && isDealsChart && getDealsChartComponent()}
				{!hasNoData &&
					isActivitiesChart &&
					getActivitiesChartComponent()}
				{!hasNoData && isMailsChart && getMailsChartComponent()}
			</div>
		);
	};

	const renderWidgetContent = () => {
		const goalErrorType =
			isGoalsReport && getGoalErrorType({ quickFilters, goal });

		if (hasNoData || !!goalErrorType) {
			return (
				<ChartWidgetNoData
					chartType={chartType}
					isGoalsReport={isGoalsReport}
					goalErrorType={goalErrorType}
					navigateToReportDetails={handleNavigationToReportDetails}
					canEditDashboard={canEditDashboard}
				/>
			);
		}

		return renderChartType();
	};

	const getChartTypeComponent = () => {
		if (widget) {
			return (
				<WidgetWrapper
					hasNoData={hasNoData}
					navigateToReportDetails={handleNavigationToReportDetails}
					report={report}
					hasSegment={hasSegment}
					reportData={reportData}
					pageNumber={pageNumber}
					setPageNumber={setPageNumber}
					hasNextPage={hasNextPage}
					dashboardId={dashboardId}
					isFirstWidget={isFirstWidget}
					goal={goal}
				>
					{renderWidgetContent()}
				</WidgetWrapper>
			);
		}

		return renderChartType();
	};

	return getChartTypeComponent();
};

export default React.memo(Chart);
