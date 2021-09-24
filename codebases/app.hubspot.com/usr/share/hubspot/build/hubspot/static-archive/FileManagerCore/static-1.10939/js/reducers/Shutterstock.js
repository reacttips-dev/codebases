'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import * as ActionTypes from '../actions/ActionTypes';
import { RequestStatus } from '../Constants';
var defaultState = ImmutableMap({
  results: new List(),
  total: 0,
  query: ImmutableMap({
    page: 1
  }),
  searchStatus: RequestStatus.UNINITIALIZED,
  acquireStatus: RequestStatus.UNINITIALIZED
});
export default function getShutterstockReducer(_ref) {
  var concatenateResults = _ref.concatenateResults;
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    var type = action.type,
        data = action.data,
        query = action.query;

    switch (type) {
      case ActionTypes.RESET_PAGE:
      case ActionTypes.SEARCH_SHUTTERSTOCK_RESET:
        return defaultState;

      case ActionTypes.SEARCH_SHUTTERSTOCK_FAILED:
        return state.set('searchStatus', RequestStatus.FAILED);

      case ActionTypes.SEARCH_SHUTTERSTOCK_ATTEMPTED:
        return state.merge({
          searchStatus: RequestStatus.PENDING,
          query: query
        });

      case ActionTypes.SEARCH_SHUTTERSTOCK_SUCCEEDED:
        if (query.get('searchQuery') !== state.getIn(['query', 'searchQuery'])) {
          return state;
        }

        return state.merge({
          results: concatenateResults ? state.get('results').concat(data.get('results')) : data.get('results'),
          total: data.get('resultCount'),
          searchStatus: RequestStatus.SUCCEEDED,
          query: query
        });

      case ActionTypes.ACQUIRE_IMAGE_FAILED:
        return state.merge({
          acquireStatus: RequestStatus.FAILED
        });

      case ActionTypes.ACQUIRE_IMAGE_ATTEMPTED:
        return state.merge({
          acquireStatus: RequestStatus.PENDING
        });

      case ActionTypes.ACQUIRE_IMAGE_SUCCEEDED:
        return state.merge({
          acquireStatus: RequestStatus.SUCCEEDED
        });

      default:
        return state;
    }
  };
}