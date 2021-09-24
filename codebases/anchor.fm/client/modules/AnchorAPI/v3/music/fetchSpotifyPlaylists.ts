import { ThirdPartyPlaylistResponse } from './types';

export async function fetchSpotifyPlaylists(): Promise<
  ThirdPartyPlaylistResponse
> {
  try {
    const response = await fetch(`/api/proxy/v3/music/playlists`, {
      method: 'GET',
      credentials: 'same-origin',
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Could not fetch user's playlists`);
  } catch (err) {
    throw new Error(err.message);
  }
}
