export async function fetchSpotifyAuthenticationStatus(): Promise<Response> {
  try {
    const response = await fetch(`/api/proxy/v3/music/status`, {
      method: 'GET',
      credentials: 'same-origin',
    });
    if (response.ok) {
      return response;
    }
    throw new Error(`Could not fetch user's Spotify authentication status`);
  } catch (err) {
    throw new Error(err.message);
  }
}
