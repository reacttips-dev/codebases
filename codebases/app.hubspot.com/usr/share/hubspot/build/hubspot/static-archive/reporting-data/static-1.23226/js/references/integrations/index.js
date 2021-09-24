'use es6';

import { Map as ImmutableMap } from 'immutable';
import { makeOption } from '../Option';
import { STATIC_INTEGRATION_DATA } from './staticIntegrationData';
var options = ImmutableMap(STATIC_INTEGRATION_DATA).map(function (value, key) {
  return makeOption(key, value);
});
export default (function () {
  return Promise.resolve(options);
});