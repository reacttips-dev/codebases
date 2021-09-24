'use es6';

export default (function (url, onsuccess) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      onerror = _ref.onerror,
      _ref$headers = _ref.headers,
      headers = _ref$headers === void 0 ? {} : _ref$headers,
      _ref$withCredentials = _ref.withCredentials,
      withCredentials = _ref$withCredentials === void 0 ? false : _ref$withCredentials;

  var request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === XMLHttpRequest.DONE) {
      var responseText = request.responseText,
          status = request.status;
      if (status >= 200 && status < 300) onsuccess(JSON.parse(responseText));else if (onerror) onerror(request);
    }
  };

  request.open('GET', url);

  if (withCredentials) {
    request.withCredentials = true;
  }

  Object.keys(headers).forEach(function (key) {
    request.setRequestHeader(key, headers[key]);
  });
  request.send();
});