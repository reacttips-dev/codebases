'use es6';

export function extend(out) {
  var key;
  var i = 0;
  out = out || {};

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  while (i < args.length) {
    if (!args[i]) {
      i++;
      continue;
    }

    for (key in args[i]) {
      if (args[i].hasOwnProperty(key)) {
        out[key] = args[i][key];
      }
    }

    i++;
  }

  return out;
}
export function contains(list, item) {
  if (!item) {
    return false;
  }

  for (var i = 0; i < list.length; i++) {
    if (item.indexOf(list[i]) > -1) {
      return true;
    }
  }

  return false;
}
export function stringifyCookies(cookies) {
  var response = '';

  for (var cookie in cookies) {
    if (cookies.hasOwnProperty(cookie)) {
      response += cookie + "=" + cookies[cookie] + ";";
    }
  }

  return response;
}