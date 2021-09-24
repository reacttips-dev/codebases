'use es6';

import { useSelector } from 'react-redux';
import { useIsRewriteEnabled } from '../../init/context/IsRewriteEnabledContext';
import { getGatesInLegacyFormat } from '../selectors/authSelectors';
import PortalStore from 'crm_data/portal/PortalStore';
import { useStoreDependency } from 'general-store';
export var useGates = function useGates() {
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSelector(getGatesInLegacyFormat);
  } // eslint-disable-next-line react-hooks/rules-of-hooks


  return useStoreDependency({
    stores: [PortalStore],
    deref: function deref() {
      return PortalStore.get().enabled_gates;
    }
  });
};