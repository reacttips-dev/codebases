import { Metadata } from '../../../types/Metadata';
import AnchorAPIError from '../AnchorAPIError';

export async function fetchMyPodcastMetadata(): Promise<Metadata> {
  try {
    const resp = await fetch('/api/podcast/metadata', {
      credentials: 'same-origin',
    });

    if (resp.status === 200) {
      const json = await resp.json();
      return json;
    }

    if (resp.status === 400) {
      throw new AnchorAPIError(resp, `Missing image`);
    }
    throw new AnchorAPIError(resp, `Non 200 resp status: ${resp.status}`);
  } catch (err) {
    throw new Error(err);
  }
}
