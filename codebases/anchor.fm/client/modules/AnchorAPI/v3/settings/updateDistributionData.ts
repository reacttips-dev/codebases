import { getApiUrl } from '../../../Url';
import { ExternalUrls } from './fetchDistributionData';

export type UpdateDistributionParams = {
  userId: number;
  isUserEmailInRss?: boolean;
  podcastItunesOwnerCode?: string;
  externalLinks?: ExternalUrls;
  podcastRedirectDestination?: string | null;
  isRssFeedEnabled?: boolean;
};

export async function updateDistributionData(params: UpdateDistributionParams) {
  try {
    const response = await fetch(
      getApiUrl({
        path: `settings/user/distribution`,
      }),
      {
        method: 'PUT',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          ...params,
        }),
      }
    );
    if (response.ok) {
      return response.status;
    }
    throw new Error(`${response.status} - ${response.statusText}`);
  } catch (err) {
    throw new Error(err.message);
  }
}
