import { TooltipPayload } from 'recharts';
import { Translator } from '@pipedrive/react-utils';

import { ChartTooltipItem } from '../getChartTooltipItems';
import {
	getFormattedValue,
	ValueFormat,
	getValueFormatBasedOnMeasureBy,
} from '../../../utils/valueFormatter';
import {
	RecurringRevenueMovementDataKey,
	RevenuePaymentTypes,
} from '../../../utils/queries/dataMappingConstants';

const getTooltipItemLabelPrefix = (
	payloadItem: any,
	translator: Translator,
) => {
	switch (payloadItem.dataKey) {
		case RecurringRevenueMovementDataKey.NEW:
			return translator.gettext('New added');

		case RecurringRevenueMovementDataKey.CHURN:
			return translator.gettext('Churn');

		case RecurringRevenueMovementDataKey.CONTRACTION:
			return translator.gettext('Contraction');

		case RecurringRevenueMovementDataKey.EXPANSION:
			return translator.gettext('Expansion');

		case RevenuePaymentTypes.RECURRING:
			return translator.gettext('Recurring');

		case RevenuePaymentTypes.ADDITIONAL:
			return translator.gettext('One-time');

		case RevenuePaymentTypes.INSTALLMENT:
			return translator.gettext('Payment schedule');

		default:
			return payloadItem.name;
	}
};

const getTooltipItems = (
	payload: ReadonlyArray<TooltipPayload>,
	measureByFilter: string,
	translator: Translator,
) => {
	const valueFormat: ValueFormat =
		getValueFormatBasedOnMeasureBy(measureByFilter);

	const payloadItemsExceptTotal = (payload || []).filter(
		(item) => item.dataKey !== 'total',
	);

	return payloadItemsExceptTotal.reduce(
		(collectionOfTooltipItems: ChartTooltipItem[], payloadItem: any) => {
			const labelPrefix: string = getTooltipItemLabelPrefix(
				payloadItem,
				translator,
			);
			const formattedValue = getFormattedValue(
				payloadItem.value,
				valueFormat,
			);

			const tooltipItem: ChartTooltipItem = {
				dotColor: payloadItem.color,
				label: `${labelPrefix}: ${formattedValue}`,
			};

			collectionOfTooltipItems.push(tooltipItem);

			return collectionOfTooltipItems;
		},
		[],
	);
};

export default getTooltipItems;
