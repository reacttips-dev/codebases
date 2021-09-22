import { types as insightsTypes } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';
import { clone } from 'lodash';

import {
	OPTION_TYPE_BLACK_LIST,
	PAYMENTS_BLACK_LIST,
	DEAL_PRODUCTS_PRODUCT_ID,
} from '../../../utils/constants';
import {
	mapOptions,
	filterOptionsBasedOnWhitelist,
	filterOptionsBasedOnBlacklist,
} from '../../../utils/helpers';
import { getGroupableFields } from '../../../utils/filterUtils';
import { GroupByField } from '../../../types/apollo-query-types';
import { TranslatedField } from '../../../types/report-options';

const PAYMENTS_GROUP_BY_WHITELIST = ['paymentsDueAt'];

const OVERALL_CONVERSION_GROUP_BY_BLACK_LIST = [
	'wonTime',
	'lostTime',
	'lostReason',
	'status',
	'lastActivityDate',
	'lastIncomingEmailTime',
	'lastOutgoingEmailTime',
	'stageChangeTime',
	'nextActivityDate',
	'expectedCloseDate',
	'updateTime',
	'dealStageLogStageId',
	DEAL_PRODUCTS_PRODUCT_ID,
];
const PROGRESS_GROUP_BY_BLACK_LIST = [
	'wonTime',
	'lostTime',
	'lastActivityDate',
	'lastIncomingEmailTime',
	'lastOutgoingEmailTime',
	'stageChangeTime',
	'nextActivityDate',
	'updateTime',
	'dealStageLogStageId',
	DEAL_PRODUCTS_PRODUCT_ID,
];
const DURATION_GROUP_BY_BLACK_LIST = [
	'stageId',
	'expectedCloseDate',
	'lastActivityDate',
	'lastIncomingEmailTime',
	'lastOutgoingEmailTime',
	'stageChangeTime',
	'nextActivityDate',
	'updateTime',
	DEAL_PRODUCTS_PRODUCT_ID,
];
const STATS_GROUP_BY_BLACK_LIST = ['dealStageLogStageId', 'stageChangeTime'];

const getOptionsBlacklist = (reportType: string) => {
	const blacklist = [...PAYMENTS_BLACK_LIST, 'expectedCloseDateOrWonTime'];

	if (reportType === insightsTypes.ReportType.DEALS_CONVERSION_OVERALL) {
		blacklist.push(...OVERALL_CONVERSION_GROUP_BY_BLACK_LIST);
	}

	if (reportType === insightsTypes.ReportType.DEALS_DURATION) {
		blacklist.push(...DURATION_GROUP_BY_BLACK_LIST);
	}

	if (reportType === insightsTypes.ReportType.DEALS_PROGRESS) {
		blacklist.push(...PROGRESS_GROUP_BY_BLACK_LIST);
	}

	if (reportType === insightsTypes.ReportType.DEALS_STATS) {
		blacklist.push(...STATS_GROUP_BY_BLACK_LIST);
	}

	return blacklist;
};

const addGroupByChanges = (
	options: any[],
	reportType: insightsTypes.ReportType,
	translator: Translator,
) => {
	if ([insightsTypes.ReportType.DEALS_PROGRESS].includes(reportType)) {
		const progressOptions = clone(options);

		// TODO: BE needs to change query logic from stageId to dealStageLogStageId
		// Once this is done then we can add stageId to PROGRESS_GROUP_BY_BLACK_LIST
		// and delete this label overwriting
		// also see useListView.ts
		const stageIdIndex = progressOptions.findIndex(
			(option) => option.name === 'stageId',
		);

		if (stageIdIndex > -1) {
			progressOptions[stageIdIndex].label =
				translator.gettext('Stage entered');
		}

		progressOptions.push({
			name: 'dealStageLogAddTime',
			__typename: '__Field',
			fieldType: 'date',
			label: translator.gettext('Date of entering stage'),
			isCustomField: false,
			isOptionWithIntervals: true,
		});

		return progressOptions;
	}

	return options;
};

const getDealsGroupByOptions = ({
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
	const allGroupByOptions = mapOptions(
		getGroupableFields(groupByFields, fields),
		fields,
		OPTION_TYPE_BLACK_LIST.GROUP_BY,
	);

	const alteredGroupByOptions = addGroupByChanges(
		allGroupByOptions,
		reportType,
		translator,
	);

	const shouldFilterBasedOnWhitelist =
		reportType ===
		insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT;

	if (shouldFilterBasedOnWhitelist) {
		return filterOptionsBasedOnWhitelist(
			alteredGroupByOptions,
			PAYMENTS_GROUP_BY_WHITELIST,
		);
	}

	return filterOptionsBasedOnBlacklist(
		alteredGroupByOptions,
		getOptionsBlacklist(reportType),
	);
};

export default getDealsGroupByOptions;
