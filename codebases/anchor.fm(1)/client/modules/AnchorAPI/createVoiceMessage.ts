import { Promise } from 'bluebird';
import AnchorAPIError from './AnchorAPIError';

const createVoiceMessage = (
  webAudioId: any,
  webStationId: any,
  userId: number
) => {
  return new Promise<{}>((resolve, reject) => {
    const urlPath = `/api/proxy/v3/callin/webStationId:${webStationId}/existing`;
    fetch(urlPath, {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        webAudioId,
        userId,
      }),
    }).then(response => {
      if (response.ok) {
        resolve({});
      } else {
        const error = new AnchorAPIError(
          response,
          `Server error: ${response.statusText} (${response.status}) - ${
            response.url
          }`
        );
        reject(error);
      }
    });
  });
};

export { createVoiceMessage };
