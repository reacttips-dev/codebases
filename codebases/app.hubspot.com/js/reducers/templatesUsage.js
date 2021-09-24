'use es6';

import { FETCH_TEMPLATE_USAGE_SUCCESS, FETCH_TEMPLATE_USAGE_FAILURE } from 'SequencesUI/constants/TemplateActionTypes';
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case FETCH_TEMPLATE_USAGE_SUCCESS:
      return action.payload;

    case FETCH_TEMPLATE_USAGE_FAILURE:
      return Object.assign({}, state, {
        error: true
      });

    default:
      return state;
  }
});