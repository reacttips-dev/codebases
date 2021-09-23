import { getApiUrl } from '../../../Url';

type Params = {
  webStationId: string;
  hasOptedIntoContactability: boolean;
};

export async function updateContactabilityStatus(params: Params) {
  try {
    const response = await fetch(
      getApiUrl({
        path: `settings`,
      }),
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          ...params,
        }),
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error(`${response.status} - ${response.statusText}`);
  } catch (err) {
    throw new Error(err.message);
  }
}
