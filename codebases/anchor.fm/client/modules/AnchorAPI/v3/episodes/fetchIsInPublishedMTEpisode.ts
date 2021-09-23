export async function fetchIsInPublishedMTEpisode({
  webAudioId,
}: {
  webAudioId: string;
}): Promise<{
  json?: { isInPublishedMTEpisode: boolean };
  error?: string;
  response?: Response;
}> {
  let json;
  let error;
  let response;
  try {
    response = await fetch(
      `/api/proxy/v3/audios/webAudioId:${webAudioId}/getIsInPublishedMTEpisode`,
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    );
    if (response.ok) {
      json = await response.json();
    }
  } catch (err) {
    error = 'Could not check audio for effect on other episodes';
  }
  return { json, error, response };
}
