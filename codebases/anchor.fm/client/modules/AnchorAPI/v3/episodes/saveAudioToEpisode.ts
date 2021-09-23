type SaveAudioToEpisodeParams = {
  stationId: string;
  episodeId: string;
  audioId?: string;
  audioIds?: string[];
};

type SaveAudioToEpisodeResponse = {
  audioId: number;
};

export async function saveAudioToEpisode({
  stationId,
  episodeId,
  audioId,
  audioIds,
}: SaveAudioToEpisodeParams): Promise<SaveAudioToEpisodeResponse> {
  try {
    const resp = await fetch(
      `/api/proxy/v3/stations/webStationId:${stationId}/publish/existing`,
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          webEpisodeId: episodeId,
          webAudioId: audioId,
          audioIds,
        }),
      }
    );
    if (resp.ok) {
      return resp.json();
    }
    throw new Error(`Could not add audio to episode`);
  } catch (err) {
    throw new Error(err.message);
  }
}
