import { types as insightsTypes } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';

import { TranslatedField } from '../../../types/report-options';
import { GroupByField } from '../../../types/apollo-query-types';
import getDealsSegmentByOptions from './getDealsSegmentByOptions';
import { mapOptions } from '../../../utils/helpers';

const BLACKLISTED_SEGMENT_BY_FIELD_TYPES = ['date'];

const getSegmentByOptions = ({
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
		return getDealsSegmentByOptions({
			reportType,
			groupByFields,
			fields,
			translator,
		});
	}

	const mappedOptions = mapOptions(groupByFields, fields);

	return mappedOptions.filter(
		(option) =>
			!BLACKLISTED_SEGMENT_BY_FIELD_TYPES.includes(option.fieldType),
	);
};

export default getSegmentByOptions;
