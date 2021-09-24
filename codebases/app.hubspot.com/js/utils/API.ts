import isQA from 'unified-navigation-ui/utils/isQA';
import { isHublet, getHublet } from 'unified-navigation-ui/utils/hublet';
import { getCsrfCookie } from './cookie';
var RETRY_MILLIS = 1000;

var addApiCsrf = function addApiCsrf(request, domain) {
  request.setRequestHeader('X-HubSpot-CSRF-hubspotapi', getCsrfCookie(domain));
};

var tryParseAsJSON = function tryParseAsJSON(resp) {
  try {
    return JSON.parse(resp);
  } catch (e) {
    return resp;
  }
};

var setBaseRequestProps = function setBaseRequestProps(request, opts) {
  request.withCredentials = true;

  if (opts.acceptAll) {
    request.setRequestHeader('Accept', '*/*');
  } else {
    request.setRequestHeader('Accept', 'application/json');
  }

  request.setRequestHeader('Content-type', 'application/json');
  addApiCsrf(request, opts.domain || 'hubspot');
};

var localOr = function localOr(overrideKey) {
  var subDomain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'api';
  var result;

  try {
    if (window.localStorage[overrideKey] === 'local') {
      result = 'local';
    }
  } catch (err) {
    /* Noop */
  }

  if (!result) {
    result = subDomain;
  }

  if (isHublet()) {
    result = result + "-" + getHublet();
  }

  return result;
};

var getBaseUrl = function getBaseUrl(opts) {
  var localOverride = opts.localOverride,
      subDomain = opts.subDomain,
      domain = opts.domain;
  var subDomainOverride = localOr(localOverride, subDomain);
  var domainOverride = domain || 'hubspot';
  return isQA() ? "https://" + subDomainOverride + "." + domainOverride + "qa.com" : "https://" + subDomainOverride + "." + domainOverride + ".com";
};

var getUrl = function getUrl(path, opts) {
  var baseUrl = getBaseUrl(opts);
  return "" + baseUrl + path;
};

var retryGETMaybe = function retryGETMaybe(_ref) {
  var path = _ref.path,
      cb = _ref.cb,
      opts = _ref.opts,
      func = _ref.func;

  if (opts.maxRetries - 1 > 0) {
    opts.maxRetries -= 1; // eslint-disable-next-line no-use-before-define

    setTimeout(function () {
      return func(path, cb, opts);
    }, RETRY_MILLIS);
  }
};

var retryPOSTMaybe = function retryPOSTMaybe(_ref2) {
  var path = _ref2.path,
      body = _ref2.body,
      cb = _ref2.cb,
      opts = _ref2.opts,
      func = _ref2.func;

  if (opts.maxRetries - 1 > 0) {
    opts.maxRetries -= 1; // eslint-disable-next-line no-use-before-define

    setTimeout(function () {
      return func(path, body, cb, opts);
    }, RETRY_MILLIS);
  }
}; // TO FIX I think opts:XMLHttpRequestEventTarget is the real move there?


var GET = function GET(path, cb) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var request = new XMLHttpRequest();
  request.open('GET', getUrl(path, opts));
  setBaseRequestProps(request, opts);

  request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      if (cb) {
        cb(tryParseAsJSON(this.response));
      }
    } else if (opts.onError && typeof opts.onError === 'function' && !opts.onError(this.status, this.response)) {
      retryGETMaybe({
        path: path,
        cb: cb,
        opts: opts,
        func: GET
      });
    }
  };

  request.onerror = function () {
    if (opts.onError && typeof opts.onError === 'function' && !opts.onError(this.status, this.response)) {
      retryGETMaybe({
        path: path,
        cb: cb,
        opts: opts,
        func: GET
      });
    }
  };

  request.send();
};

var PUT = function PUT(path, body, cb) {
  var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var request = new XMLHttpRequest();
  request.open('PUT', getUrl(path, opts));
  setBaseRequestProps(request, opts);

  request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      if (cb) {
        cb(tryParseAsJSON(this.response));
      }
    } else {// TODO: Error states
    }
  };

  request.onerror = function () {// TODO: Error states
  };

  request.send(JSON.stringify(body));
};

var POST = function POST(path, body, cb) {
  var opts = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var request = new XMLHttpRequest();
  request.open('POST', getUrl(path, opts));
  setBaseRequestProps(request, opts);

  request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      if (cb) {
        cb(tryParseAsJSON(this.response));
      }
    } else {
      retryPOSTMaybe({
        path: path,
        body: body,
        cb: cb,
        opts: opts,
        func: POST
      });
    }
  };

  request.onerror = function () {
    retryPOSTMaybe({
      path: path,
      body: body,
      cb: cb,
      opts: opts,
      func: POST
    });
  };

  request.send(JSON.stringify(body));
};

export { GET, PUT, POST, getBaseUrl, setBaseRequestProps };