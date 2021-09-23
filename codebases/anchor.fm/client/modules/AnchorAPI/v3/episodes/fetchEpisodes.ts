import queryString from 'query-string';

export enum ORDER_BY {
  TITLE = 'TITLE',
  PUBLISH_ON = 'publishOn',
  DURATION = 'duration',
  PLAYS = 'plays',
  AD_COUNT = 'adCount',
}
export enum FILTER_BY {
  ALL = 'all',
  FREE = 'free',
  PAID = 'paid',
}

export type FetchEpisodesParams = {
  webStationId: string;
  orderBy?: ORDER_BY;
  filterBy?: FILTER_BY;
  searchTitle?: string;
  limit?: number;
  pageToken?: string;
};

export enum DISTRIBUTION_STATUS {
  UNASSIGNED = 'unassigned',
  ASSIGNED = 'assigned',
  STARTED = 'started',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

/**
 * this type is specific to the episode object returned from
 * `/api/proxy/v3/stations/webStationId:${webStationId}/episodePage`
 *
 * Other endpoints return episode objects that have a different shape, so
 * we'll have to maintain a separate types
 * https://github.com/AnchorFM/public-website/blob/d5d6062a31547a62ce9fb9bd3750681d35f61e1a/client/modules/AnchorAPI/v3/episodes/fetchEpisodeAudio.ts#L87
 */
export type EpisodeItem = {
  episodeId: number;
  webEpisodeId: string;
  title?: string;
  publishOnUnixTimestamp: number | null;
  createdUnixTimestamp: number;
  totalPlays: number;
  duration: number;
  adCount: number;
  shareLinkPath?: string;
  shareLinkEmbedPath?: string;
  downloadUrl: string | null;
  containsMusicSegments: boolean;
  isPublishedToSpotifyExclusively: boolean;
  isPW?: boolean;
  episodeDistributionRequestStatus?: DISTRIBUTION_STATUS;
  wordpressPostMetadataId?: string;
  isTrailer?: boolean;
};

export type FetchEpisodesResponse = {
  first: string;
  prev: string | null;
  next: string | null;
  last: string;
  limit: number;
  items: EpisodeItem[];
};

const getFilterByParam = (filterBy?: FILTER_BY) => {
  switch (filterBy) {
    case FILTER_BY.FREE:
    case FILTER_BY.PAID:
      return { subscriptionsFilter: filterBy };
    default:
      return {};
  }
};

export async function fetchEpisodes({
  webStationId,
  orderBy,
  filterBy,
  searchTitle,
  limit,
  pageToken,
}: FetchEpisodesParams): Promise<FetchEpisodesResponse> {
  try {
    const url = queryString.stringifyUrl({
      url: `/api/proxy/v3/stations/webStationId:${webStationId}/episodePage`,
      query: {
        ...getFilterByParam(filterBy),
        orderBy,
        searchTitle,
        limit: limit ? limit.toString() : undefined,
        pageToken,
      },
    });
    const response = await fetch(url);
    if (response.ok) {
      return response.json();
    }
    throw new Error('Unable to fetch episodes');
  } catch (err) {
    throw new Error(err.message);
  }
}
