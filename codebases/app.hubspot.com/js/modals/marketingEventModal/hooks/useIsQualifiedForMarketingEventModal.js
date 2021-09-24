'use es6';

import { useStoreDependency } from 'general-store';
import { MARKETING_EVENT_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { ViewedMarketingEventConfirmModalDependency } from '../deps/ViewedMarketingEventConfirmModalDependency';
import { useIsRewriteEnabled } from '../../../rewrite/init/context/IsRewriteEnabledContext';
import { usePortalSetting } from '../../../rewrite/portalSettings/hooks/usePortalSetting';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { getPortalSettingsKeys } from '../../../rewrite/portalSettings/constants/PortalSettingsKeys';
export var useIsQualifiedForMarketingEventModal = function useIsQualifiedForMarketingEventModal() {
  var isRewriteEnabled = useIsRewriteEnabled();
  var objectTypeId = useSelectedObjectTypeId();
  var isMarketingEvent = objectTypeId === MARKETING_EVENT_TYPE_ID;

  if (isRewriteEnabled) {
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var hasSeenModal = usePortalSetting(getPortalSettingsKeys().VIEWED_MARKETING_EVENT_CONFIRM_MODAL);
    return !isMarketingEvent && !hasSeenModal;
  } // eslint-disable-next-line react-hooks/rules-of-hooks


  var hasSeenMarketingEventConfirmModal = useStoreDependency(ViewedMarketingEventConfirmModalDependency);
  return !isMarketingEvent && !hasSeenMarketingEventConfirmModal;
};