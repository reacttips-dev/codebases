'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { upgradeDataPropsInterface } from '../common/data/upgradeData/interfaces/upgradeDataPropsInterface';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import { EERIE, GYPSUM } from 'HubStyleTokens/colors';
import { track } from '../common/eventTracking/tracker';
import { getInlineMeetingParams } from '../common/api/meetingHelpers';
import { StyledModal } from '../common/components/StyledModal';
var TRUSTED_DOMAINS = ['https://www.hubspot.com', 'https://hubspot.com', 'https://app.hubspot.com', 'https://meetings.hubspot.com', 'https://meetings.hubspotqa.com'];

var MeetingModal = function MeetingModal(_ref) {
  var hideBackground = _ref.hideBackground,
      onClose = _ref.onClose,
      upgradeData = _ref.upgradeData;
  var linkBase = upgradeData.repInfo.link;
  var meetingLink = linkBase + "?" + getInlineMeetingParams(upgradeData);
  useEffect(function () {
    track('communicationMethodsInteraction', Object.assign({
      action: 'shown booking page',
      meetingLink: meetingLink
    }, upgradeData));

    var handleMessages = function handleMessages(e) {
      var isKnownOrigin = TRUSTED_DOMAINS.includes(e.origin);
      if (!isKnownOrigin) return;

      if (e.data.meetingBookSucceeded) {
        track('communicationMethodsInteraction', Object.assign({
          action: 'meeting booked successfully',
          meetingLink: meetingLink
        }, upgradeData));
      }
    };

    window.addEventListener('message', handleMessages);
    return function () {
      return window.removeEventListener('message', handleMessages);
    };
  }, [upgradeData, meetingLink]);
  return /*#__PURE__*/_jsxs(StyledModal, {
    "data-test-id": "meeting-modal",
    use: "conversational",
    width: 900,
    hideBackground: hideBackground,
    children: [/*#__PURE__*/_jsx(UIDialogHeader, {
      style: {
        backgroundColor: GYPSUM
      },
      children: /*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: onClose,
        color: EERIE
      })
    }), /*#__PURE__*/_jsx("div", {
      style: {
        backgroundColor: GYPSUM,
        paddingTop: '64px'
      },
      children: /*#__PURE__*/_jsx("iframe", {
        id: "meetingModal",
        "data-test-id": "tts-modal",
        width: "900",
        height: "800",
        src: meetingLink,
        style: {
          border: '0px'
        }
      })
    })]
  });
};

MeetingModal.defaultProps = {
  hideBackground: false
};
MeetingModal.propTypes = Object.assign({
  hideBackground: PropTypes.bool,
  onClose: PropTypes.func.isRequired
}, upgradeDataPropsInterface);
export default MeetingModal;