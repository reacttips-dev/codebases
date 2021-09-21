type FetchAdCuePointsParams = {
  episodeId: string;
  cuePoints: CuePoint[];
};

export type PlacementType = 'preRoll' | 'midRoll' | 'postRoll';

export type CuePoint = {
  startTime: number;
  placementType: PlacementType;
  adCount: number;
};

export type SaveAdCuePointsResponse = {
  status: string;
};

export async function saveAdCuePoints({
  episodeId,
  cuePoints,
}: FetchAdCuePointsParams): Promise<SaveAdCuePointsResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/episodes/webEpisodeId:${episodeId}/ad-cue-points`,
      {
        method: 'PUT',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ episodeStreamingAdCuePoints: cuePoints }),
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
