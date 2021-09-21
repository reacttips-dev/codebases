import { Promise } from 'bluebird';
import AnchorAPIError from './AnchorAPIError';

const logoutCurrentUser = () => {
  return new Promise<{}>((resolve, reject) => {
    const urlPath = '/api/logout';
    fetch(urlPath, {
      method: 'POST',
      credentials: 'same-origin',
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

export { logoutCurrentUser };
