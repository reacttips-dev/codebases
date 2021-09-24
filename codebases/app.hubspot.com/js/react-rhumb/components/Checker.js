'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { NavMarker } from 'react-rhumb';
import RecordPropType from 'conversations-prop-types/prop-types/RecordPropType';
import { isSucceeded, isFailed } from 'conversations-async-data/async-data/operators/statusComparators';

var Checker = function Checker(_ref) {
  var startOpen = _ref.startOpen,
      widgetDataAsyncData = _ref.widgetDataAsyncData,
      threadsAsyncData = _ref.threadsAsyncData;
  var requestsToCheck = [widgetDataAsyncData];

  if (startOpen) {
    requestsToCheck.push(threadsAsyncData);
  }

  var anyFailed = requestsToCheck.some(function (asyncData) {
    return isFailed(asyncData);
  });
  var allSucceeded = requestsToCheck.every(function (asyncData) {
    return isSucceeded(asyncData);
  });

  if (anyFailed) {
    return /*#__PURE__*/_jsx(NavMarker, {
      name: "VISITOR_ERROR"
    });
  } else if (allSucceeded) {
    return /*#__PURE__*/_jsx(NavMarker, {
      name: "VISITOR_SUCCESS"
    });
  } else {
    return null;
  }
};

Checker.propTypes = {
  startOpen: PropTypes.bool,
  threadsAsyncData: RecordPropType('AsyncData').isRequired,
  widgetDataAsyncData: RecordPropType('AsyncData').isRequired
};
export default Checker;