import { gql } from '@apollo/client';
import { queries, types, helpers } from '@pipedrive/insights-core';

import { EmailFieldKey } from '../constants';

interface GetReportQueryProperties {
	shouldQueryList?: boolean;
	shouldQueryExportList?: boolean;
	shouldQueryChartData?: boolean;
	reportType?: types.ReportType;
	chartType: types.ChartType;
	interval?: types.Interval | boolean;
	groupByFilter?: string;
	timeInterval?: types.TimeInterval[];
	segmentByFilter?: string;
	measureByFilter?: string;
	isMeasureByCustomField?: boolean;
	defaultCurrency?: string;
	isWeightedValue?: boolean;
	filterByFilter: types.Filter[];
	reportColumns: string[];
	setGroupByFilter?: any;
	multiSelectFilter?: number[];
	statsFields?: types.Fields;
	timeZone?: string;
	isCumulative?: boolean;
	getPipelineStages?: (pipelineId: number) => Pipedrive.Stage[];
}

const getReportQuery = (
	dataType: types.DataType,
	{
		shouldQueryList,
		shouldQueryExportList,
		shouldQueryChartData,
		reportType,
		chartType,
		interval,
		groupByFilter,
		timeInterval,
		segmentByFilter,
		measureByFilter,
		isMeasureByCustomField,
		defaultCurrency,
		isWeightedValue,
		filterByFilter,
		reportColumns,
		setGroupByFilter,
		multiSelectFilter,
		statsFields,
		timeZone,
		isCumulative,
		getPipelineStages,
	}: GetReportQueryProperties,
) => {
	if (dataType === types.DataType.DEALS) {
		const measureByFilterType =
			measureByFilter &&
			helpers.deals.getMeasureByFilterType(measureByFilter);
		const statsReportFields =
			statsFields ||
			helpers.deals.getStats({
				groupByFilter,
				measureByFilterType,
				segmentByFilter,
			});
		const listReportFields = shouldQueryExportList
			? helpers.getListFields(reportColumns)
			: helpers.deals.getListFields(reportColumns);

		const dealsQuery = queries.generateDealsQuery({
			shouldQueryList,
			shouldQueryExportList,
			shouldQueryChartData,
			reportType,
			chartType,
			interval,
			groupByFilter,
			timeInterval,
			segmentByFilter,
			measureByFilter,
			isMeasureByCustomField,
			defaultCurrency,
			isWeightedValue,
			stats: statsReportFields,
			filterByFilter,
			fields: listReportFields,
			setGroupByFilter,
			multiSelectFilter,
			timeZone,
			isCumulative,
			getPipelineStages,
		});

		return gql(dealsQuery);
	}

	if (dataType === types.DataType.ACTIVITIES) {
		const statsReportFields = helpers.activities.getStatsFields(
			groupByFilter,
			segmentByFilter,
		);
		const listReportFields = shouldQueryExportList
			? helpers.getListFields(reportColumns)
			: helpers.activities.getListFields(reportColumns);

		const activitiesQuery = queries.generateActivitiesQuery({
			fields: listReportFields,
			shouldQueryChartData,
			shouldQueryExportList,
			shouldQueryList,
			reportType,
			interval,
			stats: statsReportFields,
			filterByFilter,
			groupByFilter,
			segmentByFilter,
			chartType,
			timeZone,
		} as types.GenerateQueryArguments);

		return gql(activitiesQuery);
	}

	if (dataType === types.DataType.MAILS) {
		const statsReportFields = helpers.mails.getStatsFields(
			groupByFilter,
			segmentByFilter,
		);
		const requestListFields = [...reportColumns];

		// For source data UI to show subject as a link to correct mail
		if (
			requestListFields.includes(EmailFieldKey.SUBJECT) &&
			!requestListFields.includes(EmailFieldKey.THREAD_ID)
		) {
			requestListFields.push(EmailFieldKey.THREAD_ID);
		}

		const listReportFields = helpers.getListFields(requestListFields);

		const mailsQuery = queries.generateMailsQuery({
			fields: listReportFields,
			shouldQueryChartData,
			shouldQueryList,
			reportType,
			interval,
			stats: statsReportFields,
			filterByFilter,
			groupByFilter,
			segmentByFilter,
			chartType,
			timeZone,
		} as types.GenerateQueryArguments);

		return gql(mailsQuery);
	}

	throw Error(`Could not generate query for data type ${dataType}`);
};

export default getReportQuery;
