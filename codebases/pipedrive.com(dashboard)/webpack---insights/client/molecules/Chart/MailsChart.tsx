import React from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { useTranslator } from '@pipedrive/react-utils';

import MailsTooltip from '../../atoms/ChartTooltip/MailsTooltip';
import Column from '../../atoms/ChartTypes/Column';
import Bar from '../../atoms/ChartTypes/Bar';
import Scorecard from '../../atoms/ChartTypes/Scorecard';
import { MappedScorecardChartData } from '../../types/data-layer';
import { getMailsMeasureByLabel } from '../../utils/filterUtils';
import { ListViewSegmentDataType } from '../../types/list-view';
import { getValueForChart } from '../../atoms/ChartTypes/chartTypeUtils';
import { numberFormatter } from '../../utils/numberFormatter';

interface MailsChartProps {
	chartType: insightsTypes.ChartType;
	isShownAsWidget: boolean;
	hasSegment: boolean;
	data: any | MappedScorecardChartData;
	segmentByFilter: string;
	uniqueSegments: any[];
	intervalFilter: insightsTypes.Interval;
	axisDataKey: string;
	measureByFilter: string;
	showChartListView: (data: ListViewSegmentDataType) => void;
}

const MailsChart = ({
	chartType,
	isShownAsWidget,
	hasSegment,
	data,
	segmentByFilter,
	uniqueSegments,
	intervalFilter,
	axisDataKey,
	measureByFilter,
	showChartListView,
}: MailsChartProps) => {
	const translator = useTranslator();
	const measureByFilterLabel = getMailsMeasureByLabel(
		insightsTypes.Activities.MesaureByField.COUNT,
		translator,
	);
	const valueFormatter = (value: number) =>
		getValueForChart({ value, isMeasureByMonetary: false });

	if (chartType === insightsTypes.ChartType.COLUMN) {
		return (
			<Column
				widget={isShownAsWidget}
				groupedAndSegmentedData={data}
				segmentBy={segmentByFilter}
				uniqueSegments={uniqueSegments}
				intervalFilter={intervalFilter}
				measureByFilter={measureByFilter}
				hasSegment={hasSegment}
				xAxisDataKey={axisDataKey}
				valueFormatter={valueFormatter}
				customTooltip={<MailsTooltip intervalFilter={intervalFilter} />}
				yAxisLabel={measureByFilterLabel}
				showChartListView={showChartListView}
			/>
		);
	}

	if (chartType === insightsTypes.ChartType.BAR) {
		return (
			<Bar
				widget={isShownAsWidget}
				hasSegment={hasSegment}
				groupedAndSegmentedData={data}
				segmentBy={segmentByFilter}
				isMeasureByMonetary={false}
				uniqueSegments={uniqueSegments}
				intervalFilter={intervalFilter}
				axisDataKey={axisDataKey}
				showChartListView={showChartListView}
				valueFormatter={valueFormatter}
				measureByFilter={measureByFilter}
				customTooltip={<MailsTooltip intervalFilter={intervalFilter} />}
			/>
		);
	}

	if (chartType === insightsTypes.ChartType.SCORECARD) {
		const { score } = data;

		return (
			<Scorecard
				score={numberFormatter.format({
					value: score,
					isMonetary: false,
				})}
				description={measureByFilterLabel}
				isShownAsWidget={isShownAsWidget}
				showChartListView={showChartListView}
			/>
		);
	}

	return null;
};

export default MailsChart;
