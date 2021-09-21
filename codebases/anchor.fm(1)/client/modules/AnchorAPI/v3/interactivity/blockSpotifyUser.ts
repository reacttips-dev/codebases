export async function blockSpotifyUser(
  spotifyUserId: string
): Promise<Response> {
  try {
    const response = await fetch(
      `/api/proxy/v3/interactivity/block_spotify_user`,
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ spotifyUserId }),
      }
    );
    if (response.ok) {
      return response;
    }
    throw new Error('response not OK');
  } catch (e) {
    throw new Error(e.message);
  }
}
