import { COMPLETED_REQUEST_SESSION_STORAGE_KEY, MAX_LOCAL_STORAGE_VALUES, REQUEST_SESSION_STORAGE_KEY } from 'constants/e2e';

// Overriding the `send` method for XMLHttpRequest.
// We have to override the `onload` here to
// avoid an "Illegal invocation" error
function sendReplacement(data) {
  // Save original and override `onload`
  this.onloadOriginal = this.onload;
  this.onload = onloadChangeReplacement;

  // Save data sent so we can store once the call completes later
  let json;
  if (typeof data === 'string') {
    json = jsonTryParse(data);
  }
  this._request = json || data;

  storeRequest({ url: this._url, request: this._request }, REQUEST_SESSION_STORAGE_KEY);

  // Fire actual XMLHttpRequest.send so the call is completed
  return window.XMLHttpRequest.prototype.sendOriginal.apply(this, arguments);
}

function onloadChangeReplacement() {
  const { responseURL: url, status, response, _request: request } = this;
  storeRequest({ url, status, response, request });
  return this.onloadOriginal?.apply(this, arguments);
}

function openReplacement() {
  this._method = arguments[0];
  this._url = arguments[1];
  window.XMLHttpRequest.prototype.openOriginal.apply(this, arguments);
}

const fetchReplacement = (url, options) => {
  // We must declare and return the promise like this so we have two promise `then()` chains.
  // One chain for the e2e tests to use. And another for the regular marty fetches to use.
  // Helpful explanation of Promise chaining https://javascript.info/promise-chaining
  const promise = window.fetchOriginal(url, options);
  promise
    // We have to use .clone() so the Marty app can do res.json() there as well.
    .then(res => res.clone())
    .then(res => res.text()) // using text() instead of json() here to handle non-json responses
    .then(res => jsonTryParse(res) || res)
    .then(res => res && storeRequest({ url, status: res.status, response: res }));
  return promise;
};

const sendBeaconReplacement = (url, request, options) => {
  const hasSent = navigator.sendBeaconOriginal(url, request, options);
  // The info we send in the beacon is a blob https://developer.mozilla.org/en-US/docs/Web/API/Blob
  if (request instanceof Blob) {
    // Blob.text() returns a promise so we save the request info after that resolves.
    request.text().then(requestString => {
      const request = jsonTryParse(requestString);
      storeRequest({ url, request });
    });
  }
  // We must return whether or not the beacon queued so marty doesn't incorrectly retry
  return hasSent;
};

export const storeRequest = (requestInfo, storageKey = COMPLETED_REQUEST_SESSION_STORAGE_KEY) => {
  let savedRequests = jsonTryParse(window.sessionStorage.getItem(storageKey)) || [];

  if (savedRequests.length > MAX_LOCAL_STORAGE_VALUES) {
    savedRequests = savedRequests.slice(savedRequests.length - MAX_LOCAL_STORAGE_VALUES);
  }

  savedRequests.push(requestInfo);

  window.sessionStorage.setItem(storageKey, JSON.stringify(savedRequests));
};

const jsonTryParse = jsonString => {
  let parsedJson;
  try {
    parsedJson = JSON.parse(jsonString);
  } catch (err) { /* Don't blow up if we're not getting actual JSON */ }
  return parsedJson;
};

/*
  This overrides XHR, beacon, and fetch request methods.
  While mainting the original behavior this adds listeners to
  record the relevent request data.

  Note: browser.requestListener(); will need to be reinitialized every
  hard page load so the window variables are overidden again.
*/

export const requestListener = () => {
  // Ensure we don't override the open/send methods twice
  if (!window._requestReporterEnabled) {
    window._requestReporterEnabled = true;

    // If there is a global titanite instance we can disable sendBeacon requests.
    // This way we can see what the resulting status code is.
    if (window.titanite && window.titanite.config) {
      window.titanite.config.enableSendBeacon = false;
    }

    // Save real methods for XMLHttpRequest, sendBeacon, and fetch
    // Override with our own that has listeners to record our calls
    window.XMLHttpRequest.prototype.openOriginal = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = openReplacement;
    window.XMLHttpRequest.prototype.sendOriginal = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = sendReplacement;

    if (window.fetch) {
      window.fetchOriginal = window.fetch;
      window.fetch = fetchReplacement;
    }

    if (navigator.sendBeacon) {
      navigator.sendBeaconOriginal = navigator.sendBeacon;
      navigator.sendBeacon = sendBeaconReplacement;
    }
  }
};
