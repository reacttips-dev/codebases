import { snakeCase } from 'lodash';
import {
	types as insightsTypes,
	constants,
	helpers,
	types,
} from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';
import { Filter } from '@pipedrive/insights-core/lib/types';

import {
	FilterType,
	PROGRESS_DEFAULT_GROUPING,
	ActivityFieldKey,
	MailType,
	MailOpenedTrackingStatus,
	MailLinkClickedTrackingStatus,
} from './constants';
import { GroupByField } from '../types/apollo-query-types';
import { TranslatedField } from '../types/report-options';
import { MultiSelectFilterOption } from '../types/chart';
import {
	getLogger,
	isCustomFieldsIndicesFlagEnabled,
	areTeamsEnabled,
	getPipelinesStages,
} from '../api/webapp';
import { sortArrayByProperty } from './helpers';

export const isDateType = (filter: any) => {
	const type = filter.type || filter.fieldType;

	return [FilterType.DATE, FilterType.DATETIME].includes(type);
};

export const getMainFilters = (filtersList: any) => {
	return filtersList.filter(
		(filter: any) => !filter.isCustomField && !isDateType(filter),
	);
};

export const getDateFilters = (filtersList: any) => {
	return filtersList.filter(
		(filter: any) => !filter.isCustomField && isDateType(filter),
	);
};

export const getCustomFieldsFilters = (filtersList: any) => {
	return filtersList.filter((filter: any) => filter.isCustomField);
};

export const sortFilters = (filtersList: any[]) => {
	const customFilters = getCustomFieldsFilters(filtersList);
	const mainFilters = getMainFilters(filtersList);
	const dateFilters = getDateFilters(filtersList);
	const sortByProperty = 'name';

	return [
		...customFilters.sort(sortArrayByProperty(sortByProperty)),
		...mainFilters.sort(sortArrayByProperty(sortByProperty)),
		...dateFilters.sort(sortArrayByProperty(sortByProperty)),
	];
};

export const getCustomFieldName = (fields: any[], filter: string) => {
	const customFields = fields.filter((field: any) => field.isCustomField);
	const customField = customFields.find(
		(field: any) => field.uiName === filter,
	);

	return customField && customField.originalName;
};

export const getFilteredObjectId = (reportFilters: any, filterType: string) => {
	const filterOfType = reportFilters.find(
		(filter: any) => filter.type === filterType,
	);

	return filterOfType && filterOfType.operands[0].defaultValue;
};

export const getPipelineStagesById = (pipelineId: number) => {
	const stages = getPipelinesStages();

	const pipelineStages = stages.filter(
		(stage: any) => stage.pipeline_id === pipelineId,
	);

	return pipelineStages.map((stage: any) => {
		return {
			name: stage.name,
			label: stage.name,
			id: stage.id,
		};
	}) as MultiSelectFilterOption[];
};

export const getFilteredPipelineStages = (filters: any) => {
	const filteredPipelineId = getFilteredObjectId(
		filters,
		FilterType.PIPELINE,
	);

	return getPipelineStagesById(filteredPipelineId);
};

export const getCustomFieldFields = (fields: any[], filterType: string) => {
	return fields
		.filter((field: any) => field.isCustomField && !!field[filterType])
		.map((field: any) => {
			let props = {};

			if (filterType === 'filterType') {
				props = {
					description: field.dbName,
					args: [],
				};
			}

			return {
				name: field.uiName,
				...props,
			};
		});
};

export const addCustomFieldsToFieldsArray = (
	fields: any,
	newArray: any,
	filterType: string,
) => {
	const customFieldsFromFieldsArray = getCustomFieldFields(
		fields,
		filterType,
	);

	return [...newArray, ...customFieldsFromFieldsArray];
};

export const getFilterWithLabel = (
	filter: string,
	dataType: insightsTypes.DataType,
) => {
	const filterType = helpers.deals.getFieldType(filter).type;
	const fieldsRequiringLabels = constants[dataType]?.FIELDS_WITH_LABELS || [];

	return fieldsRequiringLabels.includes(filterType)
		? `${filter}Label`
		: filter;
};

export const getGroupableFields = (
	groupByFields: GroupByField[],
	fields: TranslatedField[],
) => {
	let groupableFields = [...groupByFields];

	// If insights_custom_indices flag is not enabled then there is a special case
	// where backend still sends those custom fields into fields.fields array
	// and frontend has to map them into filters
	if (!isCustomFieldsIndicesFlagEnabled()) {
		groupableFields = addCustomFieldsToFieldsArray(
			fields,
			groupableFields,
			'groupByType',
		);
	}

	if (areTeamsEnabled()) {
		return groupableFields;
	}

	return groupableFields.filter((field: any) => field.name !== 'teamId');
};

export const getMeasureByLabel = (
	measureByFilter: string,
	fields: any[],
	translator: Translator,
) => {
	if (helpers.deals.isCustomField(measureByFilter)) {
		return getCustomFieldName(fields, measureByFilter);
	}

	switch (measureByFilter) {
		case insightsTypes.Deals.MeasureByType.VALUE:
		case 'value':
			return translator.gettext('Deal value');
		case insightsTypes.Deals.MeasureByType.WEIGHTED_VALUE:
			return translator.gettext('Deal weighted value');
		case insightsTypes.Deals.MeasureByType.COUNT:
			return translator.gettext('Number of deals');
		case insightsTypes.Deals.MeasureByType.PRODUCTS_AMOUNT:
			return translator.gettext('Number of products');
		case insightsTypes.Deals.MeasureByType.PRODUCTS_SUM:
			return translator.gettext('Product value');
		case insightsTypes.Deals.MeasureByType.AVERAGE_VALUE:
			return translator.gettext('Average deal value');
		default:
			getLogger().remote(
				'error',
				`Could not get label for measureBy: ${measureByFilter}`,
			);

			return measureByFilter;
	}
};

