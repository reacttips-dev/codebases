'use es6'; // frame environment

var bundleRegex = /^.*hsappstatic\.net\/feedback-web-renderer-ui\/static-(\d+\.\d+).*$/;
var bundleSrc = [].slice.call(document.getElementsByTagName('script')).map(function (el) {
  return el.src;
}).filter(function (src) {
  return bundleRegex.test(src);
})[0];
export var bundleVersion = bundleSrc ? bundleRegex.exec(bundleSrc)[1] : 'unknown';
export var isQa = !/hubspot\.com$/.test(location.host);
export var randomUtk = URL.createObjectURL(new Blob([])).slice(-36).replace(/-/g, '');
export var utk = document.location.pathname.indexOf('nps') >= 0 ? '9ad8af7d2932511253462d708b7f9fe3' : randomUtk;
export var parentUrl = location.href;