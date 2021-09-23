'use es6';

var truncate = function truncate() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 256;
  var truncated = str;

  if (truncated.length > limit) {
    truncated = truncated.substr(0, limit);
    truncated = truncated + "[..]";
  }

  return truncated;
};

export var convertToTrackingUrl = function convertToTrackingUrl() {
  var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var cleaned = url;

  try {
    // remove query strings & anchors
    cleaned = cleaned.split('?')[0].split('#')[0]; // replace all ids & guids used as route params

    var parts = cleaned.split('/');
    var routeParts = parts.map(function (route) {
      if (/\d/.test(route)) {
        return '*';
      }

      return route;
    });
    cleaned = routeParts.join('/'); // remove trailing slashes

    if (cleaned.charAt(cleaned.length - 1) === '/') {
      cleaned = cleaned.substr(0, cleaned.length - 1);
    } // truncate lengthy urls


    cleaned = truncate(cleaned, 256);
  } catch (err) {
    cleaned = 'parsing error';
  }

  return cleaned;
};