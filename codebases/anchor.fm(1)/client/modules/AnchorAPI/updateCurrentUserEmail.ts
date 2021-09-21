import { Promise } from 'bluebird';
import AnchorAPIError from './AnchorAPIError';

const updateCurrentUserEmail = (email: string) => {
  return new Promise<{}>((resolve, reject) => {
    const urlPath = '/api/user/email';
    fetch(urlPath, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        emailAddress: email,
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

export { updateCurrentUserEmail };
