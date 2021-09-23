'use es6';

import UrlParts from './parts/UrlParts';
var DOMAIN_REGEX = new RegExp("^" + UrlParts.domain + "$", 'i');
export default DOMAIN_REGEX;