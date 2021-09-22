import { types as insightsTypes, helpers } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';

import {
	getFormattedValue,
	getValueFormatBasedOnMeasureBy,
} from '../../utils/valueFormatter';
import { getMeasureByLabel } from '../../utils/filterUtils';

export default ({
	groupedAndSegmentedData,
	measureByFilter,
	isShownAsWidget,
	fields,
	translator,
}: {
	isShownAsWidget: boolean;
	groupedAndSegmentedData: any;
	measureByFilter: string;
	fields: any[];
	translator: Translator;
}) => {
	const hasExactlyOneDataGroup = groupedAndSegmentedData?.length === 1;

	if (!hasExactlyOneDataGroup) {
		throw new Error(`Could not get proper data for stats report scorecard`);
	}

	const getValueDataKey = () => {
		if (
			measureByFilter === insightsTypes.Deals.MeasureByType.AVERAGE_VALUE
		) {
			return insightsTypes.Deals.MeasureByType.AVERAGE_VALUE;
		}

		if (
			helpers.deals.getMeasureByFilterType(measureByFilter) ===
			insightsTypes.Deals.MeasureByType.VALUE
		) {
			return insightsTypes.Deals.MeasureByType.VALUE;
		}

		return insightsTypes.Deals.MeasureByType.COUNT;
	};

	const scorecardData = groupedAndSegmentedData[0];
	const value = scorecardData[getValueDataKey()];
	const productAmount =
		measureByFilter === insightsTypes.Deals.MeasureByType.PRODUCTS_AMOUNT
			? 'count'
			: null;

	return {
		score: getFormattedValue(
			Math.round(value),
			getValueFormatBasedOnMeasureBy(productAmount || measureByFilter),
		),
		isShownAsWidget,
		description: getMeasureByLabel(measureByFilter, fields, translator),
	};
};
