let csrfToken = '';
const metaElem = document.querySelector('meta[name=csrf-token]');
if (metaElem) {
  csrfToken = metaElem.getAttribute('content');
}

window.CSRFFetch = (url, options = {}) => {
  options.body = JSON.stringify(options.body);
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'X-CSRF-Token': csrfToken,
      'X-Requested-With': 'XMLHttpRequest'
    },
    credentials: 'same-origin'
  });
};

window.jCSRFFetch = (url, options = {}) => {
  return new Promise(resolve => {
    window
      .CSRFFetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })
      .then(response =>
        response.text().then(text => {
          try {
            resolve({
              status: response.status,
              data: JSON.parse(text)
            });
          } catch (err) {
            resolve({
              status: response.status,
              data: {}
            });
          }
        })
      );
  });
};

window.get = (url, options = {}) => window.jCSRFFetch(url, {...options, method: 'GET'});
window.post = (url, options = {}) => window.jCSRFFetch(url, {...options, method: 'POST'});
window.patch = (url, options = {}) => window.jCSRFFetch(url, {...options, method: 'PATCH'});
window.httpDelete = (url, options = {}) => window.jCSRFFetch(url, {...options, method: 'DELETE'});
