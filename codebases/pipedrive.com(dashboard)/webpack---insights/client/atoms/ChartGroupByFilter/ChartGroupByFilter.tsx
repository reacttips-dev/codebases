import React, { useMemo } from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { InlineInfo } from '@pipedrive/convention-ui-react';

import getFilterPlacement from '../../molecules/VisualBuilder/getFilterPlacement';
import useFilterState from '../../molecules/VisualBuilder/useFilterState';
import useIntervalOptions from '../../molecules/VisualBuilder/useIntervalOptions';
import MultiSelectChartFilter from '../MultiSelectChartFilter';
import { getValueFromUnsavedOrOriginalReport } from '../../utils/reportObjectHelpers';
import {
	getFilteredPipelineStages,
	getCumulativeFilterOptions,
} from '../../utils/filterUtils';
import ChartFilter, {
	ChartFilterLabelTruncation,
} from '../ChartFilter/ChartFilter';
import PaginationButtons from '../PaginationButtons';
import { hasPagination } from '../../utils/reportsUtils';
import { ChartMetaDataObject } from '../../types/data-layer';
import getGroupByOptions from './groupByOptions/getGroupByOptions';
import { ChartFilterType } from '../../utils/constants';
import useReportOptions from '../../hooks/useReportOptions';

import styles from './ChartGroupByFilter.pcss';

interface ChartGroupByFilterProps {
	paginationLineRightPosition?: number;
	pageNumber: number;
	setPageNumber: (pageNumber: number) => void;
	report: any;
	chartMetaData: ChartMetaDataObject;
}

