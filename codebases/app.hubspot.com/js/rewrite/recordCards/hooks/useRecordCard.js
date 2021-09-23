'use es6';

import { crmRecordCardViewsDep } from 'crm_data/cards/CrmRecordCardViewsDep';
import { getRecordCardsDataForCurrentType } from '../selectors/recordCardsSelectors';
import { useIsRewriteEnabled } from '../../init/context/IsRewriteEnabledContext';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { useSelector } from 'react-redux';
import { useStoreDependency } from 'general-store';
import get from 'transmute/get';
export var useRecordCard = function useRecordCard(location) {
  var isRewriteEnabled = useIsRewriteEnabled();
  var objectTypeId = useSelectedObjectTypeId();

  if (isRewriteEnabled) {
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    var data = useSelector(getRecordCardsDataForCurrentType);
    return get(location, data);
  } // eslint-disable-next-line react-hooks/rules-of-hooks


  return useStoreDependency(crmRecordCardViewsDep, {
    objectType: objectTypeId
  });
};