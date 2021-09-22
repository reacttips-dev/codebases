import update from 'immutability-helper';
import { camelCase, get, omit } from 'lodash';
import { types as insightsTypes, periods } from '@pipedrive/insights-core';

import {
	getFields,
	getLogger,
	getPipelines,
	getStages,
	getUsers,
} from '../api/webapp';
import { getFilteredPipelineStages } from './filterUtils';
import { UnsavedReport } from '../types/apollo-local-types';
import { Report, ReportParameters } from '../types/apollo-query-types';
import { ActivityFieldKey, dataKeyTypeMap, NO_SEGMENT } from './constants';
import { splitFieldName } from './helpers';

const ENTITY_VALIDATION_FILTERS = [
	'userId',
	'creatorUserId',
	'user',
	'pipelineId',
	'stageId',
	'dealStageLogStageId',
];

export const omitDeep = (value: any, key: string): any => {
	if (Array.isArray(value)) {
		return value.map((i) => omitDeep(i, key));
	}

	if (typeof value === 'object' && value !== null) {
		return Object.keys(value).reduce((newObject, k) => {
			if (k === key) {
				return newObject;
			}

			return { ...{ [k]: omitDeep(value[k], key) }, ...newObject };
		}, {});
	}

	return value;
};

export const getData = (filter: string): any[] => {
	const filterName = splitFieldName(filter)
		? splitFieldName(filter).field
		: filter;

	if (dataKeyTypeMap.user.includes(filterName)) {
		return getUsers();
	}

	if (dataKeyTypeMap.pipeline.includes(filterName)) {
		return getPipelines();
	}

	if (dataKeyTypeMap.stage.includes(filterName)) {
		return getStages();
	}

	if (dataKeyTypeMap.label.includes(filterName)) {
		return (
			getFields('deal').find((field: any) => field.key === filterName)
				?.options || []
		);
	}

	if (['singleOption', 'multiOption'].includes(filterName)) {
		return (
			getFields('deal').find((field: any) =>
				field.key.startsWith(splitFieldName(filter).hash),
			)?.options || []
		);
	}

	if (
		[ActivityFieldKey.DONE, ActivityFieldKey.BUSY_FLAG].includes(
			filterName as ActivityFieldKey,
		)
	) {
		return (
			getFields('activity').find(
				(field: Pipedrive.ActivityField) =>
					camelCase(field.key) === filter,
			)?.options || []
		);
	}

	return [];
};

export const getValueFromUnsavedOrOriginalReport = (
	report: Report | UnsavedReport,
	key: keyof Report,
) => {
	return get(report, `unsavedReport.${key}`) || report[key];
};

export const validateExistingEntities = (filter: insightsTypes.Filter) => {
	const { defaultValue } = filter.operands[0];

	if (!ENTITY_VALIDATION_FILTERS.includes(filter.filter) || !defaultValue) {
		return filter;
	}

	const filterOptions = getData(filter.filter);

	if (Array.isArray(defaultValue)) {
		filter.operands[0].defaultValue = defaultValue.filter((id) => {
			return filterOptions.filter(
				(entity: { id: number }) => entity.id === id,
			)?.length;
		});
	} else {
		const entityExists = filterOptions.filter(
			(entity: { id: number }) => entity.id === defaultValue,
		)?.length;

		if (!entityExists) {
			filter.operands[0].defaultValue = null;
		}
	}

	return filter;
};

export const prepareFilterBy = (
	filterByFilters: insightsTypes.Filter[],
	saving = false,
) => {
	return filterByFilters.map((filter) => {
		if (
			filter.type === 'date' &&
			filter.period &&
			filter.period !== 'custom'
		) {
			filter.operands = periods.getTimePeriodDates(filter.period, saving);

			return filter;
		}

		const { defaultValue, name } = filter.operands[0];

		if (name === insightsTypes.OperandType.EQ && !defaultValue) {
			const filterOptions = getData(filter.filter) || [];

			filter.operands[0].defaultValue = filterOptions[0]?.id;
		}

		return validateExistingEntities(filter);
	});
};

