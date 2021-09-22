import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import Scorecard from '../../atoms/ChartTypes/Scorecard';
import BarChartStackedBySign from '../../atoms/ChartTypes/BarChartStackedBySign';
import { RecurringRevenueMovementDataKey } from '../../utils/queries/dataMappingConstants';
import { getValueForChart } from '../../atoms/ChartTypes/chartTypeUtils';
import { RevenueTooltip } from '../../atoms/ChartTooltip/RevenueTooltips';
import { ValueFormat, getFormattedValue } from '../../utils/valueFormatter';
import { StackedBarChartLabelControl } from '../../atoms/ChartTypes/BarChartStackedBySign/BarChartStackedBySign';
import { ListViewSegmentDataType } from '../../types/list-view';

export interface RecurringRevenueMovementDataType {
	id: string;
	name: string;
	paymentsDueAt: string;
	paymentsType: RecurringRevenueMovementDataKey;
	total: number;
}

interface RecurringRevenueMovementChartProps {
	chartType: insightsTypes.ChartType;
	data: any;
	isShownAsWidget: boolean;
	legendData: any;
	measureByFilter: string;
	showChartListView: (data: ListViewSegmentDataType) => void;
}

const RecurringRevenueMovementChart = ({
	chartType,
	data,
	isShownAsWidget = false,
	legendData,
	measureByFilter,
	showChartListView,
}: RecurringRevenueMovementChartProps) => {
	const translator = useTranslator();

	const bars = [
		{
			dataKey: RecurringRevenueMovementDataKey.NEW,
			fillColor: legendData.new.color,
		},
		{
			dataKey: RecurringRevenueMovementDataKey.CHURN,
			fillColor: legendData.churn.color,
		},
		{
			dataKey: RecurringRevenueMovementDataKey.EXPANSION,
			fillColor: legendData.expansion.color,
		},
		{
			dataKey: RecurringRevenueMovementDataKey.CONTRACTION,
			fillColor: legendData.contraction.color,
		},
	];

	const lines = [
		{
			dataKey: 'total',
			fillColor: legendData.total.color,
		},
	];
	const valueFormatter = (value: number): string | number =>
		getValueForChart({ value, isMeasureByMonetary: true });
	const tooltip = <RevenueTooltip measureByFilter={measureByFilter} />;

	const getScoreCardValue = () => {
		let netGrowth = 0;

		data.forEach(
			(periodData: RecurringRevenueMovementDataType) =>
				(netGrowth = netGrowth + periodData.total),
		);

		return netGrowth;
	};

	const getScorecardProps = () => {
		if (!data) {
			throw new Error(
				`Could not get proper data for stats report scorecard`,
			);
		}

		const value = getScoreCardValue();

		return {
			score: getFormattedValue(value, ValueFormat.MONETARY),
			description: translator.gettext('Net growth'),
			isShownAsWidget,
		};
	};

	if (chartType === insightsTypes.ChartType.SCORECARD) {
		return (
			<Scorecard
				{...getScorecardProps()}
				showChartListView={showChartListView}
			/>
		);
	}

	return (
		<BarChartStackedBySign
			data={data}
			isShownAsWidget={isShownAsWidget}
			bars={bars}
			valueFormatter={valueFormatter}
			customTooltip={tooltip}
			lines={lines}
			showBarLabels={StackedBarChartLabelControl.NONE}
			showChartListView={showChartListView}
		/>
	);
};

export default RecurringRevenueMovementChart;
