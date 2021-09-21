// PUT v3/paywalls/:stationId/episodes

export type PaywallEpisodeUpateInvalidInfo = {
  webEpisodeId: string;
  title: string;
  error: string;
};

export type UpdatePaywallEpisodesParameters = {
  userId: number;
  webStationId: string;
  addPaywallEpisodeIds?: string[];
  removePaywallEpisodeIds?: string[];
};

export type UpdatePaywallEpisodesResponse = {
  invalidEpisodes: PaywallEpisodeUpateInvalidInfo[];
};

const getPaywallEpisodeIdsParam = (episodeIds: string[] | undefined) => {
  if (!episodeIds || !episodeIds.length) return [];
  return episodeIds.map(id => `webEpisodeId:${id}`);
};

export async function updatePaywallEpisodes({
  userId,
  webStationId,
  addPaywallEpisodeIds,
  removePaywallEpisodeIds,
}: UpdatePaywallEpisodesParameters): Promise<UpdatePaywallEpisodesResponse> {
  try {
    const params = {
      userId,
      addPaywallEpisodeIds: getPaywallEpisodeIdsParam(addPaywallEpisodeIds),
      removePaywallEpisodeIds: getPaywallEpisodeIdsParam(
        removePaywallEpisodeIds
      ),
    };
    const response = await fetch(
      `/api/proxy/v3/paywalls/webStationId:${webStationId}/episodes`,
      {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(params),
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error(
      (await response.text()) || 'Could not update paywall episodes.'
    );
  } catch (err) {
    throw new Error(err);
  }
}
