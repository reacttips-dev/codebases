import { get } from 'lodash';
import { TooltipPayload } from 'recharts';
import { Translator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { ChartTooltipItem } from '../getChartTooltipItems';
import {
	getFormattedDuration,
	DurationFormat,
	DurationUnit,
} from '../../../utils/duration/durationUtils';
import { getFormattedValue, ValueFormat } from '../../../utils/valueFormatter';

export interface ActivityChartTooltipItem extends ChartTooltipItem {
	key: string;
	name: string;
}

const getTooltipFormattedValue = (
	value: number,
	measureByFilter: string,
	translator: Translator,
): string => {
	return measureByFilter === insightsTypes.Activities.MesaureByField.DURATION
		? getFormattedDuration({
				duration: value,
				translator,
				format: DurationFormat.LONG,
				unit: DurationUnit.HOURS,
		  })
		: (getFormattedValue(value, ValueFormat.COUNT) as string);
};

export const getActivityChartTooltipItems = ({
	payload = [],
	labelPrefixPath,
	dotColorPath,
	measureByFilter,
	translator,
}: {
	payload: ReadonlyArray<TooltipPayload>;
	labelPrefixPath: string;
	dotColorPath: string;
	measureByFilter: string;
	translator: Translator;
}) => {
	return payload.reduceRight(
		(
			collectionOfTooltipItems: ActivityChartTooltipItem[],
			payloadItem: any,
		) => {
			const labelPrefix: string = get(payloadItem, labelPrefixPath);
			const dotColor: string = get(payloadItem, dotColorPath);
			const value = payloadItem.value;
			const formattedValue: string = getTooltipFormattedValue(
				value,
				measureByFilter,
				translator,
			);

			const tooltipItem: ActivityChartTooltipItem = {
				key: payloadItem?.dataKey?.split('.')[1],
				name: labelPrefix,
				dotColor,
				label: `${labelPrefix}: ${formattedValue}`,
			};

			collectionOfTooltipItems.push(tooltipItem);

			return collectionOfTooltipItems;
		},
		[],
	);
};

export const getTooltipTitle = ({
	segmentByFilter,
	measureByFilter,
	payload,
	translator,
}: {
	segmentByFilter: string;
	measureByFilter: string;
	payload: ReadonlyArray<TooltipPayload>;
	translator: Translator;
}) => {
	if (!payload || !payload.length) {
		return '';
	}

	const groupName = payload[0].payload.name;
	const objectWithSegmentsAndValues = payload[0].payload[segmentByFilter];
	const groupingTotal = objectWithSegmentsAndValues
		? Object.values(objectWithSegmentsAndValues).reduce(
				(a: number, b: number) => a + b,
		  )
		: 0;

	const formattedTotal: string = getTooltipFormattedValue(
		groupingTotal as number,
		measureByFilter,
		translator,
	);

	return `${groupName}: ${formattedTotal}`;
};
