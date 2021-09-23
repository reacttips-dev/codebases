export type SpanActivationLifeCycleState =
  | 'pending'
  | 'activated'
  | 'rejected'
  | 'deactivated'
  | 'notEligible';

export type FetchSpanStatusResponse = {
  spanActivationLifeCycleState: SpanActivationLifeCycleState;
};

export async function fetchSpanStatus(
  webStationId: string
): Promise<FetchSpanStatusResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/span/webStationId:${webStationId}/preferences`,
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error(
      `Unable to fetch SPAN eligibility for webStationId: ${webStationId}`
    );
  } catch (err) {
    throw new Error(err.message);
  }
}
