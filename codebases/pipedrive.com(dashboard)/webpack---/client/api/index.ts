import { get as getObjectData } from 'lodash';
import { get, post, put, remove, patch, getCookieValue } from '@pipedrive/fetch';
import { DEALS_TO_LOAD, RELEVANT_DEAL_FIELDS } from '../utils/constants';
import {
	composeProgressQueryFilters,
	composeProgressQueryString,
	getProgressQueryPath,
} from '../utils/insightsDealProgress';
import parseFilterToGetParameters from '../utils/parseFilterToGetParameters';

export interface IGetDealsResponse {
	deals: Pipedrive.Deal[];
	additionalData: Pipedrive.API.IAdditionalData;
}

export interface CreatePipelineSettingsResponse {
	success: boolean;
	data: {
		pipeline_id: number;
	};
}

export interface UpdateDealResponse {
	data: Pipedrive.Deal;
	additional_data: {
		matches_filters?: number[];
	};
}

export function getFilters() {
	return get('/api/v1/filters?type=deals');
}

export async function getDeals(
	pipelineId: number,
	selectedFilter: Pipedrive.SelectedFilter,
	limit: number = DEALS_TO_LOAD,
	start = 0,
): Promise<IGetDealsResponse> {
	const baseUrl = `/api/v1/pipelines/${pipelineId}/deals`;
	const fields = `:(${RELEVANT_DEAL_FIELDS.join(',')})`;
	const getParameters = `?limit=${limit}&start=${start}&get_summary=0&totals_convert_currency=default_currency`;

	const { data: deals, additional_data: additionalData } = await get<Pipedrive.Deal[]>(
		baseUrl + fields + getParameters + parseFilterToGetParameters(selectedFilter),
	);

	return { deals, additionalData };
}

export async function getDeal(dealId: number): Promise<Pipedrive.Deal> {
	const baseUrl = `/api/v1/deals/${dealId}`;
	const { data: deal } = await get(baseUrl);

	return deal;
}

export async function updateDeal(dealId: number, putBody: Partial<Pipedrive.Deal>): Promise<UpdateDealResponse> {
	const baseUrl = `/api/v1/deals/${dealId}`;
	const response = await put<Pipedrive.Deal>(baseUrl, putBody);

	return {
		data: response.data,
		additional_data: response.additional_data || {},
	};
}

export async function deleteDeal(dealId: number): Promise<any> {
	const baseUrl = `/api/v1/deals/${dealId}`;
	const response = await remove(baseUrl);

	return response;
}

export async function getDealsSummary(
	pipelineId: number,
	selectedFilter: Pipedrive.SelectedFilter,
): Promise<Pipedrive.DealsSummaryData> {
	const dealsSummaryBaseUrl = `/api/v1/deals/summary?pipeline_id=${pipelineId}`;

	const { data: dealsSummaryData } = await get(dealsSummaryBaseUrl + parseFilterToGetParameters(selectedFilter));

	return dealsSummaryData;
}

export async function getGoals(pipelineId: number, assigneeType: string, assigneeId: number | string) {
	const baseUrl = `/api/v1/goals/find/`;
	const getParameters = `?type.params.pipeline_id=${pipelineId}&type.name=deals_progressed&is_active=true&assignee.type=${assigneeType}&assignee.id=${assigneeId}`;
	const { data: goals } = await get(baseUrl + getParameters);

	return goals;
}

export async function getProgressByStages(
	startDate: string,
	endDate: string,
	selectedFilter: {
		type: string;
		value: number | string;
	},
	selectedPipelineId: number,
) {
	const queryFilters = composeProgressQueryFilters(startDate, endDate, selectedFilter, selectedPipelineId);

	const queryString = composeProgressQueryString(queryFilters);

	const baseUrl = '/api/v1/insights-api/graphql';

	// cannot use pd-fetch as it expects the response from the request to contain `success: true`
	const response = await fetch(`${baseUrl}?session_token=${getCookieValue('pipe-session-token')}`, {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Cache-control': 'no-cache',
			'Pragma': 'no-cache',
		},
		method: 'POST',
		body: queryString,
	});

	const {
		data: { deals = {} },
	} = await response.json();

	return getObjectData(deals, getProgressQueryPath(queryFilters));
}

/**
 * Deals-by-stages summary is included in the main /deals endpoint. Ideally, it should be split in the back-end
 * as often we may want to recalculate summaries without the need to fetch deals. As a hacky-workaround, we just ask
 * for 1 deal (asking for 0 deals returns all deals :sad_pepe:) so it returns minimal amount of data and should be fast.
 */
