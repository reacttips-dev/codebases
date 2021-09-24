'use es6';

import { parse } from 'hub-http/helpers/params';
export default (function () {
  return parse(window.location.search.replace('?', '').replace(/\+/g, ' '));
});