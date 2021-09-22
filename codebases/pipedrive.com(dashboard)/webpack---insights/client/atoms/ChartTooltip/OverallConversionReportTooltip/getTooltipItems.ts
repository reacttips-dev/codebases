import { get } from 'lodash';
import { TooltipPayload } from 'recharts';
import { Translator } from '@pipedrive/react-utils';
import { helpers } from '@pipedrive/insights-core';

import { ChartTooltipItem } from '../getChartTooltipItems';
import {
	getFormattedValue,
	ValueFormat,
	getValueFormatBasedOnMeasureBy,
} from '../../../utils/valueFormatter';
import { OverallConversionDataKey } from '../../../utils/queries/dataMappingConstants';

const getTooltipItemLabelPrefix = (
	payloadItem: any,
	translator: Translator,
) => {
	if (payloadItem.dataKey === OverallConversionDataKey.WON_CONVERSION) {
		return translator.gettext('Win rate');
	}

	if (payloadItem.dataKey === OverallConversionDataKey.LOST_CONVERSION) {
		return translator.gettext('Loss rate');
	}

	return payloadItem.name;
};

const getTotalAmountBasedOnMeasureBy = ({
	measureByFilter,
	payloadItem,
	valueFormat,
	translator,
	totalAmountDataKey,
}: {
	measureByFilter: string;
	payloadItem: any;
	valueFormat: ValueFormat;
	translator: Translator;
	totalAmountDataKey: OverallConversionDataKey;
}) => {
	const totalAmount = get(payloadItem, `payload.${totalAmountDataKey}`);
	const formattedValue = getFormattedValue(totalAmount, valueFormat);
	const isMeasurByCustomField = helpers.deals.isCustomField(measureByFilter);

	if (!isMeasurByCustomField && valueFormat === ValueFormat.COUNT) {
		const dealCountText = translator.ngettext(
			'%d deal',
			'%d deals',
			totalAmount,
			totalAmount,
		);

		return ` (${dealCountText})`;
	}

	return ` (${formattedValue})`;
};

const getFormattedTotalAmount = (
	payloadItem: any,
	valueFormat: ValueFormat,
	measureByFilter: string,
	translator: Translator,
) => {
	if (payloadItem.dataKey === OverallConversionDataKey.WON_CONVERSION) {
		return getTotalAmountBasedOnMeasureBy({
			payloadItem,
			valueFormat,
			translator,
			measureByFilter,
			totalAmountDataKey: OverallConversionDataKey.WON_TOTAL,
		});
	}

	if (payloadItem.dataKey === OverallConversionDataKey.LOST_CONVERSION) {
		return getTotalAmountBasedOnMeasureBy({
			payloadItem,
			valueFormat,
			translator,
			measureByFilter,
			totalAmountDataKey: OverallConversionDataKey.LOST_TOTAL,
		});
	}

	return '';
};

const getTooltipItems = (
	payload: ReadonlyArray<TooltipPayload>,
	measureByFilter: string,
	translator: Translator,
) => {
	const valueFormat: ValueFormat =
		getValueFormatBasedOnMeasureBy(measureByFilter);

	return (payload || []).reduce(
		(collectionOfTooltipItems: ChartTooltipItem[], payloadItem: any) => {
			const labelPrefix: string = getTooltipItemLabelPrefix(
				payloadItem,
				translator,
			);
			const formattedValue = getFormattedValue(
				payloadItem.value,
				ValueFormat.PERCENTAGE,
			);
			const formattedTotalAmount = getFormattedTotalAmount(
				payloadItem,
				valueFormat,
				measureByFilter,
				translator,
			);

			const tooltipItem: ChartTooltipItem = {
				dotColor: payloadItem.color,
				label: `${labelPrefix}: ${formattedValue}${formattedTotalAmount}`,
			};

			collectionOfTooltipItems.push(tooltipItem);

			return collectionOfTooltipItems;
		},
		[],
	);
};

export default getTooltipItems;
