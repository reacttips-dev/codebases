'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import * as UserSettingsActions from 'crm_data/settings/UserSettingsActions';
import { getPluralForm } from '../../crmObjects/methods/getPluralForm';
import { useHasAllScopes } from '../../rewrite/auth/hooks/useHasAllScopes';
import { useIsRewriteEnabled } from '../../rewrite/init/context/IsRewriteEnabledContext';
import { useSelectedObjectTypeDef } from '../../crmObjects/hooks/useSelectedObjectTypeDef';
import { useStoreDependency } from 'general-store';
import { useUserSetting } from '../../rewrite/userSettings/hooks/useUserSetting';
import { useUserSettingsActions } from '../../rewrite/userSettings/hooks/useUserSettingsActions';
import CustomObjectAdminCelebrationModalPresentational from './CustomObjectAdminCelebrationModalPresentational';
import { useState } from 'react';
import UserSettingsStore from 'crm_data/settings/UserSettingsStore';
import UserSettingsKeys from 'crm_data/settings/UserSettingsKeys';
export var hasAlreadySeenModalDep = {
  stores: [UserSettingsStore],
  deref: function deref() {
    return UserSettingsStore.get(UserSettingsKeys.HAS_SEEN_COBJECT_ONBOARDING_MODAL);
  }
};
export var useHasAlreadySeenModal = function useHasAlreadySeenModal() {
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useUserSetting(UserSettingsKeys.HAS_SEEN_COBJECT_ONBOARDING_MODAL);
  } // eslint-disable-next-line react-hooks/rules-of-hooks


  return useStoreDependency(hasAlreadySeenModalDep);
};
export var useMarkHasSeenModal = function useMarkHasSeenModal() {
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var _useUserSettingsActio = useUserSettingsActions(),
        setUserSetting = _useUserSettingsActio.setUserSetting;

    return function () {
      return setUserSetting(UserSettingsKeys.HAS_SEEN_COBJECT_ONBOARDING_MODAL, true);
    };
  }

  return function () {
    return UserSettingsActions.saveUserSetting(UserSettingsKeys.HAS_SEEN_COBJECT_ONBOARDING_MODAL, true);
  };
};

var CustomObjectAdminCelebrationModal = function CustomObjectAdminCelebrationModal() {
  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      isOpen = _useState2[0],
      setIsOpen = _useState2[1];

  var hasAlreadySeenModal = useHasAlreadySeenModal();
  var markHasSeenModal = useMarkHasSeenModal();
  var typeDef = useSelectedObjectTypeDef();
  var userOnCobjectPage = typeDef.isPortalDefined();
  var objectNamePluralForm = getPluralForm(typeDef);
  var hasAllScopes = useHasAllScopes();
  var userIsSuperAdmin = hasAllScopes('super-admin');
  var doShowModal = userOnCobjectPage && userIsSuperAdmin && !hasAlreadySeenModal && isOpen;

  var onClose = function onClose() {
    setIsOpen(false);
    markHasSeenModal();
  };

  return /*#__PURE__*/_jsx(CustomObjectAdminCelebrationModalPresentational, {
    doShow: doShowModal,
    onClose: onClose,
    objectNamePluralForm: objectNamePluralForm
  });
};

export default CustomObjectAdminCelebrationModal;