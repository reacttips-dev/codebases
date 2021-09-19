const appRoot = '/marty/';

export const prependAppRoot = function(url, location = document.location) {
  if (location.pathname && location.pathname.indexOf(appRoot) === 0 && url.indexOf(appRoot) !== 0) {
    // If url starts with '/', remove it so that we don't end up with '//' in the middle.
    if (url.indexOf('/') === 0) {
      url = url.substring(1);
    }
    url = appRoot + url;
  }
  return url;
};

export const stripAppRoot = function(url) {
  if (url.indexOf(appRoot) === 0) {
    // We do length - 1 here to make sure the ending slash of appRoot is preserved at the beginning of url.
    url = url.substring(appRoot.length - 1);
  }
  return url;
};