export const parseReportParameters = (
	parameters: ReportParameters,
	report?: Report,
) => {
	const filters: { [key: string]: any } = {
		group_by: { filter: 'userId', interval: false },
		measure_by: 'sum',
		segment_by: 'stageId',
		filter_by: [] as insightsTypes.Filter[],
		stages: [] as number[],
		is_cumulative: false,
	};

	if (!parameters) {
		getLogger().remote(
			'error',
			`Could not parse parameters for report: ${JSON.stringify(report)}`,
		);
	}

	Object.keys(parameters).forEach((key: keyof ReportParameters) => {
		const value = parameters[key];

		if (value) {
			try {
				const filterValue = JSON.parse(value);

				if (key === 'filter_by') {
					filters[key] = prepareFilterBy(filterValue);
				}

				filters[key] = filterValue;
			} catch (error) {
				filters[key] = value;
			}
		}
	});

	return filters;
};

export const parseReportParametersForDashboardView = (report: Report) => {
	if (!report) {
		return false;
	}

	const { parameters } = report;
	const filters = parseReportParameters(parameters);

	return update(report as unknown as UnsavedReport<any>, {
		parameters: {
			$set: filters as any,
		},
	});
};

export const parseReportParametersForReportView = (report: Report) => {
	if (!report) {
		return false;
	}

	const { parameters } = report;
	const filters = parseReportParameters(parameters, report);

	const reportType = getValueFromUnsavedOrOriginalReport(
		report,
		'report_type',
	);

	if (reportType === insightsTypes.ReportType.DEALS_FUNNEL_CONVERSION) {
		filters.group_by = { filter: null, interval: false };

		if (filters.stages.length === 0) {
			const pipelineStages = getFilteredPipelineStages(filters.filter_by);

			filters.stages = pipelineStages.map((stage) => stage.id);
		}
	}

	return update(report, {
		unsavedReport: {
			parameters: {
				$set: filters as any,
			},
		},
	});
};

export const mergeReportWithUnsavedReport = (report: UnsavedReport) => {
	const chartType = getValueFromUnsavedOrOriginalReport(report, 'chart_type');
	const unsavedParameters = report.unsavedReport.parameters;
	const reportType = getValueFromUnsavedOrOriginalReport(
		report,
		'report_type',
	);
	const name = getValueFromUnsavedOrOriginalReport(report, 'name');
	const segmentBy =
		chartType === insightsTypes.ChartType.PIE &&
		unsavedParameters.segment_by === NO_SEGMENT
			? 'status'
			: unsavedParameters.segment_by;

	return update(report, {
		parameters: {
			$set: {
				...unsavedParameters,
				segment_by: segmentBy,
			},
		},
		chart_type: {
			$set: chartType,
		},
		report_type: {
			$set: reportType,
		},
		name: {
			$set: name,
		},
	});
};

const prepareReportParameters = (
	reportParameters: ReportParameters,
	key: keyof ReportParameters,
): ReportParameters => {
	let correctParameters = { ...reportParameters };

	if (correctParameters[key] === null) {
		correctParameters = omit(correctParameters, key) as ReportParameters;
	}

	if (key !== 'is_cumulative' && typeof correctParameters[key] === 'object') {
		correctParameters[key] = JSON.stringify(correctParameters[key]);
	}

	if (key === 'filter_by') {
		try {
			const filterByFilters = JSON.parse(correctParameters[key]);

			if (correctParameters[key] && Array.isArray(filterByFilters)) {
				correctParameters[key] = JSON.stringify(
					prepareFilterBy(filterByFilters, true),
				);
			}
		} catch (error) {
			// No filters
		}
	}

	return correctParameters;
};

export const prepareReportObject = (
	report: UnsavedReport<ReportParameters>,
): Report<ReportParameters> => {
	const {
		segment_set,
		data,
		unsavedReport,
		is_editing,
		shared_with,
		...partialReport
	} = report;
	let reportToSave = omitDeep(partialReport, '__typename');

	for (const key in reportToSave) {
		if (reportToSave[key] === null) {
			reportToSave = omit(reportToSave, key);
		}
	}

	if (reportToSave.hasOwnProperty('parameters')) {
		const {
			measure_by: measureBy,
			segment_by: segmentBy,
			group_by: groupBy,
		} = reportToSave.parameters;

		if (measureBy || segmentBy || groupBy) {
			reportToSave.parameters.stats = JSON.stringify(
				[measureBy, segmentBy, groupBy ? groupBy.filter : false].filter(
					(value) => value,
				),
			);
		}

		Object.keys(reportToSave.parameters).forEach(
			(key: keyof ReportParameters) =>
				(reportToSave.parameters = prepareReportParameters(
					reportToSave.parameters,
					key,
				)),
		);
	}

	return reportToSave;
};
