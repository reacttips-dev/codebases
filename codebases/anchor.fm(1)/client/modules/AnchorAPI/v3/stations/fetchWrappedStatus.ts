type JsonResponse = {
  externalId: string;
  showUri: string;
};

type Parameters = {
  webStationId: string;
};

export async function fetchWrappedStatus({
  webStationId,
}: Parameters): Promise<JsonResponse | null> {
  try {
    const response = await fetch(
      `/api/proxy/v3/stations/webStationId:${webStationId}/wrapped`,
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    );
    // A 204 is considered "ok" as far as fetch goes, but it means the user is
    // not eligible for Wrapped, so there will be no response data to grab.
    if (response.ok && response.status === 200) {
      return response.json();
    }
    return null;
  } catch (err) {
    throw new Error(err.message);
  }
}
