import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import getTooltipItems from './getTooltipItems';
import ChartTooltip from '../ChartTooltip';
import getTooltipSubtitle from './getTooltipSubtitle';
import useReportOptions from '../../../hooks/useReportOptions';
import { getCustomFieldName } from '../../../utils/filterUtils';

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

const OverallConversionReportTooltip = (
	props: OverallConversionReportTooltipProps,
) => {
	const { active, label, payload, measureByFilter } = props;
	const translator = useTranslator();
	const { fields } = useReportOptions(insightsTypes.DataType.DEALS);

	const subtitle = getTooltipSubtitle({
		payload,
		measureByFilter,
		measureByFilterName: getCustomFieldName(fields, measureByFilter),
		translator,
	});
	const tooltipItems = getTooltipItems(payload, measureByFilter, translator);

	if (active) {
		return (
			<ChartTooltip
				title={label}
				subtitle={subtitle}
				tooltipItems={tooltipItems}
			/>
		);
	}

	return null;
};

export default OverallConversionReportTooltip;
