import { get, put } from '@pipedrive/fetch';

export async function getActivitiesForDeal(dealId: number): Promise<Pipedrive.Activity[]> {
	const baseUrl = `/api/v1/deals/${dealId}/activities`;
	const getParameters = '?start=0&done=0';

	const { data: activities } = await get(baseUrl + getParameters);

	return activities || [];
}

/**
 * Updates an activity, and returns a boolean to indicate whether the schedule next activity modal should be shown or not.
 */
export async function updateActivity(activityId: number, putBody: Partial<Pipedrive.Activity>): Promise<boolean> {
	const baseUrl = `/api/v1/activities/${activityId}`;
	const response = await put(baseUrl, putBody);

	return !response.additional_data.more_activities_scheduled_in_context;
}
