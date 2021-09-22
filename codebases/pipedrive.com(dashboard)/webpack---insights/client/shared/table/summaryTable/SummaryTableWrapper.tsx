import React from 'react';
import { ReportType } from '@pipedrive/insights-core/lib/types';

import { getValueFromUnsavedOrOriginalReport } from '../../../utils/reportObjectHelpers';
import { getPrimaryAndSecondaryChartFilter } from '../../../utils/filterUtils';
import SummaryTable from '../../../molecules/SummaryTable';
import SummaryTableForFunnel from '../../../molecules/SummaryTableForFunnel';
import useReportOptions from '../../../hooks/useReportOptions';
import SummaryTableForProgress from '../../../molecules/SummaryTableForProgress';
import SummaryTableForDuration from '../../../molecules/SummaryTableForDuration';
import SummaryTableForRevenue from '../../../molecules/SummaryTableForRevenue';
import SummaryTableForGoal from '../../../molecules/SummaryTableForGoal';
import { MapDataReturnType } from '../../../types/data-layer';
import { Goal } from '../../../types/goals';

interface SummaryTableWrapperProps {
	report: any;
	reportData: MapDataReturnType;
	groupByFilter: string;
	measureByFilter: string;
	segmentByFilter: string;
	goal?: Goal;
}

const SummaryTableWrapper: React.FC<SummaryTableWrapperProps> = ({
	report,
	reportData,
	groupByFilter,
	measureByFilter,
	segmentByFilter,
	goal,
}) => {
	const reportDataType = report.data_type;
	const reportType = getValueFromUnsavedOrOriginalReport(
		report,
		'report_type',
	);

	const chartType = getValueFromUnsavedOrOriginalReport(report, 'chart_type');

	const { fields } = useReportOptions(reportDataType);
	const reportId = report.id;

	const { is_goals_report: isGoalsReport } = report;

	const { primaryFilter, secondaryFilter } =
		getPrimaryAndSecondaryChartFilter({
			groupByFilter,
			segmentByFilter,
			chartType,
			reportType,
			dataType: reportDataType,
		});

	const primaryFilterName =
		(fields.find((field: any) => field.uiName === primaryFilter) || {})
			.translatedName || primaryFilter;

	if (isGoalsReport) {
		return (
			<SummaryTableForGoal
				reportType={reportType}
				reportData={reportData}
				goal={goal}
				reportDataType={reportDataType}
				primaryFilter={primaryFilter}
				measureByFilter={measureByFilter}
				primaryFilterName={primaryFilterName}
			/>
		);
	}

	if (
		[
			ReportType.DEALS_RECURRING_REVENUE,
			ReportType.DEALS_RECURRING_REVENUE_MOVEMENT,
		].includes(reportType)
	) {
		return (
			<SummaryTableForRevenue
				reportType={reportType}
				reportData={reportData}
				primaryFilter={primaryFilter}
				measureByFilter={measureByFilter}
				primaryFilterName={primaryFilterName}
				fields={fields}
				reportDataType={reportDataType}
			/>
		);
	}

	if (reportType === ReportType.DEALS_FUNNEL_CONVERSION) {
		return (
			<SummaryTableForFunnel
				groupedAndSegmentedFlatData={
					reportData.groupedAndSegmentedFlatData
				}
				primaryFilter={primaryFilter}
				measureByFilter={measureByFilter}
				primaryFilterName={primaryFilterName}
			/>
		);
	}

	if (reportType === ReportType.DEALS_PROGRESS) {
		return (
			<SummaryTableForProgress
				primaryFilter={primaryFilter}
				measureByFilter={measureByFilter}
				primaryFilterName={primaryFilterName}
				reportType={reportType}
				reportData={reportData}
				secondaryFilter={secondaryFilter}
				reportDataType={reportDataType}
			/>
		);
	}

	if (reportType === ReportType.DEALS_DURATION) {
		return (
			<SummaryTableForDuration
				groupedAndSegmentedFlatData={
					reportData.groupedAndSegmentedFlatData
				}
				primaryFilter={primaryFilter}
				measureByFilter={measureByFilter}
				primaryFilterName={primaryFilterName}
			/>
		);
	}

	return (
		<SummaryTable
			reportId={reportId}
			reportType={reportType}
			reportData={reportData}
			reportDataType={reportDataType}
			primaryFilter={primaryFilter}
			measureByFilter={measureByFilter}
			secondaryFilter={secondaryFilter}
			primaryFilterName={primaryFilterName}
		/>
	);
};

export default SummaryTableWrapper;
