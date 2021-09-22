import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import BarChartStackedBySign from '../../atoms/ChartTypes/BarChartStackedBySign';
import { getValueForChart } from '../../atoms/ChartTypes/chartTypeUtils';
import { RevenueTooltip } from '../../atoms/ChartTooltip/RevenueTooltips';
import { RevenuePaymentTypes } from '../../utils/queries/dataMappingConstants';
import { ValueFormat, getFormattedValue } from '../../utils/valueFormatter';
import Scorecard from '../../atoms/ChartTypes/Scorecard';
import { StackedBarChartLabelControl } from '../../atoms/ChartTypes/BarChartStackedBySign/BarChartStackedBySign';
import { ListViewSegmentDataType } from '../../types/list-view';

export interface RevenueDataType {
	id: string;
	name: string;
	paymentsDueAt: string;
	paymentsPaymentType: RevenuePaymentTypes;
	total: number;
}

interface RevenueChartProps {
	chartType: insightsTypes.ChartType;
	data: any;
	isShownAsWidget: boolean;
	legendData: any;
	measureByFilter: string;
	showChartListView: (data: ListViewSegmentDataType) => void;
}

const RevenueChart = ({
	chartType,
	data,
	isShownAsWidget,
	legendData,
	measureByFilter,
	showChartListView,
}: RevenueChartProps) => {
	const translator = useTranslator();

	const valueFormatter = (value: any) =>
		getValueForChart({ value, isMeasureByMonetary: true });
	const tooltip = <RevenueTooltip measureByFilter={measureByFilter} />;

	const getBars = () => {
		return [
			{
				dataKey: RevenuePaymentTypes.INSTALLMENT,
				fillColor: legendData.installment.color,
			},
			{
				dataKey: RevenuePaymentTypes.ADDITIONAL,
				fillColor: legendData.additional.color,
			},
			{
				dataKey: RevenuePaymentTypes.RECURRING,
				fillColor: legendData.recurring.color,
			},
		];
	};

	const getScoreCardValue = () => {
		let total = 0;

		data.forEach(
			(periodData: RevenueDataType) => (total = total + periodData.total),
		);

		return total;
	};

	const getScorecardProps = () => {
		if (!data) {
			throw new Error(
				`Could not get proper data for stats report scorecard`,
			);
		}

		const total = getScoreCardValue();

		return {
			score: getFormattedValue(total, ValueFormat.MONETARY),
			description: translator.gettext('Revenue'),
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
			bars={getBars()}
			valueFormatter={valueFormatter}
			customTooltip={tooltip}
			showBarLabels={StackedBarChartLabelControl.TOTAL}
			showChartListView={showChartListView}
		/>
	);
};

export default RevenueChart;
