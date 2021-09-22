import { clone } from 'lodash';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';

import {
	mapOptions,
	filterOptionsBasedOnWhitelist,
	filterOptionsBasedOnBlacklist,
} from '../../../utils/helpers';
import {
	DEAL_STAGE_LOG_STAGE_ID,
	OPTION_TYPE_BLACK_LIST,
	PAYMENTS_BLACK_LIST,
} from '../../../utils/constants';
import { TranslatedField } from '../../../types/report-options';
import { GroupByField } from '../../../types/apollo-query-types';
import { getGroupableFields } from '../../../utils/filterUtils';

const PAYMENTS_SEGMENT_BY_WHITELIST = ['paymentsPaymentType'];
const PROGRESS_SEGMENT_BY_BLACKLIST = [
	DEAL_STAGE_LOG_STAGE_ID,
	'paymentsType',
	'paymentsPaymentType',
];
const STATS_SEGMENT_BY_BLACKLIST = [DEAL_STAGE_LOG_STAGE_ID];

const getDealsSegmentByOptions = ({
	reportType,
	groupByFields,
	fields,
	translator,
}: {
	reportType: insightsTypes.ReportType;
	groupByFields: GroupByField[];
	fields: TranslatedField[];
	translator: Translator;
}) => {
	const segmentByOptions = mapOptions(
		getGroupableFields(groupByFields, fields),
		fields,
		OPTION_TYPE_BLACK_LIST.SEGMENT_BY,
	);

	if (reportType === insightsTypes.ReportType.DEALS_RECURRING_REVENUE) {
		return filterOptionsBasedOnWhitelist(
			segmentByOptions,
			PAYMENTS_SEGMENT_BY_WHITELIST,
		);
	}

	if (reportType === insightsTypes.ReportType.DEALS_PROGRESS) {
		const progressOptions = clone(segmentByOptions);

		// TODO: BE needs to change query logic from stageId to dealStageLogStageId
		// Once this is done then we can add stageId to PROGRESS_GROUP_BY_BLACK_LIST
		// and delete this label overwriting
		const stageIdIndex = progressOptions.findIndex(
			(option: any) => option.name === 'stageId',
		);

		if (stageIdIndex > -1) {
			progressOptions[stageIdIndex].label =
				translator.gettext('Stage entered');
		}

		return filterOptionsBasedOnBlacklist(
			segmentByOptions,
			PROGRESS_SEGMENT_BY_BLACKLIST,
		);
	}

	if (reportType === insightsTypes.ReportType.DEALS_STATS) {
		return filterOptionsBasedOnBlacklist(segmentByOptions, [
			...STATS_SEGMENT_BY_BLACKLIST,
			...PAYMENTS_BLACK_LIST,
		]);
	}

	return filterOptionsBasedOnBlacklist(segmentByOptions, PAYMENTS_BLACK_LIST);
};

export default getDealsSegmentByOptions;
