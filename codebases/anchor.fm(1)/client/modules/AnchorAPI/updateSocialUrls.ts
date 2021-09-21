// /v3/stations/{stationId}/metadata

export type SocialUrlBody = {
  twitterSocialUsername?: string;
  facebookSocialUsername?: string;
  instagramSocialUsername?: string;
  youtubeSocialUsername?: string;
};

function getEndpointUrl(userId: number) {
  return `/api/proxy/v3/userSocialUrl/${userId}`;
}

type Params = {
  userId: number;
  socialUrls: SocialUrlBody;
};

const updateSocialUrls = async (params: Params) => {
  const { userId, socialUrls } = params;
  const url = getEndpointUrl(userId);
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(socialUrls),
  });
  if (response.ok) {
    return response.status;
  }
  throw new Error(`${response.status} - ${response.statusText}`);
};

export { updateSocialUrls };
