const contentTypeMap = { json: /\bjson\b/ },
  ACCESS_TOKEN_HEADER = 'x-access-token';
const wrap = (fetch) => {
  return new Promise((resolve, reject) => {
    fetch.then((response) => {
      let parsedResponse;
      let contentType = response.headers.get('Content-Type');
      if (contentTypeMap.json.test(contentType)) {
        parsedResponse = response.json();
      }
      else {
        parsedResponse = response.text();
      }

      parsedResponse.then((data) => {
        if (response.ok) {
          resolve({
            body: data,
            status: response.status,
            headers: response.headers
          });
        }
        else {
          reject({
            error: data,
            status: response.status,
            headers: response.headers
          });
        }
      });
    }).catch((error) => {
      let parsedError = _.pick(error, ['message', 'stack']);

      // @todo: this is here because the consumers sometimes drop the error and rely on the status
      // status should always be truthy
      reject({ error: parsedError, status: 1 });
    });
  });
};

class HttpService {
  request (path, options) {
    return wrap(fetch(path, this.sanitizeRequestOptions(options)));
  }

  urlSearchParams (params) {
    return Object.keys(params).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');
  }


  sanitizeRequestOptions (options = {}) {
    if (window.SDK_PLATFORM === 'browser' && options) {
      _.unset(options, `headers.${ACCESS_TOKEN_HEADER}`);

      if (!options.credentials)
        options.credentials = 'include';
    }

    return options;
  }
}

export default new HttpService();
