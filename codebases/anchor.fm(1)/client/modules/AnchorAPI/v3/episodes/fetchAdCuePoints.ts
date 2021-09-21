import { PlacementType } from './saveAdCuePoints';

type FetchAdCuePointsParams = {
  episodeId: string;
};

type CuePointResponse = {
  adCount: number;
  created: string;
  createdUnixTimestamp: number;
  placementType: PlacementType;
  startTime: number;
};

export type FetchAdCuePointsResponse = {
  episodeStreamingAdCuePoints: CuePointResponse[];
};

export async function fetchAdCuePoints({
  episodeId,
}: FetchAdCuePointsParams): Promise<FetchAdCuePointsResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/episodes/webEpisodeId:${episodeId}/ad-cue-points`,
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error('Unexpected error');
  } catch (err) {
    throw new Error(err.messages);
  }
}
