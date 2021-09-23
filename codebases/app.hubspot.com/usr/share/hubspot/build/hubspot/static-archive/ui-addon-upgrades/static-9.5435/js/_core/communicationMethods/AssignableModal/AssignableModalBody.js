'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { track } from '../../common/eventTracking/tracker';
import H1 from 'UIComponents/elements/headings/H1';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UISelectableButton from 'UIComponents/button/UISelectableButton';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIIllustration from 'UIComponents/image/UIIllustration';
import { upgradeDataPropsInterface } from '../../common/data/upgradeData/interfaces/upgradeDataPropsInterface';
import H6 from 'UIComponents/elements/headings/H6';
import { MODAL_TYPES } from '../constants';
import { loadAndOpenSalesChat } from '../../utils/loadAndOpenSalesChat';
var GET_A_CALL = MODAL_TYPES.GET_A_CALL,
    MEETING = MODAL_TYPES.MEETING,
    EMAIL = MODAL_TYPES.EMAIL;
export var AssignableModalBody = function AssignableModalBody(_ref) {
  var _overrideModalHeaderText = _ref._overrideModalHeaderText,
      handleIframeSizeChange = _ref.handleIframeSizeChange,
      setCurrentModalView = _ref.setCurrentModalView,
      showChatButton = _ref.showChatButton,
      upgradeData = _ref.upgradeData,
      onClose = _ref.onClose;

  var handleClick = function handleClick(communicationKey, trackingAction) {
    track('communicationMethodsInteraction', Object.assign({
      action: trackingAction
    }, upgradeData));
    handleIframeSizeChange(communicationKey);
    setCurrentModalView(communicationKey);
  };

  var handleClickChat = function handleClickChat() {
    loadAndOpenSalesChat({
      upgradeData: upgradeData,
      isRetail: false,
      isAssignable: true
    });
    track('communicationMethodsInteraction', Object.assign({
      action: 'clicked chat with us'
    }, upgradeData));
    onClose();
  };

  return /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsx(H1, {
      className: "m-bottom-8",
      children: _overrideModalHeaderText || /*#__PURE__*/_jsx(FormattedMessage, {
        message: "upgrades.communicationMethods.title"
      })
    }), /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsxs(UIFlex, {
        justify: "center",
        children: [/*#__PURE__*/_jsx(UISelectableButton, {
          "data-test-id": "communication-method-call",
          size: "large",
          onClick: function onClick() {
            return handleClick(GET_A_CALL, 'clicked contact sales with phone call');
          },
          textLabel: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "upgrades.communicationMethods.call"
          }),
          children: /*#__PURE__*/_jsx(UIIllustration, {
            name: "calling-small",
            height: 75
          })
        }), /*#__PURE__*/_jsx(UISelectableButton, {
          "data-test-id": "communication-method-meeting",
          size: "large",
          onClick: function onClick() {
            return handleClick(MEETING, 'clicked contact sales with meeting');
          },
          textLabel: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "upgrades.communicationMethods.meeting"
          }),
          children: /*#__PURE__*/_jsx(UIIllustration, {
            name: "meetings-small",
            height: 75
          })
        }), /*#__PURE__*/_jsx(UISelectableButton, {
          "data-test-id": "communication-method-email",
          size: "large",
          onClick: function onClick() {
            return handleClick(EMAIL, 'clicked send email');
          },
          textLabel: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "upgrades.communicationMethods.email"
          }),
          children: /*#__PURE__*/_jsx(UIIllustration, {
            name: "successfully-connected-email",
            height: 75
          })
        }), showChatButton && /*#__PURE__*/_jsx(UISelectableButton, {
          "data-test-id": "communication-method-chat",
          size: "large",
          selected: false,
          textLabel: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "upgrades.communicationMethods.chatWithUs"
          }),
          onClick: handleClickChat,
          children: /*#__PURE__*/_jsx(UIIllustration, {
            name: "contacts-chat",
            height: 75
          })
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "text-left m-top-9",
        children: [/*#__PURE__*/_jsx(H6, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "upgrades.communicationMethods.footer.header"
          })
        }), /*#__PURE__*/_jsx("p", {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "upgrades.communicationMethods.footer.body"
          })
        })]
      })]
    })]
  });
};
AssignableModalBody.propTypes = Object.assign({
  _overrideModalHeaderText: PropTypes.string,
  handleIframeSizeChange: PropTypes.func.isRequired,
  setCurrentModalView: PropTypes.func.isRequired,
  showChatButton: PropTypes.bool.isRequired
}, upgradeDataPropsInterface);