import PromisePollyfill from 'promise-polyfill';
import { isBrowser } from './utils';
var local = {};

if (isBrowser) {
  local = window;
} else if (typeof self !== 'undefined') {
  local = self;
}

var Promise = 'Promise' in local ? local.Promise : PromisePollyfill;
export { Promise };