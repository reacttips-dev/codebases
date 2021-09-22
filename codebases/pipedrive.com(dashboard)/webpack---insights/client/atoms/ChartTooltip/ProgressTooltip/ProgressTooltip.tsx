import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import ChartTooltip from '../ChartTooltip';
import { getProgressTooltipSubtitle } from './progressTooltipUtils';
import { ValueFormat, getFormattedValue } from '../../../utils/valueFormatter';
import { formatIntervals } from '../../../utils/dateFormatter';
import getChartTooltipItems from '../../../atoms/ChartTooltip/getChartTooltipItems';
import useReportOptions from '../../../hooks/useReportOptions';

interface RechartsTooltipProps {
	active?: boolean;
	label?: string;
	payload?: any;
}

interface TooltipOwnProps {
	isMeasureByMonetary: boolean;
	measureByFilter: string;
	intervalFilter: insightsTypes.Interval;
	groupedAndSegmentedData: any[];
	groupByFilter: string;
	hasSegment: boolean;
}

export interface ProgressTooltipProps
	extends RechartsTooltipProps,
		TooltipOwnProps {}

const ProgressTooltip = (props: ProgressTooltipProps) => {
	const {
		active,
		label,
		payload,
		isMeasureByMonetary,
		intervalFilter,
		groupedAndSegmentedData,
		groupByFilter,
		hasSegment,
		measureByFilter,
	} = props;
	const valueFormat = isMeasureByMonetary
		? ValueFormat.MONETARY
		: ValueFormat.COUNT;
	const translator = useTranslator();
	const { fields } = useReportOptions(insightsTypes.DataType.DEALS);

	const title = formatIntervals(intervalFilter, label) || label;

	const tooltipItems = getChartTooltipItems(
		payload,
		'name',
		'fill',
		(value: number) => getFormattedValue(value, valueFormat),
	);

	const subtitle = getProgressTooltipSubtitle({
		payload,
		groupedAndSegmentedData,
		filters: { groupByFilter, measureByFilter },
		fields,
		translator,
	});

	if (active) {
		return (
			<ChartTooltip
				title={title as string}
				subtitle={subtitle}
				isReversed
				{...(hasSegment ? { tooltipItems } : {})}
			/>
		);
	}

	return null;
};

export default ProgressTooltip;
