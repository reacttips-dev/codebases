import { PodcastCreationRequestStatus } from 'anchor-server-common/models/podcastCreationRequest';
import { SpotifyDistributionStatus } from 'client/types/Episodes';
import { getApiUrl } from '../../../Url';

export type FetchDistributionDataParameters = {
  currentUserId: number | null;
};

export type ExternalUrls = {
  anchor?: string;
  itunes?: string;
  googlePodcasts?: string;
  googlePlay?: string;
  overcast?: string;
  pocketCasts?: string;
  podBean?: string;
  radioPublic?: string;
  spotify?: string;
  stitcher?: string;
  breaker?: string;
  castbox?: string;
  tuneIn?: string;
};

type PodcastDistributionStatus =
  | 'doesNotHaveEpisode'
  | 'didNotDistributeAndHasNotSetUp'
  | 'didNotDistributeAndHasSetUp'
  | 'didNotDistributeAndHasInsertedLinks'
  | 'didDistributeAndDoesNotHaveLinks'
  | 'didDistributeAndHasInsertedLinks'
  | 'didDistributeAndWasRejected'
  | 'didImportButDidNotRedirect'
  // TODO https://anchorfm.atlassian.net/browse/OPTIMUS-431: Remove Outdated Status for Distribution (once confirmed)
  | 'pending'
  | 'on'
  | 'off'
  | 'noActionTaken'
  | 'optedout';

export type PodcastCreationRequest = {
  podcastCreationRequestId: number;
  podcastId: number | null;
  status: PodcastCreationRequestStatus;
  created: string;
  modified?: string;
  isSubmitted: boolean;
  stationId: number;
};

export type FetchDistributionDataResponse = {
  externalUrls: ExternalUrls;
  isUserEmailInRss: boolean;
  podcastCreationRequest?: PodcastCreationRequest;
  podcastDistributionStatus: PodcastDistributionStatus;
  podcastExternalSource?: string;
  podcastExternalSourceRedirected: string;
  podcastItunesOwnerCode?: string;
  podcastRedirectDestination?: string;
  spotifyDistributionStatus?: SpotifyDistributionStatus;
  rssFeedUrl: string;
  isRssFeedEnabled?: boolean;
  canEnableRss?: boolean;
  canRequestSpotifyLink?: boolean;
};

export async function fetchDistributionData({
  currentUserId,
}: FetchDistributionDataParameters): Promise<FetchDistributionDataResponse> {
  try {
    const response = await fetch(
      getApiUrl({
        path: `settings/user/distribution`,
        queryParameters: {
          userId: currentUserId,
        },
      }),
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    );
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`Could not fetch distribution data`);
  } catch (err) {
    throw new Error(err.message);
  }
}
