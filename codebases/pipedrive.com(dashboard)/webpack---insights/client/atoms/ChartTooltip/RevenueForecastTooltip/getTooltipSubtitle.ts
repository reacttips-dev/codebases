import { TooltipPayload } from 'recharts';
import { Translator } from '@pipedrive/react-utils';
import { helpers } from '@pipedrive/insights-core';

import {
	ValueFormat,
	getFormattedValue,
	getValueFormatBasedOnMeasureBy,
} from '../../../utils/valueFormatter';

export const getTotalAmount = (payload: ReadonlyArray<TooltipPayload>) => {
	const firstPayloadItem = payload?.[0]?.payload;
	const openValue = firstPayloadItem?.status?.open || 0;
	const wonValue = firstPayloadItem?.status?.won || 0;

	return openValue + wonValue;
};

export const getFormattedSubtitleValue = ({
	totalAmount,
	measureByFilter,
	measureByFilterName,
}: {
	totalAmount: number;
	measureByFilter: string;
	measureByFilterName: string;
}) => {
	const isMeasureByCustomField = helpers.deals.isCustomField(measureByFilter);
	const valueFormat: ValueFormat =
		getValueFormatBasedOnMeasureBy(measureByFilter);
	const formattedValue = getFormattedValue(totalAmount, valueFormat);

	if (isMeasureByCustomField) {
		const description = measureByFilterName
			? `(${measureByFilterName})`
			: '';

		return `${formattedValue} ${description}`;
	}

	return `${formattedValue}`;
};

const getTooltipSubtitle = ({
	payload,
	measureByFilter,
	measureByFilterName,
	translator,
}: {
	payload: ReadonlyArray<TooltipPayload>;
	measureByFilter: string;
	measureByFilterName: string;
	translator: Translator;
}) => {
	if (!payload || payload.length === 0) {
		return '';
	}

	const totalAmount: number = getTotalAmount(payload);
	const prefix = translator.gettext('Total');
	const subtitleValue = getFormattedSubtitleValue({
		totalAmount,
		measureByFilter,
		measureByFilterName,
	});

	return `${prefix}: ${subtitleValue}`;
};

export default getTooltipSubtitle;
