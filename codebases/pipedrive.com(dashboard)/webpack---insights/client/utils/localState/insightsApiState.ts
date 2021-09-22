import { ApolloClient } from '@apollo/client';
import { cloneDeep, mergeWith } from 'lodash';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';

import {
	ReportSettingsType,
	ReportSettingsSubtype,
	Report,
} from '../../types/apollo-query-types';
import {
	DataTypeBasedReportOptions,
	ReportId,
} from '../../types/report-options';
import { DEFAULT_UNSAVED_REPORT } from '../constants';
import { GET_REPORT_SELECT_OPTIONS } from '../../api/graphql';
import { getReportById, mergeFormatter } from '../helpers';
import {
	parseReportParametersForReportView,
	prepareFilterBy,
} from '../reportObjectHelpers';
import { getCurrentReportParentType } from '../reportTypeUtils';
import { getTableById } from '../tableUtils';
import settingsApiState, { getSelectedItemId } from './settingsApiState';
import getDealFieldsWithTranslatedName from './reportOptions/fields/getDealFieldsWithTranslatedName';
import getActivityFieldsWithTranslatedName from './reportOptions/fields/getActivityFieldsWithTranslatedName';
import getMailFieldsWithTranslatedName from './reportOptions/fields/getMailFieldsWithTranslatedName';
import getDealsFiltersWithLabels from './reportOptions/filters/getDealsFiltersWithLabels';
import getActivitiesFiltersWithLabels from './reportOptions/filters/getActivitiesFiltersWithLabels';
import getActivitiesGroupByFields from './reportOptions/getActivitiesGroupByFields';
import getMailsFiltersWithLabels from './reportOptions/filters/getMailsFiltersWithLabels';
import {
	cachedReportsVar,
	sourceTableDataVar,
} from '../../api/vars/insightsApi';

export const getCachedReportById = (reportId: string) => {
	return cachedReportsVar().find((report) => report.id === reportId);
};

