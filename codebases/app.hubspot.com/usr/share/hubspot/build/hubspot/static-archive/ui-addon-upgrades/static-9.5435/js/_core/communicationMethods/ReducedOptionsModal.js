'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import React, { useState, Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UISelectableButton from 'UIComponents/button/UISelectableButton';
import UIIllustration from 'UIComponents/image/UIIllustration';
import { track } from 'ui-addon-upgrades/_core/common/eventTracking/tracker';
import Small from 'UIComponents/elements/Small';
import UIButton from 'UIComponents/button/UIButton';
import getSalesPhoneNumber from 'ui-addon-upgrades/_core/common/adapters/getSalesPhoneNumber';
import H2 from 'UIComponents/elements/headings/H2';
import H4 from 'UIComponents/elements/headings/H4';
import { upgradeDataPropsInterface } from '../common/data/upgradeData/interfaces/upgradeDataPropsInterface';
import { StyledModal } from '../common/components/StyledModal';
import { MODAL_TYPES } from './constants';
import UIModal from 'UIComponents/dialog/UIModal';
export var ReducedOptionsModal = function ReducedOptionsModal(_ref) {
  var handleIframeSizeChange = _ref.handleIframeSizeChange,
      hideBackground = _ref.hideBackground,
      onClose = _ref.onClose,
      upgradeData = _ref.upgradeData,
      ModalComponent = _ref.ModalComponent,
      onModalView = _ref.onModalView,
      onClickChat = _ref.onClickChat,
      onClickCall = _ref.onClickCall;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isCallSectionVisible = _useState2[0],
      setIsCallSectionVisible = _useState2[1];

  useEffect(function () {
    onModalView();
  }, [onModalView]);

  var handleChatBackButtonClick = function handleChatBackButtonClick() {
    track('communicationMethodsInteraction', Object.assign({
      action: 'clicked unassignable phone back button'
    }, upgradeData));
    handleIframeSizeChange(MODAL_TYPES.UNASSIGNABLE);
    setIsCallSectionVisible(false);
  };

  var handleClickCall = function handleClickCall() {
    onClickCall();
    handleIframeSizeChange(MODAL_TYPES.CALL_US);
    setIsCallSectionVisible(true);
  };

  var _getSalesPhoneNumber = getSalesPhoneNumber(),
      phoneNumber = _getSalesPhoneNumber.phoneNumber,
      countryCode = _getSalesPhoneNumber.countryCode;

  return /*#__PURE__*/_jsx(StyledModal, {
    ModalComponent: ModalComponent,
    hideBackground: hideBackground,
    width: 550,
    use: "conversational",
    "data-test-id": isCallSectionVisible ? 'unassignable-selected-method-call' : 'unassignable-communication-methods-modal',
    children: isCallSectionVisible ? /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
        children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
          onClick: onClose
        }), /*#__PURE__*/_jsx(H2, {
          className: "m-bottom-8",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "upgrades.communicationMethods.callSales"
          })
        })]
      }), /*#__PURE__*/_jsxs(UIDialogBody, {
        className: "p-bottom-10",
        children: [/*#__PURE__*/_jsxs("div", {
          className: "communication-call-submit-success",
          children: [/*#__PURE__*/_jsx(H4, {
            className: "m-bottom-0",
            children: phoneNumber
          }), /*#__PURE__*/_jsx(Small, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "SharedI18nStrings.countryCodes." + countryCode
            })
          })]
        }), /*#__PURE__*/_jsx(UIButton, {
          className: "m-top-8",
          onClick: handleChatBackButtonClick,
          use: "link",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "upgrades.communicationMethods.backButton"
          })
        })]
      })]
    }) : /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
        children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
          onClick: onClose
        }), /*#__PURE__*/_jsx(H2, {
          className: "m-bottom-8",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "upgrades.communicationMethods.title"
          })
        })]
      }), /*#__PURE__*/_jsx(UIDialogBody, {
        className: "p-bottom-10",
        children: /*#__PURE__*/_jsx(UIFlex, {
          justify: "center",
          children: /*#__PURE__*/_jsxs(UIFlex, {
            justify: "center",
            style: {
              width: '100%'
            },
            children: [/*#__PURE__*/_jsx(UISelectableButton, {
              "data-test-id": "unassignable-call",
              size: "large",
              textLabel: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "upgrades.communicationMethods.callUs"
              }),
              onClick: handleClickCall,
              children: /*#__PURE__*/_jsx(UIIllustration, {
                name: "calling-small",
                height: 75
              })
            }), /*#__PURE__*/_jsx(UISelectableButton, {
              "data-test-id": "unassignable-chat",
              selected: false,
              size: "large",
              textLabel: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "upgrades.communicationMethods.chatWithUs"
              }),
              onClick: onClickChat,
              children: /*#__PURE__*/_jsx(UIIllustration, {
                name: "contacts-chat",
                height: 75
              })
            })]
          })
        })
      })]
    })
  });
};
ReducedOptionsModal.defaultProps = {
  handleIframeSizeChange: function handleIframeSizeChange() {},
  hideBackground: false,
  ModalComponent: UIModal
};
ReducedOptionsModal.propTypes = Object.assign({
  handleIframeSizeChange: PropTypes.func,
  hideBackground: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  ModalComponent: PropTypes.elementType,
  onModalView: PropTypes.func,
  onClickChat: PropTypes.func,
  onClickCall: PropTypes.func
}, upgradeDataPropsInterface);