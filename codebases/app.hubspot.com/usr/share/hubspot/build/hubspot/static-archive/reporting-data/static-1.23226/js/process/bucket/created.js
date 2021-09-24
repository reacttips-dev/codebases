'use es6';

import { List, fromJS } from 'immutable';
import invariant from '../../lib/invariant';
import { matchCreated } from '../../configure/bucket/created';

var precondition = function precondition(config) {
  var dimensions = config.get('dimensions') || List();
  invariant(matchCreated(config), "expected dimensions to be created bucket property, but got %s", dimensions);
};

export default (function (_ref) {
  var dataConfig = _ref.dataConfig,
      dataset = _ref.dataset;
  precondition(dataConfig);
  return dataset.set('dimension', fromJS({
    property: 'BUCKET_createdate_enteredCount',
    buckets: [{
      key: 'YES',
      metrics: dataset.get('metrics')
    }]
  }));
});