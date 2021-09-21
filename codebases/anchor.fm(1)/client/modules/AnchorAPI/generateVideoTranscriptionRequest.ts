import { Promise } from 'bluebird';

import AnchorAPIError from './AnchorAPIError';

const generateVideoTranscriptionRequest = (
  audioId: string,
  stationId: string,
  userId: string
) => {
  return new Promise<{}>((resolve, reject) => {
    fetch(`/api/proxy/v3/audios/webAudioId:${audioId}/generate_video`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        userId,
        webStationId: stationId,
      }),
    }).then(response => {
      if (response.ok) {
        resolve(response);
      } else {
        const error = new AnchorAPIError(
          response,
          `Server error: ${response.statusText} (${response.status}) - ${response.url}`
        );
        reject(error);
      }
    });
  });
};

export { generateVideoTranscriptionRequest };
