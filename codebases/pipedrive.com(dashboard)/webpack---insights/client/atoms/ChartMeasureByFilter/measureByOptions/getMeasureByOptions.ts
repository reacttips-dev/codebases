import { types as insightsTypes } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';

import getActivitiesMeasureByOptions from './getActivitiesMeasureByOptions';
import getDealsMeasureByOptions from './getDealsMeasureByOptions';
import getMailsMeasureByOptions from './getMailsMeasureByOptions';
import { TranslatedField } from '../../../types/report-options';
import { MeasureByField } from '../../../types/apollo-query-types';

const getMeasureByOptions = ({
	reportDataType,
	options,
	fields,
	chartType,
	reportType,
	translator,
}: {
	reportDataType: insightsTypes.DataType;
	options: MeasureByField[];
	fields: TranslatedField[];
	chartType: insightsTypes.ChartType;
	reportType: insightsTypes.ReportType;
	translator: Translator;
}) => {
	if (reportDataType === insightsTypes.DataType.ACTIVITIES) {
		return getActivitiesMeasureByOptions(options, fields, translator);
	}

	if (reportDataType === insightsTypes.DataType.MAILS) {
		return getMailsMeasureByOptions(translator);
	}

	if (reportDataType === insightsTypes.DataType.DEALS) {
		return getDealsMeasureByOptions({
			options,
			fields,
			chartType,
			reportType,
			translator,
		});
	}

	return [];
};

export default getMeasureByOptions;
