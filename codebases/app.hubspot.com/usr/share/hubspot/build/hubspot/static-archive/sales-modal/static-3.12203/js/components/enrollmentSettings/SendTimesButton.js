'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { EERIE } from 'HubStyleTokens/colors';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';

var SendTimesButton = function SendTimesButton(_ref) {
  var toggleOpen = _ref.toggleOpen;
  return /*#__PURE__*/_jsx(UIFlex, {
    className: "sequence-enroll-modal-send-times",
    align: "center",
    children: /*#__PURE__*/_jsxs(UIButton, {
      "data-test-id": "sequence-settings-toggle-button",
      use: "transparent",
      className: "p-all-0",
      onClick: toggleOpen,
      children: [/*#__PURE__*/_jsx(FormattedMessage, {
        message: "enrollModal.sendTimes.settings"
      }), /*#__PURE__*/_jsx(UIIcon, {
        name: "downCarat",
        color: EERIE,
        size: 10
      })]
    })
  });
};

SendTimesButton.propTypes = {
  toggleOpen: PropTypes.func.isRequired
};
export default SendTimesButton;