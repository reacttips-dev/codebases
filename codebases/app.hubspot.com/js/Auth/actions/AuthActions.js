'use es6';

import PortalIdParser from 'PortalIdParser';
import userInfo from 'hub-http/userInfo';
import { INITIALIZE_AUTH } from './ActionTypes';
import { getGatesFromStorage } from 'calling-lifecycle-internal/utils/getLocalCallSettings';
export var getAuth = function getAuth() {
  return function (dispatch) {
    PortalIdParser.get();
    return userInfo().then(function (_ref) {
      var user = _ref.user,
          gates = _ref.gates,
          portal = _ref.portal;
      var allGates = (gates || []).concat(getGatesFromStorage());
      dispatch({
        type: INITIALIZE_AUTH,
        user: user,
        gates: allGates,
        portal: portal
      });
    });
  };
};