import React, { useState } from 'react';
import { helpers } from '@pipedrive/insights-core';
import { Spacing } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import DataLayer from '../../shared/dataLayer';
import useIntervalOptions from '../../molecules/VisualBuilder/useIntervalOptions';
import ChartWrapper from '../../molecules/ChartWrapper';
import NoDataPanel from '../../atoms/NoDataPanel';
import ReportPanel from '../../atoms/ReportPanel';
import NoData from '../../atoms/NoData';
import ErrorBoundary from '../../atoms/ErrorBoundary';
import TableWrapper from '../../shared/table/TableWrapper';
import { DataObject } from '../../types/data-layer';
import { getMultiSelectFilterValue } from '../../utils/filterUtils';
import {
	getValueFromUnsavedOrOriginalReport,
	parseReportParameters,
} from '../../utils/reportObjectHelpers';
import { CHART_FIRST_PAGE_INDEX, NO_SEGMENT } from '../../utils/constants';
import usePlanPermissions from '../../hooks/usePlanPermissions';
import { Goal } from '../../types/goals';
import GoalLockedMessage from './GoalLockedMessage';
import localState from '../../utils/localState';

import styles from './GoalReportArea.pcss';

interface GoalProps {
	goal: Goal;
	goalReport: any;
}

const GoalReportArea: React.FC<GoalProps> = ({ goal, goalReport }) => {
	const translator = useTranslator();
	const { canSeeReport } = usePlanPermissions();
	const { getCachedSourceDataTable } = localState();

	const [pageNumber, setPageNumber] = useState(CHART_FIRST_PAGE_INDEX);
	const noDataPanelMessage = translator.gettext(
		'There are no results available yet for this goal.',
	);

	const chartType = getValueFromUnsavedOrOriginalReport(
		goalReport,
		'chart_type',
	);
	const reportType = getValueFromUnsavedOrOriginalReport(
		goalReport,
		'report_type',
	);

	const isEditing = goalReport.unsavedReport.is_editing;
	const parameters = parseReportParameters(goalReport.parameters);

	const { data_type: dataType } = goalReport;
	const { group_by: groupByFilter } = parameters;
	const {
		measure_by: measureByFilter,
		segment_by: segmentByFilter,
		filter_by: filterByFilter,
		stages: selectedStages,
		is_cumulative: isCumulative,
	} = isEditing ? goalReport.unsavedReport.parameters : parameters;

	const segmentByFilterToUse = helpers.getSegmentByFilterToUse(
		chartType,
		dataType,
		segmentByFilter,
	);

	const { intervalFilter } = useIntervalOptions({
		translator,
		groupByFilter,
		reportType,
		filterByFilter,
		isGoalsReport: true,
	});

	const { columns } = getCachedSourceDataTable(goalReport.id);
	const reportColumns = columns || goalReport.columns;

	const hasSelectedSegmentFilter = segmentByFilter !== NO_SEGMENT;
	const isSegmentByFilterNeeded = segmentByFilter !== groupByFilter.filter;
	const hasSegment = hasSelectedSegmentFilter && isSegmentByFilterNeeded;

	return (
		<Spacing horizontal="m" bottom="m">
			<ErrorBoundary>
				<DataLayer
					groupByFilter={groupByFilter.filter}
					multiSelectFilter={getMultiSelectFilterValue(
						filterByFilter,
						chartType,
						selectedStages,
					)}
					interval={groupByFilter.interval}
					intervalFilter={intervalFilter}
					measureByFilter={measureByFilter}
					segmentByFilter={segmentByFilterToUse}
					filterByFilter={filterByFilter}
					dataType={dataType}
					reportId={goalReport.id}
					reportName={goalReport.name}
					isNewReport={goalReport.is_new}
					reportType={reportType}
					chartType={chartType}
					reportColumns={reportColumns}
					pageNumber={pageNumber}
					isCumulative={isCumulative}
					isGoalsReport={goalReport?.is_goals_report}
				>
					{({ reportData, loading, chartHasNoData }: DataObject) => {
						if (loading) {
							return (
								<NoData
									loading={loading}
									reportType={reportType}
									dataType={dataType}
									chartType={chartType}
									isGoalsReport={true}
								/>
							);
						}

						if (canSeeReport(goalReport)) {
							return (
								<>
									<ReportPanel
										className={styles.panelWrapper}
									>
										{chartHasNoData && (
											<NoDataPanel
												message={noDataPanelMessage}
											/>
										)}
										<ChartWrapper
											reportData={reportData}
											intervalFilter={intervalFilter}
											hasSegment={hasSegment}
											report={goalReport}
											groupByFilter={groupByFilter.filter}
											measureByFilter={measureByFilter}
											segmentByFilter={
												segmentByFilterToUse
											}
											chartType={chartType}
											pageNumber={pageNumber}
											setPageNumber={setPageNumber}
											goal={goal}
										/>
									</ReportPanel>
									<ReportPanel>
										<TableWrapper
											report={goalReport}
											goal={goal}
											reportData={reportData}
											filterByFilter={filterByFilter}
											groupByFilter={groupByFilter.filter}
											segmentByFilter={
												segmentByFilterToUse
											}
											measureByFilter={measureByFilter}
											hasSegment={hasSegment}
											isExpandable
										/>
									</ReportPanel>
								</>
							);
						} else {
							return <GoalLockedMessage />;
						}
					}}
				</DataLayer>
			</ErrorBoundary>
		</Spacing>
	);
};

export default React.memo(GoalReportArea);
