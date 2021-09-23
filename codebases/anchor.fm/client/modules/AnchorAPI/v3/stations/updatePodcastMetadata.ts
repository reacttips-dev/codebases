// /v3/stations/{stationId}/metadata

import { Metadata } from '../../../../types/Metadata';

type Params = {
  webStationId: string;
  userId: number;
  metadata: Metadata;
};

type Response = { errors: string[]; rssFeedUrl: string };
const updatePodcastMetadata = async (
  params: Params,
  getObjectResp?: boolean
): Promise<Response | number> => {
  const { webStationId, userId, metadata } = params;
  try {
    const response = await fetch(
      `/api/proxy/v3/stations/webStationId:${webStationId}/metadata`,
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          userId,
          ...metadata,
        }),
      }
    );
    if (response.ok) {
      const json: Response = await response.json();
      return getObjectResp ? json : response.status;
    }
    throw new Error(
      `Unable to update podcast metadata for ${webStationId}: ${response.status} - ${response.statusText}`
    );
  } catch (e) {
    // https://github.com/Microsoft/TypeScript/issues/20024
    throw new Error((e as Error).message);
  }
};

export { updatePodcastMetadata };
