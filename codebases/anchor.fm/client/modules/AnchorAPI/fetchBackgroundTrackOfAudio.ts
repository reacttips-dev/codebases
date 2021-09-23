import AnchorAPIError from './AnchorAPIError';

function getEndpointUrl(webAudioId: string) {
  return `/api/proxy/v3/audios/webAudioId:${webAudioId}/backgroundTrack`;
}

interface IFetchBackgroundTrackOfAudio {
  webAudioId: string;
  userId: string;
}

export const fetchBackgroundTrackOfAudio = async (
  params: IFetchBackgroundTrackOfAudio
) => {
  const { webAudioId } = params;
  try {
    const response = await fetch(getEndpointUrl(webAudioId), {
      method: 'GET',
      credentials: 'same-origin',
    });
    const json = await response.json();
    return json;
  } catch (err) {
    throw new AnchorAPIError(err);
  }
};
