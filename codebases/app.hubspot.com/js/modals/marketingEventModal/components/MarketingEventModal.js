'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { useIsQualifiedForMarketingEventModal } from '../hooks/useIsQualifiedForMarketingEventModal';
import { useSetSeenMEConfirmModalSetting } from '../hooks/useSetSeenMEConfirmModalSetting';
import { MarketingEventModalPresentational } from './MarketingEventModalPresentational';
import { useHasAllScopes } from '../../../rewrite/auth/hooks/useHasAllScopes';
export var MarketingEventModal = function MarketingEventModal(_ref) {
  var onConfirm = _ref.onConfirm,
      onDeny = _ref.onDeny;
  var isQualifiedForMarketingEventModal = useIsQualifiedForMarketingEventModal();
  var setSeenMEConfirmModalSetting = useSetSeenMEConfirmModalSetting();

  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      isOpen = _useState2[0],
      setIsOpen = _useState2[1];

  var hasAllScopes = useHasAllScopes();
  var isAdmin = hasAllScopes('super-admin');

  var closeModal = function closeModal() {
    setIsOpen(false);
  };

  var confirm = function confirm() {
    closeModal();
    setSeenMEConfirmModalSetting();
    CrmLogger.log('marketingEventsOptInModal', {
      action: 'object added'
    });
    onConfirm();
  };

  var deny = function deny() {
    closeModal();
    CrmLogger.log('marketingEventsOptInModal', {
      action: 'object rejected'
    });
    onDeny();
  };

  useEffect(function () {
    if (!isQualifiedForMarketingEventModal) {
      // if we dont want to show the modal, call onConfirm so the parent
      // doesnt wait around for a button that doesnt exist to get clicked
      onConfirm();
    }
  }, [isQualifiedForMarketingEventModal, onConfirm]);
  return isQualifiedForMarketingEventModal && isOpen ? /*#__PURE__*/_jsx(MarketingEventModalPresentational, {
    deny: deny,
    isAdmin: isAdmin,
    confirm: confirm
  }) : null;
};
MarketingEventModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onDeny: PropTypes.func.isRequired
};