import { ThirdPartyTracksResponse } from './types';

export async function fetchSearchResults({
  query,
}: {
  query: string;
}): Promise<ThirdPartyTracksResponse> {
  try {
    const response = await fetch(`/api/proxy/v3/music/search?query=${query}`);
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Could not fetch search results`);
  } catch (err) {
    throw new Error(err.message);
  }
}
