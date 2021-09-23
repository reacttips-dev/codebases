export type PodcastNetworkStation = {
  stationId: string;
  podcastName: string;
  podcastImage400?: string;
  podcastImage?: string;
};

export type PodcastNetworkStationsResponse = {
  stations: PodcastNetworkStation[];
};

export async function fetchPodcastNetworkStations(): Promise<
  PodcastNetworkStationsResponse
> {
  try {
    const response = await fetch('/api/user/podcastnetwork/stations', {
      method: 'GET',
      credentials: 'same-origin',
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`Could not fetch this network's podcasts`);
  } catch (err) {
    throw new Error(err.message);
  }
}
