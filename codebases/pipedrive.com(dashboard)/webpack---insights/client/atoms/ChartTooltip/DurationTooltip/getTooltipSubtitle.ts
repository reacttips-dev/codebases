import { Translator } from '@pipedrive/react-utils';
import { TooltipPayload } from 'recharts';

import { getFormattedDuration } from '../../../utils/duration/durationUtils';
import { DurationDataField } from '../../../utils/queries/dataMappingConstants';
import { DEAL_STAGE_LOG_STAGE_ID } from '../../../utils/constants';

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

const getTotalDuration = (
	payload: ReadonlyArray<TooltipPayload>,
	translator: Translator,
) => {
	if (payload.length === 0) {
		return '';
	}

	const duration = payload[0].payload[DurationDataField.DURATION];
	const durationInDays = duration.durationInDays;

	return getFormattedDuration({
		duration: durationInDays,
		translator,
	});
};

const getTooltipSubtitle = (
	payload: ReadonlyArray<TooltipPayload>,
	groupByFilter: string,
	translator: Translator,
) => {
	const isGroupedByStageEntered = groupByFilter === DEAL_STAGE_LOG_STAGE_ID;

	const formattedDuration = getTotalDuration(payload, translator);

	const description = isGroupedByStageEntered
		? translator.gettext('Average time in stage')
		: translator.gettext('Average sales cycle');

	return `${description}: ${formattedDuration}`;
};

export default getTooltipSubtitle;
