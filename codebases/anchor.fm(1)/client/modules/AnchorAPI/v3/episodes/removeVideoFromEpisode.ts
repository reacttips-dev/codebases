import { FetchEpisodeVideoResponse } from 'modules/AnchorAPI/v3/episodes/fetchEpisodeVideo';

type RemoveVideoFromEpisodeParams = {
  episodeId: string;
} & Pick<FetchEpisodeVideoResponse, 'episodeSpotifyVideoId'>;

type RemoveVideoFromEpisodeResponse = {
  episodeId: string;
};

export async function removeVideoFromEpisode({
  episodeId,
  episodeSpotifyVideoId,
}: RemoveVideoFromEpisodeParams): Promise<RemoveVideoFromEpisodeResponse> {
  try {
    const resp = await fetch(
      `/api/proxy/v3/episodes/webEpisodeId:${episodeId}/video`,
      {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          episodeSpotifyVideoId,
        }),
      }
    );
    if (resp.ok) {
      return resp.json();
    }
    throw new Error(`Could not remove video from episode`);
  } catch (err) {
    throw new Error(err.message);
  }
}
