'use es6';

import { List, is } from 'immutable';
import { Promise } from '../../lib/promise';
export var SCRIPTED = 'BUCKET_createdate_enteredCount';
export var PROCESSOR = 'bucket:created';
export var matchCreated = function matchCreated(config) {
  return is(config.get('dimensions'), List.of(SCRIPTED));
};
export var configure = function configure(config) {
  return Promise.resolve(matchCreated(config) ? config.update('processors', function (context) {
    return context.push(PROCESSOR);
  }) : config);
};