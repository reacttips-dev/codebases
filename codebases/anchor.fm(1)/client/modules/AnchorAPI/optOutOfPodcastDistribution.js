import AnchorAPIError from './AnchorAPIError';

const optOutOfPodcastDistribution = async ({ webStationId } = {}) => {
  if (!webStationId) {
    throw new Error('No station provided');
  }
  try {
    const resp = await fetch(
      `/api/proxy/v3/stations/webStationId:${webStationId}/distribution/optout`,
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }
    );

    if (resp.ok) {
      return resp.json();
    }

    throw new AnchorAPIError(resp, `Non 200 response status: ${resp.status}`);
  } catch (err) {
    throw new Error(err.message);
  }
};

export { optOutOfPodcastDistribution };
