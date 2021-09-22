import { get, post } from '@pipedrive/fetch';
import { DEALS_TO_LOAD } from '../utils/constants';
import { IGetDealsResponse } from '.';

export async function getStages() {
	const { data } = await get<[Pipedrive.Stage]>(`/viewer-api/v1/viewer/stages`);
	return data;
}

export async function getViewerShares() {
	const { data } = await get<[Viewer.Link]>(`/viewer-api/v1/viewer/shares`);
	return data;
}

export async function requestUpgrade() {
	return post<[Viewer.Link]>(`/viewer-api/v1/viewer/requestUpgrade`, {});
}

export interface ViewerDealsResponse extends IGetDealsResponse {
	deals: Pipedrive.Deal[];
	summary: Pipedrive.DealsByStagesSummary;
}

export async function getViewerDeals(
	linkHash: string,
	limit: number = DEALS_TO_LOAD,
	start = 0,
): Promise<ViewerDealsResponse> {
	const baseUrl = `/viewer-api/v1/viewer/shares/${linkHash}/pipeline/deals?limit=${limit}&start=${start}`;
	const { data, additional_data: additionalData } = await get(baseUrl);

	return { deals: data.deals, additionalData, summary: data.summary };
}

export async function getViewerSummary(linkHash: string): Promise<Viewer.SummaryResponse> {
	const dealsByStagesSummaryUrl = `/viewer-api/v1/viewer/shares/${linkHash}/pipeline/summary/`;

	const response = await get(dealsByStagesSummaryUrl);

	return response.data;
}