const insightsApiState = (
	InsightsApiClient: ApolloClient<any>,
	SettingsApiClient: ApolloClient<any>,
) => {
	const { getCurrentUserSettings, getReportTypes } =
		settingsApiState(SettingsApiClient);

	const getCachedReports = () => {
		return cachedReportsVar();
	};

	const setCachedReport = (id: ReportId, updatableObject: object) => {
		const cachedReports = cloneDeep(cachedReportsVar());

		let cachedReport = getReportById(id, cachedReports);

		if (cachedReport) {
			mergeWith(cachedReport, updatableObject, mergeFormatter);
		} else {
			const { reports } = getCurrentUserSettings();
			const report = getReportById(id, reports);

			cachedReport = parseReportParametersForReportView({
				...report,
				unsavedReport: DEFAULT_UNSAVED_REPORT,
				...updatableObject,
			}) as Report;

			cachedReports.push({
				...cachedReport,
				__typename: 'CachedReport',
			});
		}

		cachedReportsVar(cachedReports);

		return cachedReport;
	};

	const getCachedReport = (reportId: ReportId) => {
		const cachedReport = getCachedReportById(reportId);

		if (!cachedReport) {
			return setCachedReport(reportId, { data: null });
		}

		return cachedReport;
	};

	const removeCachedReport = (id: ReportId) => {
		const cachedReports = cloneDeep(cachedReportsVar());

		const updatedCachedReports = cachedReports.filter(
			(report: Report) => report.id !== id,
		);

		cachedReportsVar(updatedCachedReports);

		return updatedCachedReports;
	};

	const resetUnsavedReport = (id: ReportId) => {
		const cachedReport = getCachedReportById(id);
		const parameters = cloneDeep(cachedReport.parameters);

		Object.entries(parameters).forEach(([key, value]) => {
			if (key === 'group_by' || key === 'stages') {
				parameters[key] = JSON.parse(value as string);
			} else if (key === 'filter_by') {
				parameters[key] = prepareFilterBy(JSON.parse(value as string));
			}
		});

		setCachedReport(id, {
			unsavedReport: {
				name: cachedReport.name,
				parameters,
				is_editing: false,
				segment_set: false,
				chart_type: cachedReport.chart_type,
				report_type: cachedReport.report_type,
				data: cachedReport.data,
				__typename: 'reportreportInput',
			},
		});
	};

	const setUnsavedReport = (
		updatableObject: any,
		merge = true,
	): void | null => {
		try {
			const selectedItemId = getSelectedItemId();
			const { unsavedReport } = getCachedReportById(selectedItemId);

			const unsavedReportProperties = merge
				? mergeWith({}, unsavedReport, updatableObject, mergeFormatter)
				: updatableObject;

			setCachedReport(selectedItemId, {
				unsavedReport: {
					...unsavedReportProperties,
					is_editing: true,
					__typename: 'reportreportInput',
				},
			});
		} catch {
			return null;
		}
	};

	const getReportParentType = (
		defaultType: insightsTypes.ReportType,
	): ReportSettingsType => {
		const currentReportTypeParentReportType =
			getCurrentReportParentType(defaultType);
		const { reportTypes } = getReportTypes();

		return (
			reportTypes.find(
				({ type }: ReportSettingsType) =>
					type === currentReportTypeParentReportType,
			) || {}
		);
	};

	const setDefaultSettingsToUnsavedReport = (
		defaultType: insightsTypes.ReportType,
		name: string,
	) => {
		const currentReportType = getReportParentType(defaultType);
		const defaultReport = (
			currentReportType.subtypes.find(
				({ subtype }: ReportSettingsSubtype) => subtype === defaultType,
			) || currentReportType.subtypes[0]
		).defaultReport;

		const parsedDefaultReport = parseReportParametersForReportView({
			...(defaultReport as unknown as Report),
			unsavedReport: {
				...DEFAULT_UNSAVED_REPORT,
				report_type: defaultType,
			},
		});

		return setUnsavedReport(
			{
				...(parsedDefaultReport as Report).unsavedReport,
				name,
				chart_type: defaultReport.chart_type,
				report_type: defaultType,
			},
			false,
		);
	};

	const getReportOptions = (
		translator: Translator,
	): DataTypeBasedReportOptions => {
		const result = InsightsApiClient.readQuery({
			query: GET_REPORT_SELECT_OPTIONS,
		});

		const {
			dealsGroupBy,
			dealsMeasureBy,
			dealsFields,
			dealsFilters,
			activitiesGroupBy,
			activitiesMeasureBy,
			activitiesFilters,
			activitiesFields,
			mailsFilters,
			mailsGroupBy,
			mailsFields,
		} = result;

		const dealFieldsWithTranslations = getDealFieldsWithTranslatedName(
			dealsFields.fields,
			translator,
		);

		const dealFiltersWithLabels = getDealsFiltersWithLabels({
			filters: dealsFilters.fields,
			fields: dealsFields.fields,
			translator,
		});
		const activityFiltersWithLabels = getActivitiesFiltersWithLabels({
			filters: activitiesFilters.inputFields,
			translator,
		});
		const mailsFiltersWithLabels = getMailsFiltersWithLabels({
			filters: mailsFilters.inputFields,
			translator,
		});

		return {
			[insightsTypes.DataType.DEALS]: {
				groupByFields: dealsGroupBy.fields,
				measureByFields: dealsMeasureBy.enumValues,
				fields: dealFieldsWithTranslations,
				filters: dealFiltersWithLabels,
			},
			[insightsTypes.DataType.ACTIVITIES]: {
				groupByFields: getActivitiesGroupByFields(
					activitiesGroupBy?.enumValues,
				),
				measureByFields: activitiesMeasureBy?.enumValues,
				fields: getActivityFieldsWithTranslatedName(
					activitiesFields.fields,
					translator,
				),
				filters: activityFiltersWithLabels,
			},
			[insightsTypes.DataType.MAILS]: {
				groupByFields: mailsGroupBy.enumValues,
				measureByFields: [],
				fields: getMailFieldsWithTranslatedName(
					mailsFields.fields,
					translator,
				),
				filters: mailsFiltersWithLabels,
			},
		};
	};

	const setCachedSourceDataTable = (reportId: ReportId, dataObject: any) => {
		const sourceTableData = cloneDeep(sourceTableDataVar());

		let cachedTable = getTableById(reportId, sourceTableData);

		if (cachedTable) {
			mergeWith(cachedTable, dataObject, mergeFormatter);
		} else {
			const { reports } = getCurrentUserSettings();
			const { columns } = getTableById(reportId, reports);

			cachedTable = {
				id: reportId,
				columns,
				...dataObject,
			};

			sourceTableData.push({
				...cachedTable,
				__typename: 'CachedTable',
			});
		}

		sourceTableDataVar(sourceTableData);

		return sourceTableData;
	};

	const getCachedSourceDataTable = (reportId: ReportId) => {
		const sourceTableData = sourceTableDataVar().find(
			(report) => report.id === reportId,
		);

		if (!sourceTableData) {
			return setCachedSourceDataTable(reportId, { data: null });
		}

		return sourceTableData;
	};

	return {
		resetUnsavedReport,
		setUnsavedReport,
		setDefaultSettingsToUnsavedReport,
		getReportParentType,
		getReportOptions,
		getCachedReports,
		getCachedReport,
		setCachedReport,
		removeCachedReport,
		getCachedSourceDataTable,
		setCachedSourceDataTable,
	};
};

export default insightsApiState;