export const getActivitiesMeasureByLabel = (
	measureByFilter: string,
	translator: Translator,
): string => {
	if (measureByFilter === types.Activities.MesaureByField.DURATION) {
		return translator.gettext('Duration');
	}

	if (measureByFilter === types.Activities.MesaureByField.COUNT) {
		return translator.gettext('Number of activities');
	}

	throw Error(`Could not get label for measureBy filter ${measureByFilter}`);
};

export const getMailsMeasureByLabel = (
	measureByFilter: string,
	translator: Translator,
): string => {
	if (measureByFilter === types.Mails.MesaureByField.COUNT) {
		return translator.gettext('Number of emails');
	}

	throw Error(`Could not get label for measureBy filter ${measureByFilter}`);
};

export const getMailTypeLabel = (
	mailType: MailType,
	translator: Translator,
) => {
	switch (mailType) {
		case MailType.SENT:
			return translator.gettext('Sent');
		case MailType.RECEIVED:
			return translator.gettext('Received');
		default:
			return mailType;
	}
};

export const getMailOpenedTrackingStatusLabel = (
	mailOpenedTrackingStatus: MailOpenedTrackingStatus,
	translator: Translator,
) => {
	switch (mailOpenedTrackingStatus) {
		case MailOpenedTrackingStatus.OPENED:
			return translator.gettext('Opened');
		case MailOpenedTrackingStatus.NOT_OPENED:
			return translator.gettext('Not opened');
		case MailOpenedTrackingStatus.NOT_TRACKED:
			return translator.gettext('Not tracked');
		default:
			return mailOpenedTrackingStatus;
	}
};

export const getMailLinkTrackingStatusLabel = (
	mailLinkClickedTrackingStatus: MailLinkClickedTrackingStatus,
	translator: Translator,
) => {
	switch (mailLinkClickedTrackingStatus) {
		case MailLinkClickedTrackingStatus.CLICKED:
			return translator.gettext('Clicked');
		case MailLinkClickedTrackingStatus.NOT_CLICKED:
			return translator.gettext('Not clicked');
		case MailLinkClickedTrackingStatus.NOT_TRACKED:
			return translator.gettext('Not tracked');
		default:
			return mailLinkClickedTrackingStatus;
	}
};

export const getMultiSelectFilterType = (
	chartType: insightsTypes.ChartType,
) => {
	return chartType === insightsTypes.ChartType.FUNNEL && 'stageId';
};

export const getPrimaryAndSecondaryChartFilter = ({
	groupByFilter,
	segmentByFilter,
	chartType,
	reportType,
	dataType,
}: {
	groupByFilter?: string;
	segmentByFilter?: string;
	chartType: insightsTypes.ChartType;
	reportType: insightsTypes.ReportType;
	dataType: insightsTypes.DataType;
}) => {
	const isProgress = reportType === insightsTypes.ReportType.DEALS_PROGRESS;

	if (isProgress) {
		const isDefaultGrouping = groupByFilter === PROGRESS_DEFAULT_GROUPING;

		return {
			primaryFilter: groupByFilter,
			primaryFilterLabel: getFilterWithLabel(groupByFilter, dataType),
			secondaryFilter: isDefaultGrouping
				? segmentByFilter
				: PROGRESS_DEFAULT_GROUPING,
			secondaryFilterLabel: isDefaultGrouping
				? getFilterWithLabel(segmentByFilter, dataType)
				: PROGRESS_DEFAULT_GROUPING,
		};
	}

	switch (chartType) {
		case insightsTypes.ChartType.PIE:
			return {
				primaryFilter: segmentByFilter,
				primaryFilterLabel: getFilterWithLabel(
					segmentByFilter,
					dataType,
				),
			};
		case insightsTypes.ChartType.FUNNEL:
			const multiSelectFilterType = getMultiSelectFilterType(chartType);

			return {
				primaryFilter: multiSelectFilterType,
				primaryFilterLabel: multiSelectFilterType,
			};
		default:
			return {
				primaryFilter: groupByFilter,
				primaryFilterLabel: getFilterWithLabel(groupByFilter, dataType),
				secondaryFilter: segmentByFilter,
				secondaryFilterLabel: getFilterWithLabel(
					segmentByFilter,
					dataType,
				),
			};
	}
};

export const getMultiSelectFilterValue = (
	filters: Filter[],
	chartType: insightsTypes.ChartType,
	selectedStages?: number[],
): number[] => {
	if (chartType === insightsTypes.ChartType.FUNNEL) {
		const correctlyOrderedPipelineStages =
			getFilteredPipelineStages(filters);
		const orderedStageIds = correctlyOrderedPipelineStages.map(
			(option) => option.id,
		);

		if (!selectedStages || selectedStages.length === 0) {
			return orderedStageIds;
		}

		return orderedStageIds.filter((id) => selectedStages?.includes(id));
	}

	return [];
};

export const getActivityField = (
	filterKey: ActivityFieldKey,
	activityFields: Pipedrive.ActivityField[],
) => {
	return activityFields.find((field) => field.key === snakeCase(filterKey));
};

export const getCumulativeFilterOptions = (translator: Translator) => {
	return [
		{
			label: translator.gettext('Cumulative forecast'),
			name: true,
		},
		{
			label: translator.gettext('Forecast'),
			name: false,
		},
	];
};
