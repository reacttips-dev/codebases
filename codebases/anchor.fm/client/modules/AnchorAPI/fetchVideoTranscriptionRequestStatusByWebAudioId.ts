import AnchorAPIError from './AnchorAPIError';

const fetchVideoTranscriptionRequestStatusByWebAudioId = (
  webAudioId: string,
  includeIncomplete: boolean
) =>
  fetch(
    `/api/proxy/v3/video_generation_request/audio/webAudioId:${webAudioId}/statuses`,
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        includeIncomplete,
      }),
    }
  ).then(response => {
    if (response.ok) {
      return response;
    }
    throw new AnchorAPIError(
      response,
      `Server error: ${response.statusText} (${response.status}) - ${response.url}`
    );
  });

export { fetchVideoTranscriptionRequestStatusByWebAudioId };
