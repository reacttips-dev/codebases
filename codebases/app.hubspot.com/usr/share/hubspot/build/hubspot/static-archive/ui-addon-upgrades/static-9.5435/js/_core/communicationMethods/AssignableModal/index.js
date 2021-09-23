'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import { track } from 'ui-addon-upgrades/_core/common/eventTracking/tracker';
import { upgradeDataPropsInterface } from '../../common/data/upgradeData/interfaces/upgradeDataPropsInterface';
import { GetACallSection } from './GetACallSection';
import EmailModal from '../EmailModal';
import MeetingModal from '../MeetingModal';
import { StyledModal } from '../../common/components/StyledModal';
import { AssignableModalBody } from './AssignableModalBody';
import { MODAL_TYPES } from '../constants';
import { MON481_TREATMENT_KEY, MON481_GROUP_PARAMETER_OPTIONS } from '../../common/constants/experimentKeys';
import PortalIdParser from 'PortalIdParser';
import { logExposure } from 'ui-addon-upgrades/_core/utils/laboratoryClient';
import { submitPql } from '../../pql/submitPql';
var MON481_ASSIGNABLE = MODAL_TYPES.MON481_ASSIGNABLE,
    ASSIGNABLE = MODAL_TYPES.ASSIGNABLE,
    GET_A_CALL = MODAL_TYPES.GET_A_CALL,
    MEETING = MODAL_TYPES.MEETING,
    EMAIL = MODAL_TYPES.EMAIL;
export var AssignableModal = function AssignableModal(_ref) {
  var handleIframeSizeChange = _ref.handleIframeSizeChange,
      hideBackground = _ref.hideBackground,
      onClose = _ref.onClose,
      ModalComponent = _ref.ModalComponent,
      mon481Treatment = _ref.mon481Treatment,
      _overrideModalHeaderText = _ref._overrideModalHeaderText,
      _overrideCommunicationMethodKey = _ref._overrideCommunicationMethodKey,
      upgradeData = _ref.upgradeData,
      isFreeUser = _ref.isFreeUser;

  var _useState = useState(_overrideCommunicationMethodKey || ASSIGNABLE),
      _useState2 = _slicedToArray(_useState, 2),
      currentModalView = _useState2[0],
      setCurrentModalView = _useState2[1];

  useEffect(function () {
    track('communicationMethodsInteraction', Object.assign({
      action: 'viewed'
    }, upgradeData));
    submitPql(Object.assign({}, upgradeData, {
      isRetail: false,
      isAssignable: true
    }));
  }, [upgradeData]);
  useEffect(function () {
    if (currentModalView === ASSIGNABLE && mon481Treatment !== null && isFreeUser) {
      logExposure(MON481_TREATMENT_KEY, PortalIdParser.get());
    }
  }, [currentModalView, isFreeUser, mon481Treatment]);
  var commonProps = {
    hideBackground: hideBackground,
    onClose: onClose,
    upgradeData: upgradeData
  };

  if (currentModalView === MEETING) {
    return /*#__PURE__*/_jsx(MeetingModal, Object.assign({}, commonProps));
  }

  if (currentModalView === EMAIL) {
    return /*#__PURE__*/_jsx(EmailModal, Object.assign({}, commonProps));
  }

  var handleBackClick = function handleBackClick() {
    var assignableModalType = mon481Treatment === MON481_GROUP_PARAMETER_OPTIONS.variation ? MON481_ASSIGNABLE : ASSIGNABLE;
    handleIframeSizeChange(assignableModalType);
    setCurrentModalView(ASSIGNABLE);
  };

  if (!mon481Treatment) return null;
  return /*#__PURE__*/_jsxs(StyledModal, {
    ModalComponent: ModalComponent,
    "data-test-id": "communication-methods-modal",
    hideBackground: hideBackground,
    width: mon481Treatment === MON481_GROUP_PARAMETER_OPTIONS.variation && currentModalView === ASSIGNABLE ? 850 : 650,
    use: "conversational",
    children: [/*#__PURE__*/_jsx(UIDialogHeader, {
      children: /*#__PURE__*/_jsx(UIDialogCloseButton, {
        onClick: onClose
      })
    }), /*#__PURE__*/_jsx(UIDialogBody, {
      children: currentModalView === GET_A_CALL ? /*#__PURE__*/_jsx(GetACallSection, {
        onBackClick: handleBackClick,
        upgradeData: upgradeData,
        handleIframeSizeChange: handleIframeSizeChange
      }) : /*#__PURE__*/_jsx(AssignableModalBody, {
        _overrideModalHeaderText: _overrideModalHeaderText,
        setCurrentModalView: setCurrentModalView,
        upgradeData: upgradeData,
        handleIframeSizeChange: handleIframeSizeChange,
        showChatButton: mon481Treatment === MON481_GROUP_PARAMETER_OPTIONS.variation && isFreeUser,
        onClose: onClose
      })
    })]
  });
};
AssignableModal.defaultProps = {
  handleIframeSizeChange: function handleIframeSizeChange() {},
  hideBackground: false
};
AssignableModal.propTypes = Object.assign({
  handleIframeSizeChange: PropTypes.func,
  hideBackground: PropTypes.bool,
  isFreeUser: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  ModalComponent: PropTypes.elementType,
  _overrideModalHeaderText: PropTypes.string,
  _overrideCommunicationMethodKey: PropTypes.string,
  mon481Treatment: PropTypes.string
}, upgradeDataPropsInterface);