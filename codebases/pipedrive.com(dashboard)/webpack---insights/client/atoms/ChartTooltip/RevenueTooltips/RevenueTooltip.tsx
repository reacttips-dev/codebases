import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';

import ChartTooltip from '../ChartTooltip';
import getTooltipItems from './getTooltipItems';

interface RechartsTooltipProps {
	active?: boolean;
	label?: string;
	payload?: any;
}

interface TooltipOwnProps {
	measureByFilter: string;
}

export interface OverallConversionReportTooltipProps
	extends RechartsTooltipProps,
		TooltipOwnProps {}

const RevenueTooltip = (props: OverallConversionReportTooltipProps) => {
	const { active, label, payload, measureByFilter } = props;
	const translator = useTranslator();

	if (!active) {
		return null;
	}

	const tooltipItems = getTooltipItems(payload, measureByFilter, translator);

	return (
		<ChartTooltip
			title={label}
			subtitle={null}
			tooltipItems={tooltipItems}
			isReversed
		/>
	);
};

export default RevenueTooltip;
