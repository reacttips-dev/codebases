import AnchorAPIError from './AnchorAPIError';

export type Variant = 'facebook' | 'instagram' | 'youtube' | 'twitter';

export type SocialUrl = {
  type: Variant;
  url: string;
  username: string;
};

export type JsonResponse = { userSocialUrls: SocialUrl[] };
export type Parameters = {
  stationId: string;
};

const fetchSocialUrls = ({ stationId }: Parameters): Promise<JsonResponse> =>
  fetch(`/api/proxy/v3/userSocialUrl/station/webStationId:${stationId}`, {
    credentials: 'same-origin',
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new AnchorAPIError(
      response,
      `Non 200 response status: ${response.status}`
    );
  });

export { fetchSocialUrls };
