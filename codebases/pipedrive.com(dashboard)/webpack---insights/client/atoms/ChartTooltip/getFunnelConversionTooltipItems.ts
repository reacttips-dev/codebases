import { get } from 'lodash';
import { Translator } from '@pipedrive/react-utils';
import { types as insightsTypes, helpers } from '@pipedrive/insights-core';

import { getValueTextForTooltip } from '../ChartTypes/ConversionFunnel/conversionFunnelUtils';
import { FunnelChartItemColor } from '../ChartTypes/chartStyleConstants';
import { ChartTooltipItem } from './getChartTooltipItems';
import { FunnelChartSummaryDataObject } from '../../types/data-layer';

const getItemForWonColumn = ({
	chartSummaryData,
	measureByFilterType,
	valueText,
	translator,
}: {
	chartSummaryData: FunnelChartSummaryDataObject;
	measureByFilterType: insightsTypes.Deals.MeasureByType;
	valueText: string;
	translator: Translator;
}) => {
	const winningRate = get(chartSummaryData, `winRate.${measureByFilterType}`);

	return {
		dotColor: FunnelChartItemColor.WON_BAR,
		label: `${translator.gettext('Won')}: ${valueText} (${winningRate}%)`,
	};
};

const getItemWithValueDataForStageColumn = (
	valueText: string,
	translator: Translator,
) => {
	return {
		dotColor: FunnelChartItemColor.STAGE_BAR,
		label: `${translator.gettext('Reached stage')}: ${valueText}`,
	};
};

const getItemWithConversionDataForStageColumn = ({
	data,
	conversionFrom,
	itemIndex,
	measureByFilter,
	measureByFilterType,
	measureByCustomName,
	hasNextPage,
	translator,
}: {
	data: any[];
	conversionFrom: number;
	itemIndex: number;
	measureByFilter: string;
	measureByFilterType: insightsTypes.Deals.MeasureByType;
	measureByCustomName?: string;
	hasNextPage: boolean;
	translator: Translator;
}) => {
	const isLastStageColumn = data.length === itemIndex + 2 && !hasNextPage;
	const nextItemIndex = itemIndex + 1;
	const nextItemValue = data[nextItemIndex][measureByFilterType];

	let labelPrefix: string;

	if (isLastStageColumn) {
		labelPrefix = translator.gettext('Won from stage');
	} else {
		labelPrefix = translator.gettext(
			'Conversion to next stage (incl. won)',
		);
	}

	const wonText = getValueTextForTooltip({
		value: nextItemValue,
		measureByFilter,
		measureByCustomName,
		translator,
	});

	return {
		dotColor: FunnelChartItemColor.CONVERSION_ARROW,
		label: `${labelPrefix}: ${conversionFrom}% (${wonText})`,
	};
};

const getFunnelConversionTooltipItems = ({
	payload,
	data,
	chartSummaryData,
	measureByFilter,
	measureByCustomName,
	hasNextPage,
	translator,
}: {
	payload: any;
	data: any;
	chartSummaryData: FunnelChartSummaryDataObject;
	measureByFilter: string;
	measureByCustomName?: string;
	hasNextPage: boolean;
	translator: Translator;
}) => {
	const measureByFilterType = helpers.deals.getMeasureByFilterType(
		measureByFilter,
	) as insightsTypes.Deals.MeasureByType;
	const conversionFrom = get(payload[0], 'payload.conversionFrom');
	const value = get(payload[0], 'value');
	const valueText = getValueTextForTooltip({
		value,
		measureByFilter,
		measureByCustomName,
		includeCustomFieldName: true,
		translator,
	});

	const id = get(payload[0], 'payload.id');
	const itemIndex = data.findIndex((item: any) => item.id === id);
	const isWonColumn = itemIndex === data.length - 1;

	if (isWonColumn) {
		return [
			getItemForWonColumn({
				chartSummaryData,
				measureByFilterType,
				valueText,
				translator,
			}),
		] as ChartTooltipItem[];
	}

	return [
		getItemWithValueDataForStageColumn(valueText, translator),
		getItemWithConversionDataForStageColumn({
			data,
			conversionFrom,
			itemIndex,
			measureByFilter,
			measureByFilterType,
			measureByCustomName,
			hasNextPage,
			translator,
		}),
	] as ChartTooltipItem[];
};

export default getFunnelConversionTooltipItems;
