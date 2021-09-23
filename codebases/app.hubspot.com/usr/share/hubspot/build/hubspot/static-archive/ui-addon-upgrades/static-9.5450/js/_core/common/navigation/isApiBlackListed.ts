export var isApiBlackListed = function isApiBlackListed() {
  return window.location.href.indexOf('sales-iframes') !== -1 || window.location.origin === 'https://preview.hs-sites.com' || window.location.origin === 'https://preview.hs-sitesqa.com';
};