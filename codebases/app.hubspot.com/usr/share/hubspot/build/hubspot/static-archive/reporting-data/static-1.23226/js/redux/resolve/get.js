'use es6';

import invariant from '../../lib/invariant';
export var getConfigId = function getConfigId(state, config) {
  return state.resolve.getIn(['configs', config], null);
};
export var getConfigStatus = function getConfigStatus(state, config) {
  var id = getConfigId(state, config);
  invariant(id != null, 'Cannot retrieve data promise of config not in store');
  return state.resolve.getIn(['resolving', id, 'status']);
};
export var getDataPromise = function getDataPromise(state, config) {
  var id = getConfigId(state, config);
  invariant(id != null, 'Cannot retrieve data promise of config not in store');
  return state.resolve.getIn(['resolving', id, 'promise']);
};