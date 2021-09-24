import { getApiUrl } from '../../../Url';
import AnchorAPIError from '../../AnchorAPIError';

const getEndpointUrl = (webStationId: string | null, rssImportItemId: number) =>
  getApiUrl({
    path: `stations/webStationId:${webStationId}/importItem/${rssImportItemId}`,
  });

type Params = {
  userId: number;
  webStationId: string | null;
  rssImportItemId: number;
};

export const deleteImportItem = async (params: Params) => {
  const { userId, webStationId, rssImportItemId } = params;
  const url = getEndpointUrl(webStationId, rssImportItemId);
  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      userId,
    }),
  });
  if (response.ok) {
    return response.status;
  }

  const { status, statusText } = response;
  throw new AnchorAPIError(response, `${status} - ${statusText}`);
};
