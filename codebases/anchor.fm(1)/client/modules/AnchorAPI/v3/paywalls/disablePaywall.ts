export type DisablePaywallParameters = {
  userId: string;
  webStationId: string;
};

export type DisablePaywallResponse = {
  status: string;
};

export async function disablePaywall({
  userId,
  webStationId,
}: DisablePaywallParameters): Promise<DisablePaywallResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/paywalls/webStationId:${webStationId}/disable`,
      {
        method: 'PUT',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ userId }),
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Could not disable paywalls.`);
  } catch (err) {
    throw new Error(err.message);
  }
}
