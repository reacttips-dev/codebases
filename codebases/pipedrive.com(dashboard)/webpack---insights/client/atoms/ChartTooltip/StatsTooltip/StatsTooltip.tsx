import React from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { useTranslator } from '@pipedrive/react-utils';
import { TooltipPayload } from 'recharts';

import ChartTooltip from '../ChartTooltip';
import {
	ValueFormat,
	getFormattedValue,
	getValueFormatBasedOnMeasureBy,
} from '../../../utils/valueFormatter';
import { formatIntervals } from '../../../utils/dateFormatter';
import getChartTooltipItems from '../../../atoms/ChartTooltip/getChartTooltipItems';

interface RechartsTooltipProps {
	active?: boolean;
	label?: string;
	payload?: any;
}

interface TooltipOwnProps {
	isMeasureByMonetary: boolean;
	intervalFilter: insightsTypes.Interval;
	measureByFilter: string;
	segmentByFilter: string;
}

export interface StatsTooltipProps
	extends RechartsTooltipProps,
		TooltipOwnProps {}

const StatsTooltip = (props: StatsTooltipProps) => {
	const {
		active,
		label,
		payload,
		isMeasureByMonetary,
		segmentByFilter,
		measureByFilter,
		intervalFilter,
	} = props;
	const valueFormat = isMeasureByMonetary
		? ValueFormat.MONETARY
		: ValueFormat.COUNT;
	const translator = useTranslator();

	const title = formatIntervals(intervalFilter, label) || label;
	const tooltipItems = getChartTooltipItems(
		payload,
		'name',
		'fill',
		(value: number) => getFormattedValue(value, valueFormat),
	);

	const getTooltipSubtitle = ({
		segmentByFilter,
		measureByFilter,
		payload,
	}: {
		segmentByFilter: string;
		measureByFilter: string;
		payload: ReadonlyArray<TooltipPayload>;
	}) => {
		if (!payload || !payload.length) {
			return '';
		}

		const objectWithSegmentsAndValues = payload[0].payload[segmentByFilter];
		const groupingTotal = objectWithSegmentsAndValues
			? Object.values(objectWithSegmentsAndValues).reduce(
					(a: number, b: number) => a + b,
			  )
			: 0;
		const valueFormat = getValueFormatBasedOnMeasureBy(measureByFilter);

		const formattedTotal: string | number = getFormattedValue(
			groupingTotal as number,
			valueFormat,
		);

		return `${translator.gettext('Total')}: ${formattedTotal}`;
	};

	if (active) {
		return (
			<ChartTooltip
				title={title as string}
				{...(segmentByFilter && {
					subtitle: getTooltipSubtitle({
						segmentByFilter,
						measureByFilter,
						payload,
					}),
				})}
				tooltipItems={tooltipItems}
				isReversed
			/>
		);
	}

	return null;
};

export default StatsTooltip;
