function getEndpointUrl(webAudioId: string) {
  return `/api/proxy/v3/audios/webAudioId:${webAudioId}/transformation/request/background`;
}

interface ITransformAudioWithBackgroundTrackParamters {
  webAudioId: string;
  userId: string;
  backgroundTrackId: string;
  backgroundVolumeOffset: number;
}

export const transformAudioWithBackgroundTrack = async (
  params: ITransformAudioWithBackgroundTrackParamters
) => {
  const { webAudioId, backgroundTrackId, backgroundVolumeOffset } = params;
  const url = getEndpointUrl(webAudioId);
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      backgroundTrackId,
      backgroundVolumeOffset,
    }),
  });
  if (response.ok) {
    const json = await response.json();
    return json.audios[0];
  }
  throw new Error(`${response.status} - ${response.statusText}`);
};
