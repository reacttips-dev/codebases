import { logDebug } from 'middleware/logger';

/*
 * Builds the URL string for the pixel server iframe.
 *
 * Only valid to be called when in the client.
 */
export function buildIframeUrl(pixelServerConfig, pageType, queryString) {
  const affiliateParams = queryString ? queryString.replace(/^\?/, '&') : '';
  return `https://${pixelServerConfig.host}/${pixelServerConfig.pathname}?pageType=${pageType}${affiliateParams}`;
}

/*
 * Builds the data object in the format for posting to the pixel server iframe.
 *
 * Can only be called on the client
 */
export function buildDataBundle(iframeUrl, tid, data = {}, win = window) {
  const { hash, host, hostname, href, origin, pathname, port, protocol, search } = win.location;
  const info = {
    pageload: {
      location: {
        hash: hash,
        host: host,
        hostname: hostname,
        href: href,
        origin: origin,
        pathname: pathname,
        port: port,
        protocol: protocol,
        search: search,
        iframeSrc: iframeUrl
      },
      upu: win.zfcUPU || (pathname + search),
      referrer: document.referrer,
      timestamp: new Date().getTime(),
      killed: []
    },
    session: {
      uid: (typeof win !== 'undefined' && win.uid) || '',
      tid: (typeof win !== 'undefined' && win.tid) || tid,
      isVip: false,
      isCLT: false
    },
    killed: []
  };

  for (const key of Object.keys(data)) {
    info[key] = data[key];
  }
  return info;
}

/*
 * Returns true/false based on whether the provided pixel server configuration and the current execution environment can be used to fire pixel server messages.
 */
export function isConfigValid(pixelServerConfig, tid) {
  let valid = true;
  const fail = function(msg) {
    pixelLogger(msg);
    valid = false;
  };

  // without hostname and pathname, we cannot build iframe src, so fail
  if (!pixelServerConfig.host) {
    fail('REQUIRED: "pixelServerConfig.host" (string) url for iframe (example: "pixels.zappos.com")');
  }
  if (!pixelServerConfig.pathname) {
    fail('REQUIRED: "pixelServerConfig.pathname" (string) desktop pathname for iframe (example: "zappos.html")');
  }
  // tid is required for pixelServer
  if (!tid) {
    fail('REQUIRED: "tid", browser session based customer id, inconsistent across browsers, but stored in long-life cookie');
  }

  /**
   * postMessage is available in modern browsers
   * chrome 1+, ff 6+, safari 4+, opera 9.5+, ie8+ (we will not supporte ie7 or older)
   * https://developer.mozilla.org/en-US/docs/Web/API/Window.postMessage
   * postMessage allows us to post info from parent window to iframe
   */
  if (!window.postMessage) {
    fail('INCOMPATIBLE: browser does not support postMessage');
  }
  return valid;
}

export function pixelLogger() {
  logDebug('[pixelServer]', ...arguments);
}
