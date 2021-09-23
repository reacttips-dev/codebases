'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useContext, useCallback, useState } from 'react';
import UIIconCircle from 'UIComponents/icon/UIIconCircle';
import UIButton from 'UIComponents/button/UIButton';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { OLAF, OBSIDIAN, KOALA, EERIE, BATTLESHIP } from 'HubStyleTokens/colors';
import CallClientContext from 'calling-client-interface/context/CallClientContext';
import { CALL_FROM_PHONE, CALL_FROM_BROWSER } from 'calling-lifecycle-internal/constants/CallMethods';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';

function MuteButton(_ref) {
  var selectedCallMethod = _ref.selectedCallMethod,
      appIdentifier = _ref.appIdentifier;
  var callClient = useContext(CallClientContext);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isMuted = _useState2[0],
      setIsMuted = _useState2[1];

  var handleMutePress = useCallback(function () {
    var action = isMuted ? 'unmute' : 'mute';
    CommunicatorLogger.log('communicatorInteraction', {
      action: action,
      activity: 'call',
      channel: 'outbound call',
      source: appIdentifier
    });
    callClient.mute(!isMuted);
    setIsMuted(!isMuted);
  }, [callClient, isMuted, appIdentifier]);
  var backgroundColor = isMuted ? KOALA : OLAF;
  var borderColor = isMuted ? EERIE : BATTLESHIP;

  if (selectedCallMethod === CALL_FROM_PHONE) {
    return null;
  }

  return /*#__PURE__*/_jsxs("div", {
    className: "flex-column align-center m-right-3",
    children: [/*#__PURE__*/_jsx(UIButton, {
      onClick: handleMutePress,
      use: "unstyled",
      "data-selenium-test": "calling-widget-mute-button",
      children: /*#__PURE__*/_jsx(UIIconCircle, {
        name: isMuted ? 'stopRecord' : 'record',
        color: OBSIDIAN,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        padding: 0.3,
        size: 16
      })
    }), /*#__PURE__*/_jsx("small", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "calling-communicator-ui.activeCallBar.mute"
      })
    })]
  });
}

MuteButton.propTypes = {
  selectedCallMethod: PropTypes.oneOf([CALL_FROM_PHONE, CALL_FROM_BROWSER]).isRequired,
  appIdentifier: PropTypes.string.isRequired
};
export default MuteButton;