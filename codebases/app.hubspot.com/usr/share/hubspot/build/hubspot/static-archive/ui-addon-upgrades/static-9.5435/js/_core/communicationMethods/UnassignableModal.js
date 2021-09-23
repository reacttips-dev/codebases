'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import PropTypes from 'prop-types';
import { track } from 'ui-addon-upgrades/_core/common/eventTracking/tracker';
import { upgradeDataPropsInterface } from '../common/data/upgradeData/interfaces/upgradeDataPropsInterface';
import { loadAndOpenSalesChat } from '../utils/loadAndOpenSalesChat';
import { submitPql } from '../pql/submitPql';
import { ReducedOptionsModal } from 'ui-addon-upgrades/_core/communicationMethods/ReducedOptionsModal';

var UnassignableModal = function UnassignableModal(_ref) {
  var handleIframeSizeChange = _ref.handleIframeSizeChange,
      onClose = _ref.onClose,
      upgradeData = _ref.upgradeData,
      hideBackground = _ref.hideBackground,
      ModalComponent = _ref.ModalComponent;

  var onModalView = function onModalView() {
    track('communicationMethodsInteraction', Object.assign({
      action: 'viewed unassignable modal'
    }, upgradeData));
    submitPql(Object.assign({}, upgradeData, {
      isRetail: false,
      isAssignable: false
    }));
  };

  var handleClickChatTrack = function handleClickChatTrack() {
    track('communicationMethodsInteraction', Object.assign({
      action: 'clicked unassignable chat button'
    }, upgradeData));
    loadAndOpenSalesChat({
      upgradeData: upgradeData,
      isRetail: false
    });
    onClose();
  };

  var handleClickCallTrack = function handleClickCallTrack() {
    track('communicationMethodsInteraction', Object.assign({
      action: 'clicked unassignable phone button'
    }, upgradeData));
  };

  return /*#__PURE__*/_jsx(ReducedOptionsModal, {
    onModalView: onModalView,
    onClickChat: handleClickChatTrack,
    onClickCall: handleClickCallTrack,
    onClose: onClose,
    isRetail: false,
    upgradeData: upgradeData,
    handleIframeSizeChange: handleIframeSizeChange,
    hideBackground: hideBackground,
    ModalComponent: ModalComponent
  });
};

UnassignableModal.propTypes = Object.assign({
  handleIframeSizeChange: PropTypes.func,
  hideBackground: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  ModalComponent: PropTypes.elementType
}, upgradeDataPropsInterface);
export default UnassignableModal;