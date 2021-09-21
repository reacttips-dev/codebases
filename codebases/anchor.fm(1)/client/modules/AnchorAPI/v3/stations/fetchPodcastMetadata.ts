// GET: /v3/stations/{stationId}/metadata

function getEndpointUrl(webStationId: string) {
  return `/api/proxy/v3/stations/webStationId:${webStationId}/metadata`;
}

type Params = {
  webStationId: string;
};

export enum WORDPRESS_STATUS {
  CREATED_ACCOUNT = 'createdAccount',
  CONNECTED_ACCOUNT = 'connectedAccount',
  COMPLETED_IMPORT = 'completedImport',
}

export type FetchPodcastMetadataJson = {
  isExternalSyndicationSetup?: boolean;
  language?: string;
  podcastIsExplicit?: boolean;
  podcastName?: string;
  podcastDescription?: string;
  podcastAuthorName?: string;
  podcastImage?: string;
  podcastCategory?: string;
  podcastLanguage?: string;
  podcastUrlApple?: string;
  podcastUrlGoogle?: string;
  podcastUrlOvercast?: string;
  podcastUrlPocketcasts?: string;
  hasDismissedDistributionMilestone?: boolean;
  wordpressStatus?: WORDPRESS_STATUS;
  isPWEnabled?: boolean;
  isPWSetup?: boolean;
};

const fetchPodcastMetadata = async (
  params: Params
): Promise<FetchPodcastMetadataJson> => {
  const { webStationId } = params;
  const url = getEndpointUrl(webStationId);
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'same-origin',
  });
  if (response.ok) {
    const json = await response.json();
    return json;
  }
  throw new Error(`${response.status} - ${response.statusText}`);
};

export { fetchPodcastMetadata };
