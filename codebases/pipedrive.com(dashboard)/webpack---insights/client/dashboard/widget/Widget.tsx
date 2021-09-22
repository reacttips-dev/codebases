import React, { useState } from 'react';
import { get } from 'lodash';
import { types as insightsTypes, helpers } from '@pipedrive/insights-core';
import { Spinner } from '@pipedrive/convention-ui-react';
import { useReactiveVar } from '@apollo/client';

import { parseReportParametersForDashboardView } from '../../utils/reportObjectHelpers';
import { getReportById } from '../../utils/helpers';
import { applyQuickFiltersToReportFilters } from '../../utils/quickFilterUtils';
import { CHART_FIRST_PAGE_INDEX, NO_SEGMENT } from '../../utils/constants';
import {
	getMultiSelectFilterValue,
	getCustomFieldName,
} from '../../utils/filterUtils';
import usePlanPermissions from '../../hooks/usePlanPermissions';
import WidgetLockedMessage from './WidgetLockedMessage';
import DataLayer from '../../shared/dataLayer';
import TableWrapper from '../../shared/table/TableWrapper';
import Chart from '../../molecules/Chart';
import { DataObject } from '../../types/data-layer';
import useReportOptions from '../../hooks/useReportOptions';
import ErrorBoundary from '../../atoms/ErrorBoundary';
import { QuickFilters } from '../../types/apollo-query-types';
import { getGoalByReportId } from '../../hooks/goals/goalUtils';
import { goalsState } from '../../api/vars/goalsState';
import ListView from '../../shared/listView/ListView';
import ExportDialog from '../../shared/export/ExportDialog';
import useListViewOptions from '../../shared/listView/useListViewOptions';
import localState from '../../utils/localState';

import styles from './Widget.pcss';

interface WidgetProps {
	reportId: string;
	reports: any;
	dashboardId: string;
	quickFilters?: QuickFilters;
	isFirstWidget?: boolean;
}

