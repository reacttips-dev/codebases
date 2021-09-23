'use es6';

import { parse } from 'hub-http/helpers/params';
import once from 'transmute/once';
export var parseQueryFromLocation = once(function (location) {
  if (!location.search || !location.search.length) {
    return {};
  }

  return parse(location.search.substring(1));
});