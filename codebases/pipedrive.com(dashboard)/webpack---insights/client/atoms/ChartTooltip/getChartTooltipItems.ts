import { get } from 'lodash';
import { TooltipPayload } from 'recharts';
import { useTranslator } from '@pipedrive/react-utils';

import { getStaticFieldLabel } from '../../utils/labels';

export interface ChartTooltipItem {
	dotColor: string;
	label: string;
}

export const getChartTooltipItems = (
	payload: ReadonlyArray<TooltipPayload>,
	labelPrefixPath: string,
	dotColorPath: string,
	valueFormatter: (value: number) => string | number,
) => {
	const translator = useTranslator();

	return (payload || []).reduce(
		(collectionOfTooltipItems: ChartTooltipItem[], payloadItem: any) => {
			const labelPrefix: string = get(payloadItem, labelPrefixPath);
			const labelText: string =
				getStaticFieldLabel(translator, labelPrefix) || labelPrefix;
			const dotColor: string = get(payloadItem, dotColorPath);
			const formattedValue: string | number = valueFormatter(
				payloadItem.value,
			);

			const tooltipItem: ChartTooltipItem = {
				dotColor,
				label: `${labelText}: ${formattedValue}`,
			};

			collectionOfTooltipItems.push(tooltipItem);

			return collectionOfTooltipItems;
		},
		[],
	);
};

export default getChartTooltipItems;
