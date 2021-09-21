// POST v3/paywalls/:stationId

export type CreatePaywallSubscriptionParameters = {
  userId: number;
  webStationId: string;
  webPriceId: string;
  paywallEpisodeIds: string[];
};

export type CreatePaywallSubscriptionResponse = {
  status: string;
};

const getPaywallEpisodeIdsParam = (episodeIds: string[] | undefined) => {
  if (!episodeIds || !episodeIds.length) return [];
  return episodeIds.map(id => `webEpisodeId:${id}`);
};

export async function createPaywallSubscription({
  userId,
  webStationId,
  webPriceId,
  paywallEpisodeIds,
}: CreatePaywallSubscriptionParameters): Promise<CreatePaywallSubscriptionResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/paywalls/webStationId:${webStationId}`,
      {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          userId,
          webPriceId,
          paywallEpisodeIds: getPaywallEpisodeIdsParam(paywallEpisodeIds),
        }),
      }
    );
    if (response.ok) {
      return response.json();
    }
    const { error } = await response.json();
    throw new Error(error || 'Could not finish setting up subscriptions.');
  } catch (err) {
    throw new Error(err);
  }
}
