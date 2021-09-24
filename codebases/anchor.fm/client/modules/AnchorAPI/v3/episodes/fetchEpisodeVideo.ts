type FetchEpisodeVideoParams = {
  episodeId: string;
};

export type FetchEpisodeVideoResponse = {
  episodeId: number;
  episodeSpotifyVideoId: number;
  videoUploadId: number;
  userId: number;
  created: string;
  caption: string;
  duration: number;
  filename: string;
  fileSize: number;
  requestUuid: string;
  url: string;
  extension: string;
};

export async function fetchEpisodeVideo({
  episodeId,
}: FetchEpisodeVideoParams): Promise<FetchEpisodeVideoResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/episodes/webEpisodeId:${episodeId}/video`,
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error('Could not fetch episode video');
  } catch (err) {
    throw new Error(err.messages);
  }
}
