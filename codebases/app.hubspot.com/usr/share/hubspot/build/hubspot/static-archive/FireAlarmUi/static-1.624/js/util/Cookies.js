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
export function setCookie(name, value, expire) {
  var date = new Date();
  date.setTime(date.getTime() + expire);
  var expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value + expires) + "; path=/";
}