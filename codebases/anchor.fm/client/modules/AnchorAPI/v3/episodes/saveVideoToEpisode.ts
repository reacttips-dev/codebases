type SaveVideoToEpisodeParams = {
  episodeId: string;
  videoUploadId: number;
  isSpotifyVideoPodcastEnabled: boolean;
};

type SaveVideoToEpisodeResponse = {
  episodeId: string;
  episodeSpotifyVideoId: number;
  videoUploadId: number;
};

export async function saveVideoToEpisode({
  episodeId,
  videoUploadId,
  isSpotifyVideoPodcastEnabled,
}: SaveVideoToEpisodeParams): Promise<SaveVideoToEpisodeResponse> {
  try {
    const resp = await fetch(
      `/api/proxy/v3/episodes/webEpisodeId:${episodeId}/video`,
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          videoUploadId,
          isSpotifyVideoPodcastEnabled,
        }),
      }
    );
    if (resp.ok) {
      return resp.json();
    }
    throw new Error(`Could not add video to episode`);
  } catch (err) {
    throw new Error(err.message);
  }
}
