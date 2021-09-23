import { AnchorAPI } from '../../modules/AnchorAPI';
import {
  ExternalUrls,
  PodcastCreationRequest,
} from '../../modules/AnchorAPI/v3/settings/fetchDistributionData';
import {
  HIDE_FROM_MANUAL_DISTRIBUTION,
  POTENTIAL_PLATFORMS,
} from './constants';
import { Host, PlatformUrlObject } from './types';

export const checkRedirect = (
  webStationId: string,
  userId: number
): Promise<{ redirected: boolean; persisted: boolean }> =>
  AnchorAPI.checkAndPersistRedirect(webStationId, userId);

export function getRemainingPlatforms(externalUrls: PlatformUrlObject[]) {
  const addedPlatformNames = externalUrls
    .filter(({ url }) => url)
    .map(externalUrl => externalUrl.host);
  return POTENTIAL_PLATFORMS.filter(platform => {
    const { name } = platform;
    if (name === 'anchor') return false;
    if (HIDE_FROM_MANUAL_DISTRIBUTION.includes(name)) return false;
    return !addedPlatformNames.includes(name);
  });
}

export function getIsOptedOutOfDistribution(
  podcastCreationRequest?: PodcastCreationRequest
) {
  if (podcastCreationRequest === undefined || podcastCreationRequest === null) {
    return false;
  }
  return podcastCreationRequest.status === 'optedout';
}

export function getExternalUrlsArray(externalUrls: ExternalUrls) {
  if (externalUrls === undefined) return [];
  return Object.keys(externalUrls)
    .map(externalUrlKey => {
      const platformInfo = POTENTIAL_PLATFORMS.find(
        ({ name }) => name === externalUrlKey
      );
      if (platformInfo === undefined) return null;
      return {
        host: externalUrlKey,
        url: externalUrls[externalUrlKey as Host],
        label: platformInfo.label,
      };
    })
    .filter(externalUrl => externalUrl);
}
