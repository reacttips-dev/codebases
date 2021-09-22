import { types as insightsTypes } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';

import { GroupByField } from '../../../types/apollo-query-types';
import { TranslatedField } from '../../../types/report-options';
import getDealsGroupByOptions from './getDealsGroupByOptions';
import { mapOptions } from '../../../utils/helpers';

const getGroupByOptions = ({
	reportDataType,
	reportType,
	groupByFields,
	fields,
	translator,
}: {
	reportDataType: insightsTypes.DataType;
	reportType: insightsTypes.ReportType;
	groupByFields: GroupByField[];
	fields: TranslatedField[];
	translator: Translator;
}) => {
	if (reportDataType === insightsTypes.DataType.DEALS) {
		return getDealsGroupByOptions({
			reportType,
			groupByFields,
			fields,
			translator,
		});
	}

	return mapOptions(groupByFields, fields);
};

export default getGroupByOptions;
