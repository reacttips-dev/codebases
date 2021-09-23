import { getApiUrl } from '../../../Url';

type FetchMediaProcessingStatusParameters = {
  requestUuid: string;
};

type FetchMediaProcessingStatusResponse = {
  requestUuid: string;
};

export async function fetchMediaProcessingStatus({
  requestUuid,
}: FetchMediaProcessingStatusParameters): Promise<
  FetchMediaProcessingStatusResponse
> {
  try {
    const resp = await fetch(
      getApiUrl({
        path: `upload/${requestUuid}`,
      }),
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    );
    if (resp.ok) {
      return resp.json();
    }
    throw new Error('Could not fetch media processing status');
  } catch (e) {
    throw new Error(e.message);
  }
}