const ChartGroupByFilter: React.FC<ChartGroupByFilterProps> = ({
	pageNumber,
	setPageNumber,
	report,
	paginationLineRightPosition,
	chartMetaData,
}) => {
	const translator = useTranslator();

	const { data_type: reportDataType, is_goals_report: isGoalsReport } =
		report;

	const reportType = getValueFromUnsavedOrOriginalReport(
		report,
		'report_type',
	);
	const chartType = getValueFromUnsavedOrOriginalReport(report, 'chart_type');

	const {
		group_by: groupByFilter,
		filter_by: filterByFilter,
		stages: selectedStagesIds,
		is_cumulative: isCumulative,
	} = report.unsavedReport.parameters;
	const {
		groupByFilterStyle,
		groupByPopoverPlacement,
		multiSelectPopoverPlacement,
		isCumulativeFilterStyle,
		isCumulativePopoverPlacement,
	} = useMemo(
		() => getFilterPlacement(reportType, chartType),
		[reportType, chartType],
	);

	const { setGroupByFilter, setStagesFilter, setIsCumulativeFilter } =
		useFilterState();

	const { intervalOptions, intervalFilter } = useIntervalOptions({
		translator,
		groupByFilter,
		reportType,
		filterByFilter,
		isGoalsReport,
	});

	const isProgressReport =
		reportType === insightsTypes.ReportType.DEALS_PROGRESS;
	const isRecurringRevenueReport = [
		insightsTypes.ReportType.DEALS_RECURRING_REVENUE,
		insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT,
	].includes(reportType);
	const isRevenueForecastReport =
		reportType === insightsTypes.ReportType.DEALS_REVENUE_FORECAST;
	const shouldDisplayGroupByFilter =
		![
			insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION,
			insightsTypes.ReportType.DEALS_REVENUE_FORECAST,
			insightsTypes.ReportType.DEALS_RECURRING_REVENUE,
			insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT,
		].includes(reportType) && !isGoalsReport;
	const isConversionFunnelReport =
		reportType === insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION;
	const shouldDisplayIntervalFilter =
		groupByFilter.interval && !isConversionFunnelReport && !isGoalsReport;
	const isBarChart = chartType === insightsTypes.ChartType.BAR;
	const isNonGoalRevenueForecastReport =
		isRevenueForecastReport && !isGoalsReport;

	const getAllStagesOfPipeline = () =>
		getFilteredPipelineStages(filterByFilter);

	const { fields, groupByFields } = useReportOptions(reportDataType);

	const groupByOptions = useMemo(
		() =>
			getGroupByOptions({
				reportDataType,
				reportType,
				groupByFields,
				fields,
				translator,
			}),
		[reportDataType],
	);

	const showPagination = hasPagination(
		chartMetaData?.hasNextPage,
		pageNumber,
	);

	const renderInlineInfo = (): JSX.Element => {
		const info = translator.gettext(
			'Open deals are shown by “Expected close date” and already won deals are shown by “Won time”',
		);

		return (
			<InlineInfo
				text={info}
				placement="top-start"
				portalTo={document.body}
			/>
		);
	};

	const getGoalreportGroupByLabel = () => {
		if (isRevenueForecastReport) {
			return translator.gettext('Forecast period');
		}

		return (
			groupByOptions.find(
				(option) => option.name === groupByFilter.filter,
			)?.label || null
		);
	};

	const getGroupByFilterTruncationSize = () => {
		if (isBarChart) {
			if (showPagination && groupByFilter.interval) {
				return ChartFilterLabelTruncation.XSMALL;
			}
			return ChartFilterLabelTruncation.MEDIUM;
		}

		if (!groupByFilter.interval) {
			return ChartFilterLabelTruncation.XLARGE;
		}

		return ChartFilterLabelTruncation.LARGE;
	};

	const getIntervalFilterTruncationSize = () => {
		if (isBarChart && (showPagination || groupByFilter.interval)) {
			return ChartFilterLabelTruncation.XSMALL;
		}

		return ChartFilterLabelTruncation.SMALL;
	};

	return (
		<>
			<div className={styles[groupByFilterStyle]}>
				{showPagination && <div className={styles.balancingElement} />}
				<div className={styles.filterRow}>
					{isGoalsReport && getGoalreportGroupByLabel()}
					{shouldDisplayGroupByFilter && (
						<ChartFilter
							type={ChartFilterType.GROUP_BY}
							options={groupByOptions}
							value={groupByFilter.filter}
							onClick={setGroupByFilter}
							placement={groupByPopoverPlacement}
							selectedInterval={intervalFilter}
							groupByFilterStyle={groupByFilterStyle}
							showViewByCoachmark
							isProgressReport={isProgressReport}
							label={translator.gettext('View by')}
							isNewCustomFieldButtonVisible={
								reportDataType === insightsTypes.DataType.DEALS
							}
							labelTruncation={getGroupByFilterTruncationSize()}
						/>
					)}
					{isConversionFunnelReport && (
						<MultiSelectChartFilter
							options={getAllStagesOfPipeline()}
							selectedOptionsIds={selectedStagesIds}
							onClick={setStagesFilter}
							placement={multiSelectPopoverPlacement}
						/>
					)}
					{isNonGoalRevenueForecastReport && (
						<ChartFilter
							type={ChartFilterType.IS_CUMULATIVE}
							options={getCumulativeFilterOptions(translator)}
							value={isCumulative}
							onClick={setIsCumulativeFilter}
							placement={isCumulativePopoverPlacement}
							groupByFilterStyle={isCumulativeFilterStyle}
							label={translator.gettext('View')}
							showViewByCoachmark
						/>
					)}
					{shouldDisplayIntervalFilter && (
						<ChartFilter
							type={ChartFilterType.INTERVAL}
							isNewCustomFieldButtonVisible={false}
							options={intervalOptions}
							value={intervalFilter}
							onClick={(interval: any) =>
								setGroupByFilter(groupByFilter.filter, interval)
							}
							placement={groupByPopoverPlacement}
							labelTruncation={getIntervalFilterTruncationSize()}
							label={
								isRecurringRevenueReport &&
								translator.gettext('Payment date')
							}
						/>
					)}
					{isNonGoalRevenueForecastReport && renderInlineInfo()}
				</div>
				{showPagination && (
					<PaginationButtons
						paginationLineRightPosition={
							paginationLineRightPosition
						}
						pageNumber={pageNumber}
						setPageNumber={setPageNumber}
						chartType={chartType}
						hasNextPage={chartMetaData?.hasNextPage}
						chartMetaData={chartMetaData}
					/>
				)}
			</div>
		</>
	);
};

export default React.memo(ChartGroupByFilter);
