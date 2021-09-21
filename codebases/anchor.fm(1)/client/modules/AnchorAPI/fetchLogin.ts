import { Promise } from 'bluebird';
import { PlayData, Podcast } from '../../types';
import AnchorAPIError from './AnchorAPIError';

const fetchLogin = (email: string, password: string) => {
  return new Promise<{}>((resolve, reject) => {
    const urlPath = '/api/login';
    fetch(urlPath, {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        email,
        password,
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

export { fetchLogin };
