'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import * as UserSettingsActions from 'crm_data/settings/UserSettingsActions';
import { useAvailableObjectTypes } from '../../crmObjects/hooks/useAvailableObjectTypes';
import { useHasAllScopes } from '../../rewrite/auth/hooks/useHasAllScopes';
import { useIsRewriteEnabled } from '../../rewrite/init/context/IsRewriteEnabledContext';
import { useSelectedObjectTypeDef } from '../../crmObjects/hooks/useSelectedObjectTypeDef';
import { useStoreDependency } from 'general-store';
import { useUserSetting } from '../../rewrite/userSettings/hooks/useUserSetting';
import { useUserSettingsActions } from '../../rewrite/userSettings/hooks/useUserSettingsActions';
import CustomObjectAdminCelebrationShepherdPresentational from './CustomObjectAdminCelebrationShepherdPresentational';
import { useState } from 'react';
import UserSettingsStore from 'crm_data/settings/UserSettingsStore';
import UserSettingsKeys from 'crm_data/settings/UserSettingsKeys';
export var hasAlreadySeenShepherdDep = {
  stores: [UserSettingsStore],
  deref: function deref() {
    var value = UserSettingsStore.get(UserSettingsKeys.HAS_SEEN_COBJECT_ONBOARDING_SHEPHERD);
    return value;
  }
};
export var useHasAlreadySeenShepherd = function useHasAlreadySeenShepherd() {
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useUserSetting(UserSettingsKeys.HAS_SEEN_COBJECT_ONBOARDING_SHEPHERD);
  } // eslint-disable-next-line react-hooks/rules-of-hooks


  return useStoreDependency(hasAlreadySeenShepherdDep);
};
export var useMarkHasSeenShepherd = function useMarkHasSeenShepherd() {
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var _useUserSettingsActio = useUserSettingsActions(),
        setUserSetting = _useUserSettingsActio.setUserSetting;

    return function () {
      return setUserSetting(UserSettingsKeys.HAS_SEEN_COBJECT_ONBOARDING_SHEPHERD, true);
    };
  }

  return function () {
    return UserSettingsActions.saveUserSetting(UserSettingsKeys.HAS_SEEN_COBJECT_ONBOARDING_SHEPHERD, true);
  };
};

var CustomObjectAdminCelebrationShepherd = function CustomObjectAdminCelebrationShepherd(_ref) {
  var children = _ref.children;

  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      isOpen = _useState2[0],
      setIsOpen = _useState2[1];

  var hasAlreadySeenShepherd = useHasAlreadySeenShepherd();
  var markHasSeenShepherd = useMarkHasSeenShepherd();
  var availableObjectTypes = useAvailableObjectTypes();
  var isCustomObjectAvailable = !availableObjectTypes.filter(function (typeDef) {
    return typeDef.isPortalDefined();
  }).isEmpty();
  var typeDef = useSelectedObjectTypeDef();
  var userOnStandardObjectPage = !typeDef.isPortalDefined();
  var hasAllScopes = useHasAllScopes();
  var userIsSuperAdmin = hasAllScopes('super-admin');
  var doShowShepherd = userOnStandardObjectPage && userIsSuperAdmin && isCustomObjectAvailable && !hasAlreadySeenShepherd && isOpen;

  var onClose = function onClose() {
    setIsOpen(false);
    markHasSeenShepherd();
  };

  return /*#__PURE__*/_jsx(CustomObjectAdminCelebrationShepherdPresentational, {
    isOpen: doShowShepherd,
    onClose: onClose,
    children: children
  });
};

export default CustomObjectAdminCelebrationShepherd;