export async function getByStagesSummary(
	pipelineId: number,
	selectedFilter: Pipedrive.SelectedFilter,
): Promise<Pipedrive.DealsByStagesSummary> {
	const dealsByStagesSummaryUrl = `/api/v1/pipelines/${pipelineId}/summary?totals_convert_currency=default_currency`;

	let { data: dealsByStagesSummary } = await get(
		dealsByStagesSummaryUrl + parseFilterToGetParameters(selectedFilter),
	);

	if (!dealsByStagesSummary) {
		dealsByStagesSummary = {
			per_stages_converted: {},
		};
	}

	return dealsByStagesSummary;
}

export async function getPipelineDealsCount(pipelineId: number): Promise<number> {
	const pipelineDealsCountUrl = `/api/v1/pipelines/${pipelineId}/dealsCount`;

	const {
		data: { count },
	} = await get(pipelineDealsCountUrl);

	return count;
}

export async function getStageDealsCount(stageId: number): Promise<number> {
	const stageDealsCountUrl = `/api/v1/stages/${stageId}/dealsCount`;

	const {
		data: { count },
	} = await get(stageDealsCountUrl);

	return count;
}

export async function saveNoteToDeal(dealId: number, content: string) {
	const baseUrl = '/api/v1/notes';
	const response = await post(baseUrl, {
		content,
		deal_id: dealId,
		pinned_to_deal_flag: true,
	});

	return response;
}

export async function createPipeline(stages: string[]) {
	const baseUrl = '/api/v1/pipelines/settings';
	const response = await post(baseUrl, {
		stages,
	});

	return response;
}

export async function createPipelineWithSettings(postBody: any): Promise<CreatePipelineSettingsResponse> {
	const baseUrl = '/api/v1/pipelines/settings';
	const response = await post(baseUrl, postBody);

	return response;
}

export async function updatePipelineSettings(pipelineId: number, putBody: any): Promise<void> {
	const baseUrl = `/api/v1/pipelines/${pipelineId}/settings`;
	await put(baseUrl, putBody);
}

export async function getPlaybooksByPipelineId(pipelineId: number): Promise<Pipedrive.LeadBooster.Playbook[]> {
	const baseUrl = `/api/v1/leadbooster-chat-api/playbooks/?pipelineId=${pipelineId}`;

	const { data } = await get<Pipedrive.LeadBooster.Playbook[]>(baseUrl);

	return data;
}

export async function getPlaybooksByStageId(stageId: number): Promise<Pipedrive.LeadBooster.Playbook[]> {
	const baseUrl = `/api/v1/leadbooster-chat-api/playbooks/?stageId=${stageId}`;

	const { data } = await get<Pipedrive.LeadBooster.Playbook[]>(baseUrl);

	return data;
}

export async function updatePlaybook(
	playbookUuid: string,
	body: {
		oldPipelineId: number;
		newPipelineId: number;
		oldStageId: number;
		newStageId: number;
	},
): Promise<void> {
	const baseUrl = `/api/v1/leadbooster-chat-api/playbooks/${playbookUuid}/updatePipelineAndStageId`;

	await patch(baseUrl, body);
}

export async function deactivatePlaybook(uuid: string): Promise<void> {
	const baseUrl = `/api/v1/leadbooster-chat-api/playbooks/${uuid}/`;

	const body = {
		active: false,
	};

	await patch(baseUrl, body);
}

export async function getWebFormsByPipelineId(pipelineId: number): Promise<Pipedrive.WebForms.WebForm[]> {
	const baseUrl = `/api/v1/webForms/?pipelineId=${pipelineId}`;

	const { data } = await get(baseUrl);

	return data;
}

export async function getWebFormsByStageId(stageId: number): Promise<Pipedrive.WebForms.WebForm[]> {
	const baseUrl = `/api/v1/webForms/?stageId=${stageId}`;

	const { data } = await get(baseUrl);

	return data;
}

export async function updateWebFormStage(
	webFormId: string,
	body: {
		oldPipelineId: number;
		oldStageId: number;
		newPipelineId: number;
		newStageId: number;
	},
) {
	const baseUrl = `/api/v1/webForms/${webFormId}/updateStage`;

	await patch(baseUrl, body);
}

export async function deactivateWebForm(id: string) {
	const baseUrl = `/api/v1/webForms/${id}`;

	const body = {
		isActive: false,
	};

	await patch(baseUrl, body);
}
