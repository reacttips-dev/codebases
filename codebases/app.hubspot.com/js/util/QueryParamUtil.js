'use es6';

export function getQueryParam(key) {
  try {
    var queryString = window.parent.location.search;
    var paramRegex = new RegExp("(?:\\?|&)" + key + "(?:=([^&]*))?(?:&|$)");
    var result = queryString.match(paramRegex);
    return result && result[1];
  } catch (error) {
    if (error.name === 'SecurityError') {
      console.error(error);
    } else {
      throw error;
    }

    return false;
  }
}