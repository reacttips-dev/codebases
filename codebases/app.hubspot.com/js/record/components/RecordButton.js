'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { OLAF, CANDY_APPLE, OBSIDIAN, BATTLESHIP, EERIE, KOALA } from 'HubStyleTokens/colors';
import PropTypes from 'prop-types';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import I18n from 'I18n';
import ConfirmStartRecordingModal from './ConfirmStartRecordingModal';
import ConfirmEndRecordingModal from './ConfirmEndRecordingModal';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';
import FormattedMessage from 'I18n/components/FormattedMessage';
var RecordingIcon = styled.div.withConfig({
  displayName: "RecordButton__RecordingIcon",
  componentId: "sc-1nc7mi-0"
})(["position:relative;border-radius:50%;border:1px solid ", ";background:", ";height:32px;width:32px;cursor:pointer;padding-left:8px;div{position:absolute;top:50%;left:50%;border:1px solid ", ";transform:translate(-7px,-7px);width:14px;height:14px;transition-duration:250ms;transition-property:border-radius,background,margin-top,height,width;transition-timing-function:ease;border-radius:50%;background-color:", ";}"], function (props) {
  return props.isRecording ? EERIE : BATTLESHIP;
}, function (props) {
  return props.isRecording ? KOALA : OLAF;
}, function (props) {
  return props.isRecording ? CANDY_APPLE : OBSIDIAN;
}, function (props) {
  return props.isRecording ? CANDY_APPLE : OBSIDIAN;
});

function RecordButton(_ref) {
  var isRecording = _ref.isRecording,
      recordingEnabled = _ref.recordingEnabled,
      onIsRecordingChange = _ref.onIsRecordingChange,
      engagementId = _ref.engagementId,
      requiresTwoPartyConsent = _ref.requiresTwoPartyConsent,
      callSid = _ref.callSid,
      appIdentifier = _ref.appIdentifier;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      showModal = _useState2[0],
      setShowModal = _useState2[1];

  var toggleRecording = useCallback(function (_ref2) {
    var shouldRecord = _ref2.shouldRecord;
    onIsRecordingChange({
      engagementId: engagementId,
      shouldRecord: shouldRecord,
      callSid: callSid
    });
    var action = shouldRecord ? 'record' : 'stop recording';
    CommunicatorLogger.log('communicatorInteraction', {
      action: action,
      activity: 'call',
      channel: 'outbound call',
      source: appIdentifier
    });
  }, [onIsRecordingChange, engagementId, callSid, appIdentifier]);
  var handleClick = useCallback(function () {
    var shouldRecord = !isRecording;

    if (requiresTwoPartyConsent || isRecording) {
      setShowModal(true);
    } else {
      toggleRecording({
        engagementId: engagementId,
        shouldRecord: shouldRecord,
        callSid: callSid
      });
    }
  }, [isRecording, requiresTwoPartyConsent, toggleRecording, engagementId, callSid]);
  var handleConfirm = useCallback(function () {
    setShowModal(false);
    toggleRecording({
      engagementId: engagementId,
      shouldRecord: !isRecording,
      callSid: callSid
    });
  }, [toggleRecording, engagementId, isRecording, callSid]);
  var handleReject = useCallback(function () {
    setShowModal(false);
  }, []);

  if (!recordingEnabled) {
    return null;
  }

  return /*#__PURE__*/_jsxs("div", {
    className: "flex-column",
    children: [/*#__PURE__*/_jsx(UITooltip, {
      title: I18n.text('calling-communicator-ui.activeCallBar.tooltips.stopRecording'),
      disabled: !isRecording,
      placement: "bottom right",
      children: /*#__PURE__*/_jsxs("div", {
        className: "flex-column align-center m-right-3",
        children: [/*#__PURE__*/_jsx(RecordingIcon, {
          "data-selenium-test": "calling-widget-recording-button",
          onClick: handleClick,
          isRecording: isRecording,
          children: /*#__PURE__*/_jsx("div", {})
        }), /*#__PURE__*/_jsx("small", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "calling-communicator-ui.activeCallBar.record"
          })
        })]
      })
    }), showModal && !isRecording && /*#__PURE__*/_jsx(ConfirmStartRecordingModal, {
      onConfirm: handleConfirm,
      onReject: handleReject
    }), showModal && isRecording && /*#__PURE__*/_jsx(ConfirmEndRecordingModal, {
      onConfirm: handleConfirm,
      onReject: handleReject
    })]
  });
}

RecordButton.propTypes = {
  isRecording: PropTypes.bool.isRequired,
  recordingEnabled: PropTypes.bool.isRequired,
  onIsRecordingChange: PropTypes.func.isRequired,
  engagementId: PropTypes.number,
  requiresTwoPartyConsent: PropTypes.bool,
  callSid: PropTypes.string,
  appIdentifier: PropTypes.string.isRequired
};
export default RecordButton;