'use es6';

export default (function (value) {
  // codes from https://www.ascii.cl/htmlcodes.htm
  return value ? String(value).replace(/<\/?[^>]+(>|$)/g, '').replace(/&nbsp;/g, ' ').replace(/&#x27;/g, "'").replace(/&#8230;/g, '…').replace(/&quot;/g, '"').replace(/&amp;/g, '&') : '';
});