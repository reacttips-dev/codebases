import { SpanActivationLifeCycleState } from 'client/modules/AnchorAPI/v3/span/fetchSpanStatus';

export type UpdateSpanStatusParams = {
  webStationId: string;
  countryCode?: string;
  spanActivationLifeCycleState: Omit<
    SpanActivationLifeCycleState,
    'notEligible' | 'pending'
  >;
};

export async function updateSpanStatus({
  webStationId,
  countryCode,
  spanActivationLifeCycleState,
}: UpdateSpanStatusParams): Promise<Response> {
  try {
    const response = await fetch(
      `/api/proxy/v3/span/webStationId:${webStationId}/preferences`,
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          spanActivationLifeCycleState,
          countryCode,
        }),
      }
    );
    if (response.ok) {
      return response;
    }
    throw new Error(`Unable to update Spotify Audience Ads`);
  } catch (err) {
    throw new Error(err.message);
  }
}
