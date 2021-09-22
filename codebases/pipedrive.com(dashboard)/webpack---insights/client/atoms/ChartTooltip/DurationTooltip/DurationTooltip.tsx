import React from 'react';
import { TooltipPayload } from 'recharts';
import { useTranslator, Translator } from '@pipedrive/react-utils';

import ChartTooltip from '../ChartTooltip';
import getTooltipSubtitle from './getTooltipSubtitle';
import { DurationDataField } from '../../../utils/queries/dataMappingConstants';

interface RechartsTooltipProps {
	active?: boolean;
	label?: string;
	payload?: any;
}

interface TooltipOwnProps {
	groupByFilter: string;
}

export interface OverallConversionReportTooltipProps
	extends TooltipOwnProps,
		RechartsTooltipProps {}

const getDealCountText = (
	payload: ReadonlyArray<TooltipPayload>,
	translator: Translator,
) => {
	if (payload.length === 0) {
		return '';
	}

	const duration = payload[0].payload[DurationDataField.DURATION];
	const dealCount = duration.dealCount || 0;

	return `(${translator.ngettext(
		'based on %d deal',
		'based on %d deals',
		dealCount,
		dealCount,
	)})`;
};

const DurationTooltip = (props: OverallConversionReportTooltipProps) => {
	const { active, label, payload, groupByFilter } = props;
	const translator = useTranslator();

	const isPayloadMissing = !payload || payload.length === 0;

	if (!active || isPayloadMissing) {
		return null;
	}

	const subtitle = getTooltipSubtitle(payload, groupByFilter, translator);

	const secondarySubtitle = getDealCountText(payload, translator);

	return (
		<ChartTooltip
			title={label}
			subtitle={subtitle}
			secondarySubtitle={secondarySubtitle}
		/>
	);
};

export default DurationTooltip;
