import { ThirdPartyTracksResponse } from './types';

export async function fetchSpotifyPlaylistTracks({
  playlistId,
}: {
  playlistId: string;
}): Promise<ThirdPartyTracksResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/music/playlist/tracks?playlistId=${playlistId}`,
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Could not fetch playlist's tracks`);
  } catch (err) {
    throw new Error(err.message);
  }
}
