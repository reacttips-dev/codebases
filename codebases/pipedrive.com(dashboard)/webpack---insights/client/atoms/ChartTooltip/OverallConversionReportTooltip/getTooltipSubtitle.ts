import { TooltipPayload } from 'recharts';
import { Translator } from '@pipedrive/react-utils';
import { helpers } from '@pipedrive/insights-core';

import {
	ValueFormat,
	getFormattedValue,
	getValueFormatBasedOnMeasureBy,
} from '../../../utils/valueFormatter';

const getTotalAmount = (payload: ReadonlyArray<TooltipPayload>) => {
	if (payload.length === 0) {
		return 0;
	}

	const firstPayloadItem = payload[0].payload;
	const wonTotal = firstPayloadItem.won ? firstPayloadItem.won.total : 0;
	const lostTotal = firstPayloadItem.lost ? firstPayloadItem.lost.total : 0;

	return wonTotal + lostTotal;
};

const getFormattedSubtitleValue = ({
	totalAmount,
	measureByFilter,
	measureByFilterName,
	translator,
}: {
	totalAmount: number;
	measureByFilter: string;
	measureByFilterName: string;
	translator: Translator;
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

	if (valueFormat === ValueFormat.COUNT) {
		return translator.ngettext(
			'%d deal',
			'%d deals',
			totalAmount,
			totalAmount,
		);
	}

	return `${formattedValue}`;
};

const getFormattedSubtitleText = ({
	totalAmount,
	measureByFilter,
	measureByFilterName,
	translator,
}: {
	totalAmount: number;
	measureByFilter: string;
	measureByFilterName: string;
	translator: Translator;
}) => {
	const prefix = translator.gettext('Total');
	const subtitleValue = getFormattedSubtitleValue({
		totalAmount,
		measureByFilter,
		measureByFilterName,
		translator,
	});

	return `${prefix}: ${subtitleValue}`;
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

	return getFormattedSubtitleText({
		totalAmount,
		measureByFilter,
		measureByFilterName,
		translator,
	});
};

export default getTooltipSubtitle;
