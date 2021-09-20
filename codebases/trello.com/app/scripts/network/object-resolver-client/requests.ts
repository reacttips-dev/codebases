import { atlassianApiGateway, clientVersion } from '@trello/config';
import { URL, BatchResolveResponse, ProviderResponse } from './types';

/**
 * This function calls the object-resolver API and attempts to resolve all the
 * provided URLs.
 * Trello only calls the batch API.
 *
 * @param resourceUrls an array of URLs to resolve
 */
export async function resolveResourceUrls(
  resourceUrls: URL[],
): Promise<BatchResolveResponse[]> {
  const response = await fetch(
    `${atlassianApiGateway}gateway/api/object-resolver/resolve/batch`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': clientVersion,
      },
      body: JSON.stringify(
        resourceUrls.map((resourceUrl) => ({ resourceUrl })),
      ),
    },
  );
  if (response.status !== 200) {
    const e = await response.json();
    throw new Error(e.error || e.message);
  }
  return response.json();
}

export async function getProviders(): Promise<ProviderResponse[]> {
  const response = await fetch(
    `${atlassianApiGateway}gateway/api/object-resolver/providers`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': clientVersion,
      },
    },
  );
  if (response.status === 200) {
    const { providers } = await response.json();
    return providers;
  }
  return [];
}
