import React, { useMemo } from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { Button, Icon, ButtonGroup } from '@pipedrive/convention-ui-react';
import { types as insightsTypes } from '@pipedrive/insights-core';

import useFilterState from '../../molecules/VisualBuilder/useFilterState';
import ChartFilter from '../../atoms/ChartFilter';
import {
	getSegmentOptions,
	getParsedSegmentByFilter,
	isSegmentByMissingForChartType,
} from './chartSegmentByFilterUtils';
import {
	NO_SEGMENT,
	ChartFilterType,
	DEAL_PRODUCTS_PRODUCT_ID,
} from '../../utils/constants';
import { getValueFromUnsavedOrOriginalReport } from '../../utils/reportObjectHelpers';
import getSegmentByOptions from './segmentByOptions/getSegmentByOptions';
import useReportOptions from '../../hooks/useReportOptions';
import { Report } from '../../types/apollo-query-types';

import styles from './ChartSegmentByFilter.pcss';

interface ChartSegmentByFilterProps {
	report: Report;
	hasSegment: boolean;
	measureByFilter: insightsTypes.MeasureByType | string;
	groupByFilter: string;
	segmentByFilter: string;
}

const shouldDisableSegmenting = ({
	reportType,
}: {
	reportType: insightsTypes.ReportType;
}): boolean => {
	// Segmenting is visually disabled for Deal Progress report until we re-write the API for it
	return reportType === insightsTypes.ReportType.DEALS_PROGRESS;
};

const ChartSegmentByFilter = ({
	report,
	hasSegment,
	measureByFilter,
	groupByFilter,
	segmentByFilter,
}: ChartSegmentByFilterProps) => {
	const translator = useTranslator();
	const { setSegmentByFilter } = useFilterState();

	const reportDataType: insightsTypes.DataType = report.data_type;
	const reportType: insightsTypes.ReportType =
		getValueFromUnsavedOrOriginalReport(report, 'report_type');
	const chartType: insightsTypes.ChartType =
		getValueFromUnsavedOrOriginalReport(report, 'chart_type');
	const { fields, groupByFields } = useReportOptions(reportDataType);

	const segmentByOptions = useMemo(
		() =>
			getSegmentByOptions({
				reportDataType,
				reportType,
				groupByFields,
				fields,
				translator,
			}),
		[reportDataType],
	);

	const chartOptions = getSegmentOptions({
		reportType,
		chartType,
		measureByFilter,
		groupByFilter,
		segmentByOptions,
		translator,
	});

	const parsedSegmentByFilter = getParsedSegmentByFilter({
		reportType,
		chartType,
		measureByFilter,
		groupByFilter,
		segmentByFilter,
	});

	if (groupByFilter === DEAL_PRODUCTS_PRODUCT_ID) {
		return null;
	}

	if (isSegmentByMissingForChartType(chartType, reportType)) {
		return null;
	}

	const isSegmentingDisabled = shouldDisableSegmenting({ reportType });
	const isPieChart = chartType === insightsTypes.ChartType.PIE;
	const showRemoveButton = hasSegment && !isSegmentingDisabled && !isPieChart;

	return (
		<div className={styles.segmentBy}>
			<div className={styles.segmentByLabel}>
				{translator.gettext('Segment by')}
			</div>
			<ButtonGroup>
				<ChartFilter
					type={ChartFilterType.SEGMENT_BY}
					isNewCustomFieldButtonVisible={
						reportType !==
							insightsTypes.ReportType.DEALS_DURATION &&
						reportDataType === insightsTypes.DataType.DEALS
					}
					options={chartOptions}
					value={parsedSegmentByFilter}
					onClick={setSegmentByFilter}
					placement="bottom-end"
					disabled={isSegmentingDisabled}
				/>
				{showRemoveButton ? (
					<Button
						className={styles.removeBtn}
						onClick={() => {
							setSegmentByFilter(NO_SEGMENT);
						}}
					>
						<Icon icon="cross" color="black-64" size="s" />
					</Button>
				) : null}
			</ButtonGroup>
		</div>
	);
};

export default React.memo(ChartSegmentByFilter);
