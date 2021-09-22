import React from 'react';
import { get } from 'lodash';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import Column from '../../atoms/ChartTypes/Column';
import Scorecard from '../../atoms/ChartTypes/Scorecard';
import DurationTooltip from '../../atoms/ChartTooltip/DurationTooltip';
import {
	getFormattedDuration,
	DurationFormat,
	getDurationInDays,
} from '../../utils/duration/durationUtils';
import { ChartSummaryDataObject } from '../../types/data-layer';
import { ListViewSegmentDataType } from '../../types/list-view';
import { numberFormatter } from '../../utils/numberFormatter';
import Bar from '../../atoms/ChartTypes/Bar';

interface DurationChartProps {
	data: any;
	isShownAsWidget: boolean;
	groupByFilter: string;
	uniqueSegments: any;
	intervalFilter: any;
	showChartListView: (data: ListViewSegmentDataType) => void;
	chartType: insightsTypes.ChartType;
	chartSummaryData: ChartSummaryDataObject;
	measureByFilter: string;
}

const DurationChart = ({
	data,
	isShownAsWidget = false,
	uniqueSegments,
	intervalFilter,
	groupByFilter,
	showChartListView,
	chartType,
	chartSummaryData,
	measureByFilter,
}: DurationChartProps) => {
	const translator = useTranslator();
	const isScorecardChart = chartType === insightsTypes.ChartType.SCORECARD;

	const valueFormatter = (durationInSeconds: number) => {
		return getFormattedDuration({
			duration: durationInSeconds,
			translator,
			format: DurationFormat.SHORT,
		});
	};

	const descriptionText = translator.gettext('Days (average)');
	const axisDataKey = 'name';

	const getColumnChartProps = () => {
		return {
			groupedAndSegmentedData: data,
			widget: isShownAsWidget,
			hasSegment: false,
			segmentBy: groupByFilter,
			uniqueSegments,
			intervalFilter,
			measureByFilter,
			xAxisDataKey: axisDataKey,
			yAxisLabel: descriptionText,
			valueFormatter,
			customTooltip: <DurationTooltip groupByFilter={groupByFilter} />,
			showChartListView,
			staticDataKey: 'duration.durationInDays',
		};
	};

	const getSalesCycleLengthInDays = () => {
		if (!chartSummaryData) {
			throw new Error(
				`Could not get proper data for duration report scorecard`,
			);
		}

		const duration = get(chartSummaryData, 'total.duration');

		return getDurationInDays(duration);
	};

	const getScorecardProps = () => {
		const score = getSalesCycleLengthInDays();

		return {
			score: numberFormatter.format({ value: score, isMonetary: false }),
			description: descriptionText,
			isShownAsWidget,
		};
	};

	if (isScorecardChart) {
		return (
			<Scorecard
				{...getScorecardProps()}
				showChartListView={showChartListView}
			/>
		);
	}

	if (chartType === insightsTypes.ChartType.BAR) {
		return (
			<Bar
				{...getColumnChartProps()}
				isMeasureByMonetary={false}
				axisDataKey={axisDataKey}
				xAxisLabel={descriptionText}
				measureByFilter={measureByFilter}
			/>
		);
	}

	return <Column {...getColumnChartProps()} />;
};

export default DurationChart;
