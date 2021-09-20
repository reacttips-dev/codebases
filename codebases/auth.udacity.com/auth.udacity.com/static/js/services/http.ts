import AuthenticationService from './authentication-service';
import { Headers, HttpResponse } from './types';

const buildHeaders = (extraHeaders: Headers): Headers => {
  const headers: Headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...extraHeaders
  };

  const jwt = AuthenticationService.getJWT();

  if (jwt) {
    headers['Authorization'] = `Bearer ${jwt}`;
  }

  return headers;
};

export const parseResponse = (response: Response): Promise<HttpResponse> => {
  if (response.status === 204) {
    return Promise.resolve({
      ...response,
      data: null
    });
  }
  const contentType = response.headers.get('content-type');
  const jsonContent =
    contentType && contentType.indexOf('application/json') !== -1;
  const parsePromise = jsonContent ? response.json() : response.text();

  return parsePromise.then(
    (data: JSON | string): HttpResponse => {
      if (!response.ok && !response.redirected) {
        // eslint-disable-next-line
        throw {
          response: {
            ...response,
            status: response.status,
            data
          }
        };
      }
      return {
        status: response.status,
        data
      };
    }
  );
};

export default class Http {
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  get(path: string, extraHeaders: Headers = {}): Promise<HttpResponse> {
    const headers: Headers = buildHeaders(extraHeaders);
    return fetch(this.url + path, {
      method: 'get',
      headers
    }).then((response) => parseResponse(response));
  }

  post(
    path: string,
    data: Object,
    extraHeaders: Headers = {}
  ): Promise<HttpResponse> {
    const headers: Headers = buildHeaders(extraHeaders);

    return fetch(this.url + path, {
      method: 'post',
      headers,
      body: JSON.stringify(data)
    }).then((response) => parseResponse(response));
  }
}
