import { get } from '@pipedrive/fetch';
import parseFilterToGetParameters from '../../utils/parseFilterToGetParameters';

// eslint-disable-next-line max-params
export async function getDeals(
	pipelineId: number,
	selectedFilter: Pipedrive.SelectedFilter,
	interval: string,
	showBy: string,
	columnsNumber: number,
	periodStartDate: string,
	excludeDeals: number,
): Promise<any> {
	const baseUrl = '/api/v1/deals/timeline';
	const getParameters = `?pipeline_id=${pipelineId}&totals_convert_currency=default_currency&exclude_deals=${excludeDeals}`;
	const settingsGetParameters = `&interval=${interval}&field_key=${showBy}&amount=${columnsNumber}&start_date=${periodStartDate}`;

	const { data: dealsByPeriod } = await get(
		baseUrl + getParameters + settingsGetParameters + parseFilterToGetParameters(selectedFilter),
	);

	return dealsByPeriod;
}

export function deleteDeal() {
	throw new Error('Function not implemented.');
}

async function getFilterParameters() {
	const dealFields = await getDealFields();
	const statusFieldId = getDealFieldId(dealFields, 'status');
	const expectedCloseDateFieldId = getDealFieldId(dealFields, 'expected_close_date');

	const filterOptions = {
		glue: 'and',
		conditions: [
			{
				glue: 'and',
				conditions: [
					{
						object: 'deal',
						field_id: statusFieldId,
						operator: '=',
						value: 'open',
						extra_value: null,
					},
					{
						object: 'deal',
						field_id: expectedCloseDateFieldId,
						operator: 'IS NULL',
						value: null,
						extra_value: null,
					},
				],
			},
		],
	};

	return `&filter_json=${encodeURIComponent(encodeURIComponent(JSON.stringify(filterOptions)))}`;
}

export async function getUnlistedDealsList(
	pipelineId: number,
	selectedFilter: Pipedrive.SelectedFilter,
	start = 0,
	limit = 15,
): Promise<any> {
	const baseUrl = '/api/v1/deals/list';
	const getParameters = `?type=deal&pipeline_id=${pipelineId}&limit=${limit}&start=${start}&get_summary=1&totals_convert_currency=default_currency`;
	const filterParameters = await getFilterParameters();
	let url = baseUrl + getParameters + filterParameters;

	if (selectedFilter.value === 'everyone' || selectedFilter.type === 'user' || selectedFilter.type === 'team') {
		url = url + parseFilterToGetParameters(selectedFilter);
	}

	const { data, additional_data: additionalData } = await get(url);

	return {
		data,
		additionalData,
	};
}

export async function getUnlistedDealsListSummary(
	pipelineId: number,
	selectedFilter: Pipedrive.SelectedFilter,
): Promise<Pipedrive.TotalSummary> {
	const dealsSummaryBaseUrl = `/api/v1/deals/summary?pipeline_id=${pipelineId}`;
	const filterParameters = await getFilterParameters();
	let url = dealsSummaryBaseUrl + filterParameters;

	if (selectedFilter.value === 'everyone' || selectedFilter.type === 'user' || selectedFilter.type === 'team') {
		url = url + parseFilterToGetParameters(selectedFilter);
	}

	const { data: TotalSummary } = await get(url);

	return TotalSummary;
}

async function getDealFields(): Promise<any> {
	const dealFieldsBaseUrl = `/api/v1/dealFields`;

	const { data: dealFields } = await get(dealFieldsBaseUrl);

	return dealFields;
}

function getDealFieldId(dealFields, key): number {
	const dealField = dealFields.find((field) => field.key === key);

	if (!dealField) {
		return null;
	}

	return dealField.id;
}
