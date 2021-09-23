'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { getSetting } from 'calling-lifecycle-internal/local-settings/localSettings';
import SaveCallButtonContainer from '../containers/SaveCallButtonContainer';
import FollowUpTaskCheckmarkContainer from './FollowUpTaskCheckmarkContainer';
var FooterWrapper = styled.div.withConfig({
  displayName: "SaveFooter__FooterWrapper",
  componentId: "sc-1zzx5g-0"
})(["display:flex;align-items:flex-start;flex-direction:row;padding-bottom:0;"]);

var SaveFooter = function SaveFooter(_ref) {
  var disabled = _ref.disabled;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      shouldCreateFollowUpTask = _useState2[0],
      setShouldCreateFollowUpTask = _useState2[1];

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      rawEngagementData = _useState4[0],
      setEngagementData = _useState4[1];

  var _useState5 = useState(JSON.parse(getSetting('shouldCompleteTask', true))),
      _useState6 = _slicedToArray(_useState5, 2),
      showLongButton = _useState6[0],
      setShowLongButton = _useState6[1];

  var handleCreateTaskToggle = useCallback(function () {
    setShouldCreateFollowUpTask(!shouldCreateFollowUpTask);
  }, [shouldCreateFollowUpTask]);
  var toggleShowLongButton = useCallback(function (shouldCompleteTask) {
    setShowLongButton(shouldCompleteTask);
  }, []);
  return /*#__PURE__*/_jsxs(FooterWrapper, {
    children: [/*#__PURE__*/_jsx("div", {
      className: "p-all-3 justify-between align-center",
      children: /*#__PURE__*/_jsx(SaveCallButtonContainer, {
        disabled: disabled,
        shouldCreateFollowUpTask: shouldCreateFollowUpTask,
        rawEngagementData: rawEngagementData,
        onCompleteTaskToggle: toggleShowLongButton
      })
    }), /*#__PURE__*/_jsx(FollowUpTaskCheckmarkContainer, {
      showLongButton: showLongButton,
      disabled: disabled,
      shouldCreateFollowUpTask: shouldCreateFollowUpTask,
      handleCreateTaskToggle: handleCreateTaskToggle,
      setEngagementData: setEngagementData
    })]
  });
};

SaveFooter.displayName = 'SaveFooter';
export default SaveFooter;