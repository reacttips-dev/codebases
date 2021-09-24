'use es6';

import { bender } from 'legacy-hubspot-bender-context'; // import-eslint-disable-line

var staticDomainPrefix = bender.staticDomainPrefix;
export var getImageUrl = function getImageUrl(name) {
  var extension = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.svg';
  var isIE11 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return staticDomainPrefix + "/ui-images/static-2.389/optimized/" + name + (isIE11 ? '-ie11' : '') + extension;
};