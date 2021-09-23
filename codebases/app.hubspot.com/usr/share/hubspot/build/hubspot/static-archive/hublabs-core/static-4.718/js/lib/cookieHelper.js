'use es6';

export function getCookie(name) {
  var value = "; " + document.cookie;
  var splitCookies = value.split(';');

  for (var i = 0; i < splitCookies.length; i++) {
    var parts = splitCookies[i].split('=');

    if (parts.length === 2 && parts[0].trim() === name) {
      return parts[1];
    }
  }

  return null;
}
export function setCookie(name, value) {
  var daysActive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 30;
  var expirationDate = new Date();
  expirationDate = new Date(expirationDate.setDate(expirationDate.getDate() + daysActive));
  document.cookie = name + "=" + escape(value) + ";expires=" + expirationDate.toGMTString() + ";domain=" + location.host + ";path=/";
}