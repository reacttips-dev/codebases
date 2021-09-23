'use es6';

import { VIEWED_MARKETING_EVENT_CONFIRM_MODAL } from 'crm_data/constants/PortalSettingsKeys';
import SettingsActions from '../../../crm_ui/legacy/flux/settings/SettingsActions';
import { useIsRewriteEnabled } from '../../../rewrite/init/context/IsRewriteEnabledContext';
import { usePortalSettingsActions } from '../../../rewrite/portalSettings/hooks/usePortalSettingsActions';
export var useSetSeenMEConfirmModalSetting = function useSetSeenMEConfirmModalSetting() {
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var _usePortalSettingsAct = usePortalSettingsActions(),
        setPortalSetting = _usePortalSettingsAct.setPortalSetting;

    return function () {
      setPortalSetting(VIEWED_MARKETING_EVENT_CONFIRM_MODAL, true);
    };
  }

  var setSeenMEConfirmModalSetting = function setSeenMEConfirmModalSetting() {
    SettingsActions.set(VIEWED_MARKETING_EVENT_CONFIRM_MODAL, 'true');
  };

  return setSeenMEConfirmModalSetting;
};