'use es6';

import Immutable from 'immutable';
import { search } from '../api/Shutterstock';
import * as ActionTypes from './ActionTypes';
export function searchShutterstock(options) {
  var query = Immutable.Map(options);
  return function (dispatch) {
    if (query.get('searchQuery') === '') {
      dispatch({
        type: ActionTypes.SEARCH_SHUTTERSTOCK_RESET
      });
      return;
    }

    dispatch({
      type: ActionTypes.SEARCH_SHUTTERSTOCK_ATTEMPTED,
      page: query.get('page'),
      pageSize: query.get('pageSize'),
      query: query
    });
    search(options).then(function (response) {
      dispatch({
        type: ActionTypes.SEARCH_SHUTTERSTOCK_SUCCEEDED,
        data: response,
        page: query.get('page'),
        query: query
      });
    }, function (error) {
      dispatch({
        type: ActionTypes.SEARCH_SHUTTERSTOCK_FAILED,
        page: query.get('page'),
        error: error,
        query: query
      });
    }).done();
  };
}