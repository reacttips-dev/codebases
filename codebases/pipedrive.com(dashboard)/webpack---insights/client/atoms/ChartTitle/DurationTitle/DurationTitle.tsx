import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';

import { DurationChartSummaryDataObject } from '../../../types/data-layer';
import ChartTitle from '../ChartTitle';
import {
	getDurationInDays,
	extractSummaryData,
} from '../../../utils/duration/durationUtils';

interface DurationTitleProps {
	chartSummaryData: DurationChartSummaryDataObject;
	isInWidget: boolean;
}

const DurationTitle = ({
	chartSummaryData,
	isInWidget = false,
}: DurationTitleProps) => {
	const translator = useTranslator();
	const { count, duration } = extractSummaryData(chartSummaryData);

	if (!duration) {
		return null;
	}

	const durationInDays = getDurationInDays(duration);
	const title = translator.ngettext(
		'Average sales cycle is %d day',
		'Average sales cycle is %d days',
		durationInDays,
		durationInDays,
	);

	const getInlineinfoContent = (): string => {
		if (!count) {
			return null;
		}

		return translator.pgettext(
			'Total time in stages divided by number of deals ([number])',
			'Total time in stages divided by number of deals (%s)',
			count,
		);
	};

	return (
		<ChartTitle
			title={title}
			{...(isInWidget
				? {}
				: { inlineInfoContent: getInlineinfoContent() })}
			isInWidget={isInWidget}
		/>
	);
};

export default DurationTitle;
