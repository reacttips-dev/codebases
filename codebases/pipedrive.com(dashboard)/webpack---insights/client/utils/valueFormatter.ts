import { floor } from 'lodash';
import { helpers, types as insightsTypes } from '@pipedrive/insights-core';

import { numberFormatter } from './numberFormatter';
import {
	FunnelConversionSummaryTableField,
	funnelConversionPercentageColumns,
} from './queries/dataMappingConstants';
import { summaryColumnTypes } from '../utils/constants';
import { COUNT_TYPE_MEASURE_BY } from './constants';

export enum ValueFormat {
	PERCENTAGE = 'percentage',
	MONETARY = 'monetary',
	COUNT = 'count',
	DURATION = 'duration',
}

const formatAsPercentage = (value: number) => {
	const roundedValue = floor(value, 2);

	return `${Math.abs(roundedValue)}%`;
};

export const getFormattedValue = (
	value: number,
	format: ValueFormat,
): string | number => {
	if (isNaN(value)) {
		return null;
	}

	switch (format) {
		case ValueFormat.PERCENTAGE:
			return formatAsPercentage(value);
		case ValueFormat.MONETARY:
			return numberFormatter.format({ value });
		case ValueFormat.COUNT:
			return numberFormatter.format({
				value: floor(value, 2),
				isMonetary: false,
			});
		default:
			return value;
	}
};

export const getValueFormatBasedOnMeasureBy = (measureBy: string) => {
	const isMeasureByNumeric =
		COUNT_TYPE_MEASURE_BY.includes(measureBy) ||
		helpers.deals.isMeasureByNumerical(measureBy);

	if (isMeasureByNumeric) {
		return ValueFormat.COUNT;
	}

	if (measureBy === ValueFormat.DURATION) {
		return ValueFormat.DURATION;
	}

	return isMeasureByNumeric ? ValueFormat.COUNT : ValueFormat.MONETARY;
};

export const getSummaryTableCellFormat = ({
	reportType,
	headerId,
	measureByFilter,
}: {
	reportType: insightsTypes.ReportType;
	headerId: string | FunnelConversionSummaryTableField;
	measureByFilter: string;
}) => {
	const isMeasureByMonetary =
		helpers.deals.isMeasureByMonetary(measureByFilter);
	const isMeasureByFilterCustomField =
		helpers.deals.isCustomField(measureByFilter);

	if (headerId === summaryColumnTypes.AVG) {
		return isMeasureByMonetary || !isMeasureByFilterCustomField
			? ValueFormat.MONETARY
			: ValueFormat.COUNT;
	}

	const isOverallConversionPercentageColumn =
		reportType === insightsTypes.ReportType.DEALS_CONVERSION_OVERALL &&
		(headerId === 'won' || headerId === 'lost');
	const isFunnelConversionPercentageColumn =
		reportType === insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION &&
		funnelConversionPercentageColumns.includes(
			headerId as FunnelConversionSummaryTableField,
		);

	if (
		isOverallConversionPercentageColumn ||
		isFunnelConversionPercentageColumn
	) {
		return ValueFormat.PERCENTAGE;
	}

	const valueFormat = getValueFormatBasedOnMeasureBy(measureByFilter);

	if (valueFormat === ValueFormat.DURATION) {
		return valueFormat;
	}

	if (measureByFilter === insightsTypes.Deals.MeasureByType.PRODUCTS_AMOUNT) {
		return ValueFormat.COUNT;
	}

	if (headerId === summaryColumnTypes.SUM) {
		return ValueFormat.MONETARY;
	}

	if (headerId === summaryColumnTypes.COUNT) {
		return ValueFormat.COUNT;
	}

	return valueFormat;
};
