import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { formatIntervals } from '../../../utils/dateFormatter';
import { ValueFormat, getFormattedValue } from '../../../utils/valueFormatter';
import ChartTooltip from '../ChartTooltip';
import getTooltipSubtitle from './getTooltipSubtitle';
import useReportOptions from '../../../hooks/useReportOptions';
import { getCustomFieldName } from '../../../utils/filterUtils';
import getChartTooltipItems from '../getChartTooltipItems';

interface RechartsTooltipProps {
	active?: boolean;
	label?: string;
	payload?: any;
}

interface TooltipOwnProps {
	measureByFilter: string;
	intervalFilter: insightsTypes.Interval;
}

export interface RevenueForecastTooltipProps
	extends RechartsTooltipProps,
		TooltipOwnProps {}

const RevenueForecastTooltip = (props: RevenueForecastTooltipProps) => {
	const { active, label, payload, measureByFilter, intervalFilter } = props;
	const translator = useTranslator();
	const { fields } = useReportOptions(insightsTypes.DataType.DEALS);

	const subtitle = getTooltipSubtitle({
		payload,
		measureByFilter,
		measureByFilterName: getCustomFieldName(fields, measureByFilter),
		translator,
	});
	const title = formatIntervals(intervalFilter, label) || label;
	const tooltipItems = getChartTooltipItems(
		payload,
		'name',
		'fill',
		(value: number) => getFormattedValue(value, ValueFormat.MONETARY),
	);

	if (active) {
		return (
			<ChartTooltip
				title={title as string}
				subtitle={subtitle}
				tooltipItems={tooltipItems}
				isReversed
			/>
		);
	}

	return null;
};

export default RevenueForecastTooltip;
