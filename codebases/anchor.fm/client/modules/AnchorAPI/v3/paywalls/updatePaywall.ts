export type UpdatePaywallParameters = {
  webStationId: string;
  listenerMessage: string;
};

export type UpdatePaywallResponse = {
  status: string;
};

export async function updatePaywall({
  webStationId,
  listenerMessage,
}: UpdatePaywallParameters): Promise<UpdatePaywallResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/paywalls/webStationId:${webStationId}/`,
      {
        method: 'PUT',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ listenerMessage }),
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Could not update paywall information.`);
  } catch (err) {
    throw new Error(err.message);
  }
}
