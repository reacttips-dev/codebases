'use es6';

import { List } from 'immutable';
import { Promise } from '../../lib/promise';
import { CONTACT_SEARCH_AGGREGATION_MAX_SIZE } from '../../constants/limits';
export var SCRIPTED = 'BUCKET_dealProgress';
export var PROPERTY = 'dealstage.probability';
export var PROCESSOR = 'bucket:dealprogress';
export var configure = function configure(config) {
  var dimensions = config.get('dimensions') || List();
  var index = dimensions.indexOf(SCRIPTED);
  return Promise.resolve(index >= 0 ? config.setIn(['dimensions', index], PROPERTY).update('processors', function () {
    var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
    return context.push(PROCESSOR);
  }).set('limit', CONTACT_SEARCH_AGGREGATION_MAX_SIZE) : config);
};