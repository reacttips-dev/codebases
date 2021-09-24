'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { connect } from 'react-redux';
import { useEffect } from 'react';
import throttle from 'transmute/throttle';
import * as SequenceActions from '../actions/SequenceActions';
import * as EnrollHealthStatusActions from '../actions/EnrollHealthStatusActions';
import * as ConnectedAccountsActions from '../actions/ConnectedAccountsActions';
var THROTTLE_TIMING = 100;
export default function withSequencesStatus(Component) {
  var WithSequencesStatusWrapper = function WithSequencesStatusWrapper(_ref) {
    var fetchConnectedAccounts = _ref.fetchConnectedAccounts,
        fetchEnrollHealthStatus = _ref.fetchEnrollHealthStatus,
        fetchSequencesUsage = _ref.fetchSequencesUsage,
        props = _objectWithoutProperties(_ref, ["fetchConnectedAccounts", "fetchEnrollHealthStatus", "fetchSequencesUsage"]);

    useEffect(function () {
      fetchConnectedAccounts();
    }, [fetchConnectedAccounts]);
    useEffect(function () {
      fetchEnrollHealthStatus();
    }, [fetchEnrollHealthStatus]);
    useEffect(function () {
      fetchSequencesUsage();
    }, [fetchSequencesUsage]);
    return /*#__PURE__*/_jsx(Component, Object.assign({}, props));
  };

  return connect(null, {
    fetchSequencesUsage: throttle(THROTTLE_TIMING, SequenceActions.fetchSequencesUsage),
    fetchConnectedAccounts: throttle(THROTTLE_TIMING, ConnectedAccountsActions.fetchConnectedAccounts),
    fetchEnrollHealthStatus: throttle(THROTTLE_TIMING, EnrollHealthStatusActions.fetchEnrollHealthStatus)
  })(WithSequencesStatusWrapper);
}