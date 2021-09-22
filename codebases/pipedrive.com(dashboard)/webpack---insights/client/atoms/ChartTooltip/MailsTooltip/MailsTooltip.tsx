import React from 'react';
import { Interval } from '@pipedrive/insights-core/lib/types';

import ChartTooltip from '../ChartTooltip';
import { ValueFormat, getFormattedValue } from '../../../utils/valueFormatter';
import { formatIntervals } from '../../../utils/dateFormatter';
import getChartTooltipItems from '../../../atoms/ChartTooltip/getChartTooltipItems';

interface RechartsTooltipProps {
	active?: boolean;
	label?: string;
	payload?: any;
}

interface TooltipOwnProps {
	intervalFilter: Interval;
}

export interface MailsTooltipProps
	extends RechartsTooltipProps,
		TooltipOwnProps {}

const MailsTooltip = (props: MailsTooltipProps) => {
	const { active, label, payload, intervalFilter } = props;

	const isPayloadMissing = !payload || payload.length === 0;

	if (!active || isPayloadMissing) {
		return null;
	}

	const title = formatIntervals(intervalFilter, label) || label;
	const tooltipItems = getChartTooltipItems(
		payload,
		'name',
		'fill',
		(value: number) => getFormattedValue(value, ValueFormat.COUNT),
	);

	return <ChartTooltip title={title as string} tooltipItems={tooltipItems} />;
};

export default MailsTooltip;
