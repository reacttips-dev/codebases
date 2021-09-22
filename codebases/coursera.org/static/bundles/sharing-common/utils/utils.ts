import URI from 'jsuri';
import Q from 'q';

import API from 'js/lib/api';

import { CUSTOM_URL_ENDPOINT } from 'bundles/sharing-common/constants';

const MOCK_DOMAIN = 'mock.dev-coursera.org';
const MOCK_PORT = 9443;

// TODO: InjectedRouter location does not include protocol
export const generateJsUriObjCurrentPage = (router: $TSFixMe) => {
  const {
    location: { protocol, hostname, pathname },
  } = router;

  const url = new URI().setProtocol(protocol).setHost(hostname).setPath(pathname);

  if (hostname === MOCK_DOMAIN) {
    url.setPort(MOCK_PORT);
  }

  return url;
};

// TODO: InjectedRouter location does not include protocol
export const getAbsoluteUrlForPath = (router: $TSFixMe, path: string) => {
  const {
    location: { protocol, hostname },
  } = router;

  const url = new URI().setProtocol(protocol).setHost(hostname).setPath(path);

  if (hostname === MOCK_DOMAIN) {
    url.setPort(MOCK_PORT);
  }

  return url.toString();
};

export const createCustomUrlPromise = (targetShareLink: string, customUrlSlug?: string) => {
  // note that passing in a customUrlSlug requires a superuser account, if empty resource generates a random hash
  return new Promise((resolve, reject) => {
    const api = API('', { type: 'rest' });

    // wrapping in Q here so it acts like a normal promise and not a jquery promise
    Q(
      api.post(`${CUSTOM_URL_ENDPOINT}`, {
        data: {
          targetUrl: targetShareLink,
          customSlug: customUrlSlug || '',
        },
      })
    )
      .then((resp) => {
        const customUrl = resp && resp.elements && resp.elements[0];

        resolve({
          customShareLink: customUrl && `https://coursera.org/share/${customUrl.customSlug}`,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const convertHmsStringIntoSeconds = (hms: string) => {
  // Reverse split string so we can support if hours/minutes are missing
  const splitHms = hms.split(':').reverse();
  const secondsFromHours = (splitHms[2] && Number(splitHms[2]) * 60 * 60) || 0;
  const secondsFromMinutes = (splitHms[1] && Number(splitHms[1]) * 60) || 0;
  const seconds = (splitHms[0] && Number(splitHms[0])) || 0;

  return secondsFromHours + secondsFromMinutes + seconds;
};

export const convertSecondsIntoHmsString = (timeInSeconds: number) => {
  let outputStr = '';
  const hours: string | number = Math.floor(timeInSeconds / 3600);
  const minutes: string | number = Math.floor((timeInSeconds - hours * 3600) / 60);
  const seconds: string | number = Math.floor(timeInSeconds - hours * 3600 - minutes * 60);

  if (hours > 0) {
    outputStr += (hours < 10 ? '0' : '') + hours + ':';
  }

  outputStr += (minutes < 10 ? '0' : '') + minutes + ':';
  outputStr += (seconds < 10 ? '0' : '') + seconds;

  return outputStr;
};
