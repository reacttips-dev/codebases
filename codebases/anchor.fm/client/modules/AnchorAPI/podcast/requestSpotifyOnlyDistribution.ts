type RequestSpotifyOnlyDistribution = {
  response: Response;
  json?: {
    distributionWarnings: {
      id: number;
      value: string;
      text: string;
    }[];
  };
  error?: string;
};

export async function requestSpotifyOnlyDistribution({
  stationId,
}: {
  stationId: string;
}): Promise<RequestSpotifyOnlyDistribution> {
  try {
    const response = await fetch(
      `/api/proxy/v3/stations/webStationId:${stationId}/requestSpotifyOnlyDistribution`,
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }
    );
    let error;
    let json;
    if (response.ok) {
      json = await response.json();
    } else {
      error = 'Could not fulfill Spotify distribution request';
    }
    return { response, json, error };
  } catch (err) {
    throw new Error(err.message);
  }
}
