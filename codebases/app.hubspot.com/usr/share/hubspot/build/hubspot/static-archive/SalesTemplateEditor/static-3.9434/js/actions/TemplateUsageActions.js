'use es6';

import createAction from './createAction';
import * as TemplateUsageApi from 'SalesTemplateEditor/api/TemplateUsageApi';
import ActionTypes from 'SalesTemplateEditor/constants/ActionTypes';
export var fetchTemplateUsage = function fetchTemplateUsage() {
  return function (dispatch) {
    return TemplateUsageApi.fetchTemplateUsage().then(function (usage) {
      return dispatch(createAction(ActionTypes.FETCH_USAGE_SUCCESS, usage));
    });
  };
};