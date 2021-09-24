'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import PropTypes from 'prop-types';
import { track } from 'ui-addon-upgrades/_core/common/eventTracking/tracker';
import { submitPql } from '../pql/submitPql';
import { upgradeDataPropsInterface } from '../common/data/upgradeData/interfaces/upgradeDataPropsInterface';
import { ReducedOptionsModal } from 'ui-addon-upgrades/_core/communicationMethods/ReducedOptionsModal';
import { loadAndOpenSalesChat } from '../utils/loadAndOpenSalesChat';
export var RetailModal = function RetailModal(_ref) {
  var handleIframeSizeChange = _ref.handleIframeSizeChange,
      onClose = _ref.onClose,
      upgradeData = _ref.upgradeData,
      hideBackground = _ref.hideBackground,
      ModalComponent = _ref.ModalComponent;

  var onModalView = function onModalView() {
    track('communicationMethodsInteraction', Object.assign({
      action: 'viewed retail modal'
    }, upgradeData));
    submitPql(Object.assign({}, upgradeData, {
      isRetail: true,
      isAssignable: false
    }));
  };

  var handleClickChatTrack = function handleClickChatTrack() {
    track('communicationMethodsInteraction', Object.assign({
      action: 'clicked retail chat button'
    }, upgradeData));
    loadAndOpenSalesChat({
      upgradeData: upgradeData,
      isRetail: true
    });
    onClose();
  };

  var handleClickCallTrack = function handleClickCallTrack() {
    track('communicationMethodsInteraction', Object.assign({
      action: 'clicked retail phone button'
    }, upgradeData));
  };

  return /*#__PURE__*/_jsx(ReducedOptionsModal, {
    onModalView: onModalView,
    onClickChat: handleClickChatTrack,
    onClickCall: handleClickCallTrack,
    onClose: onClose,
    isRetail: true,
    upgradeData: upgradeData,
    handleIframeSizeChange: handleIframeSizeChange,
    hideBackground: hideBackground,
    ModalComponent: ModalComponent
  });
};
RetailModal.propTypes = Object.assign({
  handleIframeSizeChange: PropTypes.func,
  hideBackground: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  ModalComponent: PropTypes.elementType
}, upgradeDataPropsInterface);