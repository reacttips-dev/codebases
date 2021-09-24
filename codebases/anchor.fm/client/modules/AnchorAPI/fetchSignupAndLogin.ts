import { Promise } from 'bluebird';
import AnchorAPIError from './AnchorAPIError';

interface ISignupData {
  name: string;
  email: string;
  password: string;
  captcha: string;
}

const fetchSignupAndLogin = ({
  name,
  email,
  password,
  captcha,
}: ISignupData) => {
  return new Promise<{}>((resolve, reject) => {
    const urlPath = '/api/user/account';
    fetch(urlPath, {
      body: JSON.stringify({
        captcha,
        email,
        name,
        password,
      }),
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      method: 'POST',
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

export { fetchSignupAndLogin };
