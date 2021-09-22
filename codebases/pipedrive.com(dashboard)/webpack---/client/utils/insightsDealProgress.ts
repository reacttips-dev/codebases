import { Constants, Periods, getInsightsApiQuery } from '@pipedrive/insights-core';
import { getDefaultCurrency } from '../shared/api/webapp';

export const composeProgressQueryFilters = (
	startDate: string,
	endDate: string,
	selectedFilter: {
		type: string;
		value: number | string;
	},
	selectedPipelineId: number,
) => {
	const { type: selectedFilterType, value: selectedFilterValue } = selectedFilter;

	const selectableFilterTypes = {
		USER: 'user',
		TEAM: 'team',
	};

	const isUserSelected = selectedFilterType === selectableFilterTypes.USER && selectedFilterValue !== 'everyone';
	const isTeamSelected = selectedFilterType === selectableFilterTypes.TEAM;

	const queryfilters = [];

	const dateFilter = {
		filter: 'dealStageLogAddTime',
		type: 'date',
		operands: [
			{ name: Constants.OperandType.FROM, defaultValue: startDate },
			{ name: Constants.OperandType.TO, defaultValue: endDate },
			{ name: Constants.OperandType.FORMAT, defaultValue: Periods.gqlDateFormat },
		],
	};

	const pipelineFilter = {
		filter: 'pipelineId',
		operands: [
			{
				name: Constants.OperandType.EQ,
				defaultValue: selectedPipelineId,
			},
		],
	};

	queryfilters.push(dateFilter);
	queryfilters.push(pipelineFilter);

	if (isUserSelected || isTeamSelected) {
		const ownerFilter = {
			filter: `${selectedFilterType}Id`,
			type: selectedFilterType,
			operands: [{ name: Constants.OperandType.EQ, defaultValue: selectedFilterValue }],
		};

		queryfilters.push(ownerFilter);
	}

	return queryfilters;
};

export const composeProgressQueryString = (queryFilters: any[]) => {
	const query = getInsightsApiQuery({
		reportType: Constants.ReportType.PROGRESS,
		shouldQueryChartData: true,
		dataType: 'deals',
		filterByFilter: queryFilters,
		fields: {},
		defaultCurrency: getDefaultCurrency(),
	});

	const variables = {
		from: null,
		size: null,
		lastPage: null,
		sortOrder: 'desc',
		sortBy: 'count',
	};

	return JSON.stringify({
		query,
		variables,
	});
};

export const getProgressQueryPath = (queryFiltersArray: any[]) => {
	const queryPathArray = [];

	const filterByFilters = queryFiltersArray.map((filter) => filter.filter);

	if (filterByFilters && filterByFilters.length > 0) {
		filterByFilters.forEach((filter) => {
			queryPathArray.push(Constants.QueryFilterField.FILTER);
			queryPathArray.push(filter);
		});
	}

	queryPathArray.push(Constants.ReportType.PROGRESS);
	queryPathArray.push('data');

	return queryPathArray.join('.');
};
