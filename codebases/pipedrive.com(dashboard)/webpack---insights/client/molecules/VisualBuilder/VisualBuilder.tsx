/* eslint-disable complexity */
import React, { useEffect, useState, Suspense } from 'react';
import { Separator } from '@pipedrive/convention-ui-react';
import { types as insightsTypes, helpers } from '@pipedrive/insights-core';
import { useTranslator } from '@pipedrive/react-utils';

import { getValueFromUnsavedOrOriginalReport } from '../../utils/reportObjectHelpers';
import { getMultiSelectFilterValue } from '../../utils/filterUtils';
import { CHART_FIRST_PAGE_INDEX, NO_SEGMENT } from '../../utils/constants';
import DataLayer from '../../shared/dataLayer';
import TableWrapper from '../../shared/table/TableWrapper';
import NoData from '../../atoms/NoData';
import ReportPanel from '../../atoms/ReportPanel';
import VisualBuilderMenu from '../../atoms/VisualBuilderMenu';
import NoDataPanel from '../../atoms/NoDataPanel';
import ChartWrapper from '../ChartWrapper';
import { DataObject } from '../../types/data-layer';
import useIntervalOptions from './useIntervalOptions';
import usePlanPermissions from '../../hooks/usePlanPermissions';
import ErrorBoundary from '../../atoms/ErrorBoundary';
import ReportCustomfieldLockedMessage from './ReportCustomfieldsLockedMessage';
import ReportRevenueLockedMessage from './ReportRevenueLockedMessage';
import localState from '../../utils/localState';

import styles from './VisualBuilder.pcss';

interface VisualBuilderProps {
	report: any;
}

const VisualBuilder: React.FC<VisualBuilderProps> = ({ report }) => {
	const [expanded, setExpanded] = useState(true);
	const [pageNumber, setPageNumber] = useState(CHART_FIRST_PAGE_INDEX);
	const { canSeeReport } = usePlanPermissions();
	const translator = useTranslator();
	const { getCachedSourceDataTable } = localState();

	const chartType = getValueFromUnsavedOrOriginalReport(report, 'chart_type');
	const reportType = getValueFromUnsavedOrOriginalReport(
		report,
		'report_type',
	);

	const canSeeCurrentReport = canSeeReport(report);
	const { data_type: dataType, is_goals_report: isGoalsReport } = report;

	const noDataPanelMessage = translator.gettext(
		'Results cannot be displayed with current filters or grouping options.',
	);

	const {
		group_by: groupByFilter,
		measure_by: measureByFilter,
		segment_by: segmentByFilter,
		filter_by: filterByFilter,
		stages: selectedStages,
		is_cumulative: isCumulative,
	} = report.unsavedReport.parameters;

	useEffect(() => {
		setPageNumber(CHART_FIRST_PAGE_INDEX);
	}, [
		report.id,
		chartType,
		reportType,
		groupByFilter,
		measureByFilter,
		segmentByFilter,
		filterByFilter,
		selectedStages,
	]);

	const { intervalFilter } = useIntervalOptions({
		translator,
		groupByFilter,
		reportType,
		filterByFilter,
		isGoalsReport,
	});

	const isPieChart = chartType === insightsTypes.ChartType.PIE;

	const hasSelectedSegmentFilter = segmentByFilter !== NO_SEGMENT;
	const isSegmentByFilterNeeded = segmentByFilter !== groupByFilter.filter;
	const hasSegment =
		(hasSelectedSegmentFilter && isSegmentByFilterNeeded) || isPieChart;
	const segmentByFilterToUse = helpers.getSegmentByFilterToUse(
		chartType,
		dataType,
		segmentByFilter,
	);
	const { columns } = getCachedSourceDataTable(report.id);
	const reportColumns = columns || report.columns;
	const multiSelectFilter = getMultiSelectFilterValue(
		filterByFilter,
		chartType,
		selectedStages,
	);

	if (!canSeeCurrentReport) {
		if (
			[
				insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT,
				insightsTypes.ReportType.DEALS_RECURRING_REVENUE,
			].includes(reportType)
		) {
			return <ReportRevenueLockedMessage reportType={reportType} />;
		}

		return <ReportCustomfieldLockedMessage />;
	}

	return (
		<ErrorBoundary>
			<DataLayer
				groupByFilter={groupByFilter.filter}
				multiSelectFilter={multiSelectFilter}
				interval={groupByFilter.interval}
				intervalFilter={intervalFilter}
				measureByFilter={measureByFilter}
				segmentByFilter={segmentByFilterToUse}
				filterByFilter={filterByFilter}
				dataType={dataType}
				reportId={report.id}
				reportName={report.name}
				isNewReport={report.is_new}
				reportType={reportType}
				chartType={chartType}
				reportColumns={reportColumns}
				pageNumber={pageNumber}
				isCumulative={isCumulative}
				containsInactiveCustomFields={
					report?.contains_inactive_custom_fields
				}
			>
				{({
					reportData,
					loading,
					tableHasNoData,
					chartHasNoData,
				}: DataObject) => {
					if (loading) {
						return (
							<NoData
								loading={loading}
								reportType={reportType}
								dataType={dataType}
								chartType={chartType}
							/>
						);
					}

					const isChartTypeTable =
						chartType === insightsTypes.ChartType.TABLE;

					return (
						<Suspense fallback="Loading...">
							{canSeeCurrentReport && (
								<ReportPanel>
									<VisualBuilderMenu
										chartType={chartType}
										reportType={reportType}
										loading={loading}
										expanded={expanded}
										setExpanded={setExpanded}
										measureByFilter={measureByFilter}
										report={report}
										reportData={reportData}
									/>
									{!isChartTypeTable && expanded && (
										<>
											<Separator
												className={styles.separator}
											/>
											{chartHasNoData && (
												<NoDataPanel
													message={noDataPanelMessage}
												/>
											)}
											<ChartWrapper
												reportData={reportData}
												intervalFilter={intervalFilter}
												hasSegment={hasSegment}
												report={report}
												groupByFilter={
													groupByFilter.filter
												}
												measureByFilter={
													measureByFilter
												}
												segmentByFilter={
													segmentByFilterToUse
												}
												chartType={chartType}
												pageNumber={pageNumber}
												setPageNumber={setPageNumber}
											/>
										</>
									)}

									{isChartTypeTable && expanded && (
										<>
											<TableWrapper
												report={report}
												reportData={reportData}
												filterByFilter={filterByFilter}
												groupByFilter={
													groupByFilter.filter
												}
												segmentByFilter={
													segmentByFilterToUse
												}
												measureByFilter={
													measureByFilter
												}
												isExpandable={false}
												hasSegment={hasSegment}
												multiSelectFilter={
													multiSelectFilter
												}
											/>
											{tableHasNoData && (
												<NoDataPanel
													message={noDataPanelMessage}
												/>
											)}
										</>
									)}
								</ReportPanel>
							)}

							{!isChartTypeTable && !tableHasNoData && (
								<ReportPanel>
									<TableWrapper
										report={report}
										reportData={reportData}
										filterByFilter={filterByFilter}
										groupByFilter={groupByFilter.filter}
										segmentByFilter={segmentByFilterToUse}
										measureByFilter={measureByFilter}
										hasSegment={hasSegment}
										isExpandable
										multiSelectFilter={multiSelectFilter}
									/>
								</ReportPanel>
							)}
						</Suspense>
					);
				}}
			</DataLayer>
		</ErrorBoundary>
	);
};

export default React.memo(VisualBuilder);
