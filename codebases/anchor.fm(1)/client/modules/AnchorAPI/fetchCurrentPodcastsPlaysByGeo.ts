import { Podcast } from '../../types';
import { DateRange } from '../Date/types';
import { getApiUrl } from '../Url';
import AnchorAPIError from './AnchorAPIError';

// TODO: Should we make this type more robust by specifying the possible platforms?
interface PlaysByGeo {
  [app: string]: {
    percentOfPlays: number;
  };
}

const decodeResponseIntoPlaysByGeo = (json: any): PlaysByGeo => {
  const {
    data: {
      assets: { flagUrlByGeo },
    },
  } = json;
  return json.data.rows.reduce(
    (playsByGeoAccum: PlaysByGeo, row: any) => ({
      ...playsByGeoAccum,
      [row[0]]: {
        flagAssetUrl: flagUrlByGeo[row[0]],
        percentOfPlays: row[1],
      },
    }),
    {}
  );
};

type Level = 1 | 2 | 3 | 4 | 5;

interface GeoLevel {
  kind: 'geoLevel';
  level: Level;
}

interface Geo {
  kind: 'geo';
  level: Level;
  name: string;
}

type GeoValue = {
  label: string;
  value: number;
  flagAssetUrl: string;
};

type GeoPlays = {
  currentGeoLevel?: number;
  geoLevel2?: GeoValue;
  geoLevel3?: GeoValue;
  geoLevel4?: GeoValue;
  isLoading?: boolean;
};

type StationGeoLocationPlaysParameters = DateRange & {
  webStationId: string;
  userId: number;
  geo1?: string;
  geo2?: string;
  geo3?: string;
  geo4?: string;
  resultGeo: string;
  csvFilename?: string;
};

const getParentGeoQueryParams = ({
  geoPlays = {},
  geo,
}: {
  geoPlays: GeoPlays;
  geo: Geo | GeoLevel;
}) => {
  if (geo.kind === 'geoLevel') return '';
  // Assign geoLevel ('geo2') to parent region ('United States') for each parent geo (geoPlays)
  return Object.keys(geoPlays)
    .filter(key => key.includes('geo'))
    .map(key => {
      // e.g. key = 'geoLevel2', geoLevel = 2, geoLevelKey = 'geo2', value = 'United States';
      const geoLevel = Number(key.slice(-1));
      const geoLevelKey = `geo${geoLevel}`;
      const value =
        geoPlays.currentGeoLevel === geoLevel
          ? geo.name
          : // Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'GeoPlays'.
            // @ts-ignore
            geoPlays[key].plays[0].label;
      return `${geoLevelKey}=${encodeURIComponent(value)}`;
    })
    .join('&');
};

const getUrl = (podcast: Podcast, geo: GeoLevel | Geo, geoPlays: GeoPlays) => {
  const { id } = podcast;
  if (id.kind !== 'webId') {
    throw new Error('only supports webId');
  }
  const baseUrlPath = `/api/proxy/v3/analytics/station/webStationId:${id.webId}/playsByGeo?limit=200`;
  const parentGeos = getParentGeoQueryParams({ geoPlays, geo });
  switch (geo.kind) {
    case 'geo':
      return `${baseUrlPath}&${parentGeos}&resultGeo=geo${geo.level + 1}`;
    case 'geoLevel':
      return `${baseUrlPath}&resultGeo=geo${geo.level}`;
    default:
      const exhaustiveCheck: never = geo;
      return exhaustiveCheck;
  }
};
export function fetchCurrentPodcastsPlaysByGeo(
  podcast: Podcast,
  geo: GeoLevel | Geo = {
    kind: 'geoLevel',
    level: 1,
  },
  geoPlays: GeoPlays
) {
  const { id } = podcast;
  if (id.kind !== 'webId') {
    return Promise.reject(new Error('only supports webId'));
  }
  return new Promise<PlaysByGeo>((resolve, reject) => {
    const urlPath = getUrl(podcast, geo, geoPlays);
    fetch(urlPath, {
      credentials: 'same-origin',
    }).then(response => {
      if (response.ok) {
        response.json().then((responseJson: any) => {
          const playsByGeo = decodeResponseIntoPlaysByGeo(responseJson);
          resolve(playsByGeo);
        });
      } else {
        const error = new AnchorAPIError(
          response,
          `Server error: ${response.statusText} (${response.status}) - ${response.url}`
        );
        reject(error);
      }
    });
  });
}

export function getCurrentPodcastsPlaysByGeoUrl({
  webStationId,
  userId,
  startDateRange,
  endDateRange,
  resultGeo,
  geo1,
  geo2,
  geo3,
  geo4,
  csvFilename,
}: StationGeoLocationPlaysParameters) {
  return getApiUrl({
    path: `analytics/station/webStationId:${webStationId}/playsByGeo`,
    queryParameters: {
      userId,
      startDateRange,
      endDateRange,
      resultGeo,
      geo1,
      geo2,
      geo3,
      geo4,
      csvFilename,
    },
  });
}
