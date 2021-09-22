import React from 'react';
import { get } from 'lodash';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import BarChartStackedBySign from '../../atoms/ChartTypes/BarChartStackedBySign';
import Scorecard from '../../atoms/ChartTypes/Scorecard';
import { OverallConversionDataKey } from '../../utils/queries/dataMappingConstants';
import OverallConversionReportTooltip from '../../atoms/ChartTooltip/OverallConversionReportTooltip';
import { getMeasureByLabel } from '../../utils/filterUtils';
import useReportOptions from '../../hooks/useReportOptions';
import { ValueFormat, getFormattedValue } from '../../utils/valueFormatter';
import { StackedBarChartLabelControl } from '../../atoms/ChartTypes/BarChartStackedBySign/BarChartStackedBySign';

interface OverallConversionChartProps {
	chartType: insightsTypes.ChartType;
	data: any;
	isShownAsWidget: boolean;
	legendData: any;
	measureByFilter: string;
}

const OverallConversionChart = ({
	chartType,
	data,
	isShownAsWidget = false,
	legendData,
	measureByFilter,
}: OverallConversionChartProps) => {
	const translator = useTranslator();
	const { fields } = useReportOptions(insightsTypes.DataType.DEALS);

	const getStackedBarChartProps = () => {
		return {
			data,
			isShownAsWidget,
			bars: [
				{
					dataKey: OverallConversionDataKey.WON_CONVERSION,
					fillColor: legendData.won?.color,
				},
				{
					dataKey: OverallConversionDataKey.LOST_CONVERSION,
					fillColor: legendData.lost?.color,
				},
			],
			showBarLabels: StackedBarChartLabelControl.ALL,
			valueFormatter: (value: any) =>
				getFormattedValue(value, ValueFormat.PERCENTAGE),
			yAxisValueRange: [-100, 100] as [number, number],
			customTooltip: (
				<OverallConversionReportTooltip
					measureByFilter={measureByFilter}
				/>
			),
			...(isShownAsWidget
				? { yAxisLabel: translator.gettext('Conversion') }
				: {}),
		};
	};

	const getScorecardProps = () => {
		const hasExactlyOneDataGroup = data.length === 1;

		if (!data || !hasExactlyOneDataGroup) {
			throw new Error(
				`Could not get proper data for stats report scorecard`,
			);
		}

		const value =
			get(data[0], OverallConversionDataKey.WON_CONVERSION) || 0;
		const measureByLabel = getMeasureByLabel(
			measureByFilter,
			fields,
			translator,
		);

		return {
			score: getFormattedValue(value, ValueFormat.PERCENTAGE),
			description: `${translator.gettext(
				'Win rate',
			)} (${measureByLabel})`,
			isShownAsWidget,
		};
	};

	if (chartType === insightsTypes.ChartType.STACKED_BAR_CHART) {
		return <BarChartStackedBySign {...getStackedBarChartProps()} />;
	}

	if (chartType === insightsTypes.ChartType.SCORECARD) {
		return <Scorecard {...getScorecardProps()} />;
	}

	return null;
};

export default OverallConversionChart;
