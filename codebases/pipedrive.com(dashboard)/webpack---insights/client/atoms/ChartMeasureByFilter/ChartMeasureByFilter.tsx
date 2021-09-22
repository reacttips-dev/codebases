import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { ChartFilterType, NO_SEGMENT } from '../../utils/constants';
import getFilterPlacement from '../../molecules/VisualBuilder/getFilterPlacement';
import useFilterState from '../../molecules/VisualBuilder/useFilterState';
import { getValueFromUnsavedOrOriginalReport } from '../../utils/reportObjectHelpers';
import ChartFilter, {
	ChartFilterLabelTruncation,
} from '../ChartFilter/ChartFilter';
import useReportOptions from '../../hooks/useReportOptions';
import getMeasureByOptions from './measureByOptions/getMeasureByOptions';
import { getMailsMeasureByLabel } from '../../utils/filterUtils';
import { shouldDisableSegmentByProduct } from '../ChartSegmentByFilter/chartSegmentByFilterUtils';

import styles from './MeasureByFilter.pcss';

interface ChartMeasureByFiltersProps {
	report: any;
}

const ChartMeasureByFilter: React.FC<ChartMeasureByFiltersProps> = ({
	report,
}) => {
	const translator = useTranslator();

	const { data_type: reportDataType, is_goals_report: isGoalsReport } =
		report;

	const reportType = getValueFromUnsavedOrOriginalReport(
		report,
		'report_type',
	);
	const chartType = getValueFromUnsavedOrOriginalReport(report, 'chart_type');

	const { measure_by: measureByFilter, segment_by: segmentByFilter } =
		report.unsavedReport.parameters;
	const { measureByFilterStyle, measureByPopoverPlacement } = useMemo(
		() => getFilterPlacement(reportType, chartType),
		[reportType, chartType],
	);

	const { setMeasureByFilter, setSegmentByFilter } = useFilterState();

	const isOverallConversion =
		reportType === insightsTypes.ReportType.DEALS_CONVERSION_OVERALL;
	const isDurationReport =
		reportType === insightsTypes.ReportType.DEALS_DURATION;

	const { measureByFields, fields } = useReportOptions(reportDataType);

	const measureByOptions = useMemo(() => {
		return getMeasureByOptions({
			reportDataType,
			translator,
			options: measureByFields,
			fields,
			chartType,
			reportType,
		});
	}, [reportType, chartType, reportDataType]);

	const shouldCenterAlign = isOverallConversion || isDurationReport;
	const measureByLabel = isOverallConversion
		? translator.gettext('Conversion')
		: translator.gettext('Measure by');
	const truncateMeasureLabelByMedium = [
		insightsTypes.ChartType.COLUMN,
		insightsTypes.ChartType.FUNNEL,
		insightsTypes.ChartType.STACKED_BAR_CHART,
	].includes(chartType);

	const reportTypesWithHiddenMeasureByDropdown = [
		insightsTypes.ReportType.DEALS_DURATION,
		insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT,
		insightsTypes.ReportType.DEALS_RECURRING_REVENUE,
		insightsTypes.ReportType.MAILS_STATS,
	];

	const getMeasureByLabel = () => {
		switch (reportType) {
			case insightsTypes.ReportType.DEALS_DURATION:
				return translator.gettext('Days (average)');
			case insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT:
				return translator.gettext('Revenue');
			case insightsTypes.ReportType.DEALS_RECURRING_REVENUE:
				return translator.gettext('Revenue');
			case insightsTypes.ReportType.MAILS_STATS:
				return getMailsMeasureByLabel(
					insightsTypes.Mails.MesaureByField.COUNT,
					translator,
				);
			default:
				return null;
		}
	};

	const onMeasureByClick = (filter: string) => {
		setMeasureByFilter(filter);

		if (
			shouldDisableSegmentByProduct({
				reportType,
				measureByFilter: filter,
				segmentByFilter,
			})
		) {
			setSegmentByFilter(NO_SEGMENT);
		}
	};

	return (
		<>
			<div
				className={classNames(styles[measureByFilterStyle], {
					[styles.centerAligned]: shouldCenterAlign,
				})}
			>
				{getMeasureByLabel()}
				<div
					className={classNames([styles.filterRow], {
						[styles.hidden]:
							reportTypesWithHiddenMeasureByDropdown.includes(
								reportType,
							) || isGoalsReport,
					})}
				>
					<ChartFilter
						type={ChartFilterType.MEASURE_BY}
						options={measureByOptions}
						value={measureByFilter}
						onClick={(filter: string) => onMeasureByClick(filter)}
						placement={measureByPopoverPlacement}
						isNewCustomFieldButtonVisible={
							reportDataType === insightsTypes.DataType.DEALS
						}
						label={measureByLabel}
						labelTruncation={
							truncateMeasureLabelByMedium
								? ChartFilterLabelTruncation.MEDIUM
								: ChartFilterLabelTruncation.XLARGE
						}
					/>
				</div>
			</div>
		</>
	);
};

export default React.memo(ChartMeasureByFilter);
