import { Translator } from '@pipedrive/react-utils';
import { helpers } from '@pipedrive/insights-core';

import { numberFormatter } from '../../../utils/numberFormatter';

export const getValueTextForTooltip = ({
	value,
	measureByFilter,
	measureByCustomName,
	includeCustomFieldName,
	translator,
}: {
	value: number;
	measureByFilter: string;
	measureByCustomName?: string;
	includeCustomFieldName?: boolean;
	translator: Translator;
}) => {
	const isMonetary = helpers.deals.isMeasureByMonetary(measureByFilter);
	const formattedValue = numberFormatter.format({
		value,
		isMonetary,
	});

	if (measureByCustomName) {
		return includeCustomFieldName
			? `${formattedValue} (${measureByCustomName})`
			: formattedValue;
	}

	if (isMonetary) {
		return formattedValue;
	}

	return translator.ngettext('%s deal', '%s deals', value, formattedValue);
};

export const updatePaginationLinePosition = ({
	isYAxis,
	hasNextPage,
	dataLength,
	axisWidth,
	truncatedConversionShapeWidth,
	paginationLineRightPosition,
	setPaginationLineRightPosition,
}: {
	isYAxis: boolean;
	hasNextPage: boolean;
	dataLength: number;
	axisWidth: number;
	truncatedConversionShapeWidth: number;
	paginationLineRightPosition: number;
	setPaginationLineRightPosition: (paginationLinePosition: number) => void;
}) => {
	const paginationLinePosition =
		axisWidth / dataLength - truncatedConversionShapeWidth;
	const shouldUpdatePaginationLinePosition =
		!isYAxis &&
		hasNextPage &&
		paginationLineRightPosition !== paginationLinePosition;

	if (shouldUpdatePaginationLinePosition) {
		setPaginationLineRightPosition(paginationLinePosition);
	}
};
