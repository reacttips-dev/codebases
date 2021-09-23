// /v3/audios/:audioId/transformation/retry

function getEndpointUrl(webAudioId: string) {
  return `/api/proxy/v3/audios/webAudioId:${webAudioId}/transformation/retry`;
}

interface IRetryAudioTransformationParamters {
  webAudioId: string;
  userId: string;
}

export const retryAudioTransformation = async (
  params: IRetryAudioTransformationParamters
) => {
  const { webAudioId, userId } = params;
  const url = getEndpointUrl(webAudioId);
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      userId,
    }),
  });
  if (response.ok) {
    const json = await response.json();
    return json.status;
  }
  throw new Error(`${response.status} - ${response.statusText}`);
};
