import React, { useState } from 'react';
import classNames from 'classnames';
import { Spacing } from '@pipedrive/convention-ui-react';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { REPORTS_WITH_TITLE } from '../../utils/constants';
import {
	doesReportHaveData,
	hasTypeAsSegmentInActivityReport,
} from '../../utils/helpers';
import { getValueFromUnsavedOrOriginalReport } from '../../utils/reportObjectHelpers';
import PeriodDropmenu from '../PeriodDropmenu/PeriodDropmenu';
import { getCustomFieldName } from '../../utils/filterUtils';
import { isStackedBarOrderReversed } from '../../atoms/ChartTypes/chartTypeUtils';
import ChartLegend from '../../atoms/ChartLegend';
import ActivityIconChartLegend from '../../atoms/ActivityIconChartLegend';
import ChartGroupByFilter from '../../atoms/ChartGroupByFilter';
import ChartMeasureByFilter from '../../atoms/ChartMeasureByFilter';
import ChartSegmentByFilter from '../../atoms/ChartSegmentByFilter';
import ChartTitleWrapper from '../../atoms/ChartTitle';
import Chart from '../Chart';
import useReportOptions from '../../hooks/useReportOptions';
import useListViewOptions from '../../shared/listView/useListViewOptions';
import ListView from '../../shared/listView/ListView';
import { MapDataReturnType } from '../../types/data-layer';
import ExportDialog from '../../shared/export/ExportDialog';
import { Goal } from '../../types/goals';

import styles from './ChartWrapper.pcss';

interface ChartWrapperProps {
	reportData: MapDataReturnType;
	hasSegment: boolean;
	report: any;
	groupByFilter: string;
	measureByFilter: string;
	segmentByFilter: string;
	intervalFilter: insightsTypes.Interval;
	chartType: insightsTypes.ChartType;
	pageNumber: number;
	setPageNumber: (pageNumber: number) => void;
	goal?: Goal;
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({
	reportData,
	intervalFilter,
	hasSegment = false,
	report,
	groupByFilter,
	measureByFilter,
	segmentByFilter,
	chartType,
	pageNumber,
	setPageNumber,
	goal,
}) => {
	const [paginationLineRightPosition, setPaginationLineRightPosition] =
		useState(0);
	const { fields } = useReportOptions(insightsTypes.DataType.DEALS);

	const measureByCustomName = getCustomFieldName(fields, measureByFilter);
	const { legendData, chartMetaData } = reportData;

	const hasNoData = !doesReportHaveData(reportData);
	const reportType = getValueFromUnsavedOrOriginalReport(
		report,
		'report_type',
	);
	const isGoalsReport = report.is_goals_report;
	const reportId = report.id;

	const {
		isListViewVisible,
		setIsListViewVisible,
		listSegmentData,
		showListView,
		isExportListViewDialogVisible,
		setIsExportListViewDialogVisible,
		itemsCount,
		setItemsCount,
	} = useListViewOptions(chartType, reportType);

	const isPieChart = chartType === insightsTypes.ChartType.PIE;
	const isScorecardChart = chartType === insightsTypes.ChartType.SCORECARD;
	const hasActivityTypeGrouping = hasTypeAsSegmentInActivityReport({
		reportType,
		hasSegment,
		segmentByFilter,
		groupByFilter,
	});

	const isChartLegendVisible = hasSegment && !isScorecardChart;
	const isChartLegendReversed =
		!isStackedBarOrderReversed(segmentByFilter) &&
		reportType !== insightsTypes.ReportType.DEALS_CONVERSION_OVERALL;

	return (
		<>
			{isListViewVisible && (
				<ListView
					reportId={reportId}
					listSegmentData={listSegmentData}
					reportData={reportData}
					setItemsCount={setItemsCount}
					setIsListViewVisible={setIsListViewVisible}
					setIsExportListViewDialogVisible={
						setIsExportListViewDialogVisible
					}
				/>
			)}

			{isExportListViewDialogVisible && (
				<ExportDialog
					itemsCount={itemsCount}
					setIsListViewVisible={setIsListViewVisible}
					setIsExportListViewDialogVisible={
						setIsExportListViewDialogVisible
					}
					reportId={reportId}
					reportData={reportData}
					listSegmentData={listSegmentData}
					isListView={true}
				/>
			)}

			<div className={styles.chartContainer} data-test="chart-wrapper">
				<Spacing
					all="m"
					className={classNames(styles.chartFullWidth, {
						[styles.chartWithSegment]: isChartLegendVisible,
					})}
				>
					{REPORTS_WITH_TITLE.includes(reportType) && (
						<ChartTitleWrapper
							reportType={reportType}
							chartType={chartType}
							reportData={reportData}
							measureByFilter={measureByFilter}
							measureByCustomName={measureByCustomName}
						/>
					)}
					{isGoalsReport ? (
						<PeriodDropmenu goal={goal} report={report} />
					) : (
						<ChartSegmentByFilter
							report={report}
							measureByFilter={measureByFilter}
							groupByFilter={groupByFilter}
							segmentByFilter={segmentByFilter}
							hasSegment={hasSegment}
						/>
					)}
					<div
						className={classNames(styles.chart, {
							[styles.withoutPadding]:
								isPieChart || isScorecardChart,
						})}
					>
						<span
							className={classNames(
								styles.main,
								styles.chartFullHeight,
								{
									[styles.chartReducedHeight]:
										isScorecardChart,
								},
							)}
						>
							<Chart
								showListView={showListView}
								report={report}
								reportData={reportData}
								groupByFilter={groupByFilter}
								measureByFilter={measureByFilter}
								measureByCustomName={measureByCustomName}
								segmentByFilter={segmentByFilter}
								intervalFilter={intervalFilter}
								hasSegment={hasSegment}
								hasNextPage={chartMetaData?.hasNextPage}
								hasNoData={hasNoData}
								setPaginationLineRightPosition={
									setPaginationLineRightPosition
								}
								{...(paginationLineRightPosition !== 0 && {
									paginationLineRightPosition,
								})}
								goal={goal}
							/>

							<ChartGroupByFilter
								report={report}
								pageNumber={pageNumber}
								setPageNumber={setPageNumber}
								{...(paginationLineRightPosition !== 0 && {
									paginationLineRightPosition,
								})}
								chartMetaData={chartMetaData}
							/>
							<ChartMeasureByFilter report={report} />
						</span>
					</div>
				</Spacing>
				{isChartLegendVisible && !hasActivityTypeGrouping && (
					<ChartLegend
						legendData={legendData}
						isLegendReversed={isChartLegendReversed}
					/>
				)}
				{isChartLegendVisible && hasActivityTypeGrouping && (
					<ActivityIconChartLegend legendData={legendData} />
				)}
			</div>
		</>
	);
};

export default React.memo(ChartWrapper);
