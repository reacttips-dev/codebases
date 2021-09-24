import { getApiUrl } from '../../../Url';

type ImportStatusParameters = {
  stationId: string;
};

type Item = {
  rssImportItemId: number;
  state: 'waiting' | 'started' | 'finished' | 'failed';
  kind: 'item' | 'channel';
  title: string;
};

type ImportStatusResponse = {
  state: 'processing' | 'complete';
  percentageComplete: number;
  items: Item[];
};

const getEndpointUrl = (stationId: string) =>
  getApiUrl({ path: `stations/webStationId:${stationId}/importStatus` });

export const fetchImportStatus = async ({
  stationId,
}: ImportStatusParameters): Promise<ImportStatusResponse> => {
  const url = getEndpointUrl(stationId);
  try {
    const response = await fetch(url, {
      credentials: 'same-origin',
    });

    if (response.ok) {
      return response.json();
    }
    throw new Error(`unable to fetch import status for station: ${stationId}`);
  } catch (err) {
    throw new Error(err.message);
  }
};
