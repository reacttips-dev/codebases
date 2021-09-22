// DEPRECATED
const supports = {};

const prefix = 'supports-';

if (document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1')) {
  document.documentElement.className = prefix + 'svg';
  supports.svg = true;
}

// Adapted from https://github.com/Modernizr/Modernizr/commit/af674f233d762d492ff777c9f4d24bf4999ad4b7#feature-detects/cors.js
if (
  !!(window.XMLHttpRequest && 'withCredentials' in new window.XMLHttpRequest()) &&
  navigator.userAgent.indexOf('MSIE 10.0') < 0
) {
  supports.cors = true;
}

const userAgent = navigator.userAgent.toLowerCase();
if (/safari/.test(userAgent) && !/chrome/.test(userAgent)) {
  supports.accepts = false;
} else {
  supports.accepts = true;
}

export default supports;