const Widget: React.FC<WidgetProps> = ({
	reportId,
	reports,
	dashboardId,
	quickFilters,
	isFirstWidget,
}) => {
	const currentReport = getReportById(reportId, reports);

	const [paginationLineRightPosition, setPaginationLineRightPosition] =
		useState(0);
	const [pageNumber, setPageNumber] = useState(CHART_FIRST_PAGE_INDEX);
	const { loading: goalsLoading } = useReactiveVar(goalsState);
	const { canSeeReport } = usePlanPermissions();
	const { getCachedSourceDataTable } = localState();
	const {
		isListViewVisible,
		setIsListViewVisible,
		listSegmentData,
		showListView,
		isExportListViewDialogVisible,
		setIsExportListViewDialogVisible,
		itemsCount,
		setItemsCount,
	} = useListViewOptions(
		currentReport?.chart_type,
		currentReport?.report_type,
	);

	const { fields } = useReportOptions(insightsTypes.DataType.DEALS);

	if (!currentReport) {
		return null;
	}

	const report = parseReportParametersForDashboardView(currentReport);

	if (!report) {
		return null;
	}

	if (report.is_goals_report && goalsLoading) {
		return (
			<article
				className={styles.widget}
				data-test={`widget-${currentReport.name}`}
			>
				<Spinner size="s" light />
			</article>
		);
	}

	const canSeeCurrentReport = canSeeReport({
		report_type: report.report_type,
		contains_custom_fields: report.contains_custom_fields,
	});

	if (!canSeeCurrentReport) {
		return (
			<WidgetLockedMessage
				report={report}
				goal={getGoalByReportId(report.id)}
			/>
		);
	}

	const {
		group_by: groupByFilter,
		measure_by: measureByFilter,
		segment_by: segmentByFilter,
		filter_by: filterByFilter,
		stages: selectedStages,
		is_cumulative: isCumulative,
	} = report.parameters;
	const intervalFilter =
		groupByFilter.interval || insightsTypes.Interval.MONTH;
	const hasSelectedSegmentFilter = segmentByFilter !== NO_SEGMENT;
	const segmentByFilterToUse = helpers.getSegmentByFilterToUse(
		report.chart_type,
		report.data_type,
		segmentByFilter,
	);

	const multiSelectFilter = getMultiSelectFilterValue(
		filterByFilter,
		report.chart_type,
		selectedStages,
	);

	let quickFilteredFilterByFilter = filterByFilter;

	if (quickFilters) {
		const { period: dateQuickFilter, user: userQuickFilter } = quickFilters;

		if (dateQuickFilter || userQuickFilter) {
			quickFilteredFilterByFilter = applyQuickFiltersToReportFilters(
				filterByFilter,
				quickFilters,
			);
		}
	}

	const measureByCustomName = getCustomFieldName(fields, measureByFilter);

	const isPublic = window?.app?.isPublic;

	const getColumns = () => {
		if (!isPublic) {
			const { columns } = getCachedSourceDataTable(report.id);

			return columns || report.columns;
		}

		return report.columns;
	};

	const reportColumns = getColumns();

	return (
		<article
			className={styles.widget}
			data-test={`widget-${currentReport.name}`}
		>
			<ErrorBoundary>
				<DataLayer
					groupByFilter={groupByFilter.filter}
					interval={groupByFilter.interval}
					intervalFilter={intervalFilter}
					measureByFilter={measureByFilter}
					filterByFilter={quickFilteredFilterByFilter}
					segmentByFilter={segmentByFilterToUse}
					multiSelectFilter={multiSelectFilter}
					dataType={report.data_type}
					reportId={report.id}
					reportName={report.name}
					reportType={report.report_type}
					chartType={report.chart_type}
					isGoalsReport={report.is_goals_report}
					reportColumns={reportColumns}
					isWidget
					pageNumber={pageNumber}
					isCumulative={isCumulative}
					containsInactiveCustomFields={
						report?.contains_inactive_custom_fields
					}
					dashboardId={dashboardId}
				>
					{({
						reportData,
						tableHasNoData,
						chartHasNoData,
					}: DataObject) => {
						const { chartMetaData } = reportData;
						const chartType = get(report, 'chart_type');
						const isChartTypeTable =
							chartType === insightsTypes.ChartType.TABLE;
						const isPieChart =
							chartType === insightsTypes.ChartType.PIE;
						const hasNextPage = chartMetaData?.hasNextPage;
						const isSegmentByFilterNeeded =
							segmentByFilter !== groupByFilter.filter;
						const hasSegment =
							(hasSelectedSegmentFilter &&
								isSegmentByFilterNeeded) ||
							isPieChart;

						return (
							<>
								{isListViewVisible && (
									<ListView
										reportId={reportId}
										listSegmentData={listSegmentData}
										reportData={reportData}
										quickFilters={quickFilters}
										setItemsCount={setItemsCount}
										setIsListViewVisible={
											setIsListViewVisible
										}
										setIsExportListViewDialogVisible={
											setIsExportListViewDialogVisible
										}
									/>
								)}

								{isExportListViewDialogVisible && (
									<ExportDialog
										itemsCount={itemsCount}
										setIsListViewVisible={
											setIsListViewVisible
										}
										setIsExportListViewDialogVisible={
											setIsExportListViewDialogVisible
										}
										reportId={reportId}
										reportData={reportData}
										listSegmentData={listSegmentData}
										isListView={true}
										multiSelectFilter={multiSelectFilter}
										quickFilters={quickFilters}
									/>
								)}

								{isChartTypeTable ? (
									<TableWrapper
										hasNoData={tableHasNoData}
										report={report}
										widget
										reportData={reportData}
										filterByFilter={filterByFilter}
										groupByFilter={groupByFilter.filter}
										segmentByFilter={segmentByFilterToUse}
										measureByFilter={measureByFilter}
										hasSegment={hasSegment}
										dashboardId={dashboardId}
										multiSelectFilter={multiSelectFilter}
									/>
								) : (
									<Chart
										widget
										showListView={showListView}
										report={report}
										reportData={reportData}
										hasNoData={chartHasNoData}
										groupByFilter={groupByFilter.filter}
										measureByFilter={measureByFilter}
										measureByCustomName={
											measureByCustomName
										}
										segmentByFilter={segmentByFilterToUse}
										intervalFilter={
											intervalFilter as insightsTypes.Interval
										}
										hasSegment={hasSegment}
										hasNextPage={hasNextPage}
										pageNumber={pageNumber}
										setPageNumber={setPageNumber}
										setPaginationLineRightPosition={
											setPaginationLineRightPosition
										}
										{...(paginationLineRightPosition !==
											0 && {
											paginationLineRightPosition,
										})}
										dashboardId={dashboardId}
										isFirstWidget={isFirstWidget}
										quickFilters={quickFilters}
										goal={getGoalByReportId(report.id)}
									/>
								)}
							</>
						);
					}}
				</DataLayer>
			</ErrorBoundary>
		</article>
	);
};

export default React.memo(Widget);
