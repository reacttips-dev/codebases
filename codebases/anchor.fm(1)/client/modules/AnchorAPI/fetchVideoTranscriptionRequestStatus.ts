import { Promise } from 'bluebird';

import AnchorAPIError from './AnchorAPIError';

const fetchVideoTranscriptionRequestStatus = (requestIds: number[]) => {
  return new Promise<{}>((resolve, reject) => {
    fetch(`/api/proxy/v3/video_generation_request/statuses`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        requestIds,
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

export { fetchVideoTranscriptionRequestStatus };
