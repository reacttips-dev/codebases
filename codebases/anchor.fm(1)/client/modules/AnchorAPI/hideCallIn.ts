import { Promise } from 'bluebird';
import AnchorAPIError from './AnchorAPIError';

const hideCallIn = (callInId: number) => {
  return new Promise<{}>((resolve, reject) => {
    fetch(`/api/proxy/v3/callins/${callInId}/hide`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
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

export { hideCallIn };
