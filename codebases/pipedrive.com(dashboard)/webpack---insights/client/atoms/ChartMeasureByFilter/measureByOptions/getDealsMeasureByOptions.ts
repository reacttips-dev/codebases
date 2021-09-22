import { types as insightsTypes, helpers } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';

import {
	getMeasureByLabel,
	getCustomFieldFields,
} from '../../../utils/filterUtils';
import { mapOptions, sortArrayByProperty } from '../../../utils/helpers';
import { OPTION_TYPE_BLACK_LIST } from '../../../utils/constants';
import { isCustomFieldsIndicesFlagEnabled } from '../../../api/webapp';
import { TranslatedField } from '../../../types/report-options';
import { MeasureByField } from '../../../types/apollo-query-types';

const REPORT_TYPES_WITH_AVG_DEAL_VALUE_OPTION = [
	insightsTypes.ReportType.DEALS_STATS,
];

const getAdditionalOptions = ({
	fields,
	chartType,
	reportType,
	translator,
}: {
	fields: any[];
	chartType: insightsTypes.ChartType;
	reportType: insightsTypes.ReportType;
	translator: Translator;
}) => {
	const isScorecardChart = chartType === insightsTypes.ChartType.SCORECARD;
	const shouldAddAvgDealValueOption =
		isScorecardChart &&
		REPORT_TYPES_WITH_AVG_DEAL_VALUE_OPTION.includes(reportType);

	const avgDealValueOption = {
		name: insightsTypes.Deals.MeasureByType.AVERAGE_VALUE,
		fieldType: 'avg',
		label: getMeasureByLabel(
			insightsTypes.Deals.MeasureByType.AVERAGE_VALUE,
			fields,
			translator,
		),
	};

	return [
		{
			name: insightsTypes.Deals.MeasureByType.COUNT,
			fieldType: 'count',
			label: getMeasureByLabel(
				insightsTypes.Deals.MeasureByType.COUNT,
				fields,
				translator,
			),
		},
		...(shouldAddAvgDealValueOption ? [avgDealValueOption] : []),
	];
};

const getFilteredMeasureByOptions = (
	options: MeasureByField[],
	reportType: insightsTypes.ReportType,
	blackList: string[],
): MeasureByField[] => {
	const extendedBlackList = [...blackList];

	if (reportType !== insightsTypes.ReportType.DEALS_STATS) {
		extendedBlackList.push(
			insightsTypes.Deals.MeasureByType.PRODUCTS_AMOUNT,
			insightsTypes.Deals.MeasureByType.PRODUCTS_SUM,
		);
	}

	const whiteListOptions = options.filter(
		(option) => !extendedBlackList.includes(option.name),
	);

	if (reportType === insightsTypes.ReportType.DEALS_REVENUE_FORECAST) {
		return whiteListOptions.filter((option) =>
			helpers.deals.isMeasureByMonetary(option.name),
		);
	}

	return whiteListOptions;
};

export const addCustomFieldsToOptionsIfNecessary = (
	options: MeasureByField[],
	fields: TranslatedField[],
) => {
	const measureByOptions = [...options];

	// If insights_custom_indices flag is not enabled then there is a special case
	// where backend still sends those custom fields into fields.fields array
	// and frontend has to map them into filters
	if (!isCustomFieldsIndicesFlagEnabled()) {
		measureByOptions.push(...getCustomFieldFields(fields, 'isMeasurable'));
	}

	return measureByOptions;
};

const getDealsMeasureByOptions = ({
	options,
	fields,
	chartType,
	reportType,
	translator,
}: {
	options: MeasureByField[];
	fields: TranslatedField[];
	chartType: insightsTypes.ChartType;
	reportType: insightsTypes.ReportType;
	translator: Translator;
}) => {
	const blackList = OPTION_TYPE_BLACK_LIST.MEASURE_BY;
	const additionalAlreadyMappedOptions = getAdditionalOptions({
		fields,
		chartType,
		reportType,
		translator,
	});
	const measureByOptionsToBeMapped = addCustomFieldsToOptionsIfNecessary(
		options,
		fields,
	);

	const mappedMeasureByOptions = [
		...mapOptions(measureByOptionsToBeMapped, fields, blackList),
		...additionalAlreadyMappedOptions,
	];

	const mappedAndSortedOptions = mappedMeasureByOptions
		.map((option: MeasureByField) => {
			if (option.name === 'value') {
				return {
					...option,
					name: insightsTypes.Deals.MeasureByType.VALUE,
					label: getMeasureByLabel(option.name, fields, translator),
				};
			}

			if (option.name === 'weightedValue') {
				return {
					...option,
					label: getMeasureByLabel(option.name, fields, translator),
				};
			}

			return { ...option };
		})
		.sort(sortArrayByProperty('label'));

	return getFilteredMeasureByOptions(
		mappedAndSortedOptions,
		reportType,
		blackList,
	);
};

export default getDealsMeasureByOptions;
