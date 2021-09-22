import React from 'react';
import { get } from 'lodash';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes, helpers } from '@pipedrive/insights-core';

import { getValueTextForTooltip } from '../../ChartTypes/ConversionFunnel/conversionFunnelUtils';
import { FunnelChartSummaryDataObject } from '../../../types/data-layer';
import ChartTitle from '../ChartTitle';

interface FunnelConversionTitleProps {
	chartSummaryData: FunnelChartSummaryDataObject;
	measureByFilter: string;
	data?: any[];
	measureByCustomName?: string;
	isInWidget: boolean;
}

const FunnelConversionTitle = ({
	chartSummaryData,
	measureByFilter,
	data,
	measureByCustomName,
	isInWidget = false,
}: FunnelConversionTitleProps) => {
	const translator = useTranslator();

	if (!measureByFilter) {
		return null;
	}

	const measureByFilterType =
		helpers.deals.getMeasureByFilterType(measureByFilter);

	const total = get(chartSummaryData, `total.${measureByFilterType}`, 0);
	const won = data && get(data[data.length - 1], measureByFilter, 0);
	const winningRate = get(
		chartSummaryData,
		`winRate.${measureByFilterType}`,
		0,
	);
	const title = translator.pgettext(
		'Win rate is [number]',
		'Win rate is %s',
		`${winningRate}%`,
	);

	const shouldDisplaySubtitle =
		!isInWidget &&
		measureByFilterType === insightsTypes.Deals.MeasureByType.COUNT &&
		won > 0;

	const getInlineInfoContent = (): JSX.Element => {
		const wonText = getValueTextForTooltip({
			value: won,
			measureByFilter,
			measureByCustomName,
			translator,
		});
		const totalText = getValueTextForTooltip({
			value: total,
			measureByFilter,
			measureByCustomName,
			includeCustomFieldName: true,
			translator,
		});

		return (
			<>
				<div>
					{translator.gettext('Total')}: {totalText}
				</div>
				<div>
					{translator.gettext('Won')}: {wonText} ({winningRate}%)
				</div>
			</>
		);
	};

	const getSubTitle = () => {
		const numberOfDealsToWinOne = Math.round(total / won);

		return translator.ngettext(
			'To win one deal, %d deal should be added on average.',
			'To win one deal, %d deals should be added on average.',
			numberOfDealsToWinOne,
			numberOfDealsToWinOne,
		);
	};

	return (
		<ChartTitle
			title={title}
			{...(isInWidget
				? {}
				: { inlineInfoContent: getInlineInfoContent() })}
			{...(shouldDisplaySubtitle ? { subtitle: getSubTitle() } : {})}
			isInWidget={isInWidget}
		/>
	);
};

export default FunnelConversionTitle;
