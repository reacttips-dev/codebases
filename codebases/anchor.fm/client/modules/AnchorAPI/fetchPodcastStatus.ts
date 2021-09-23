import { DistributionRequestStatus } from '../../types';
import AnchorAPIError from './AnchorAPIError';

export type PodcastUrlDictionary = {
  [platform: string]: string;
};
export type FetchPodcastStatusResponse = {
  isAutoPairable: boolean;
  isFirstTimeCreator: boolean;
  isRedirectedToAnchor: boolean;
  podcastStatus: DistributionRequestStatus | null;
  podcastUrlDictionary: PodcastUrlDictionary | {};
  vanitySlug: string;
  podcastExternalSource?: string;
};

async function fetchPodcastStatus(): Promise<FetchPodcastStatusResponse> {
  try {
    const response = await fetch('/api/podcast/status', {
      method: 'GET',
      credentials: 'same-origin',
    });
    if (response.ok) {
      return response.json();
    }
    if (response.status === 400) {
      throw new AnchorAPIError(response, `Missing image`);
    }
    throw new AnchorAPIError(
      response,
      `Non 200 response status: ${response.status}`
    );
  } catch (err) {
    throw new Error(err.messages);
  }
}

export { fetchPodcastStatus };
