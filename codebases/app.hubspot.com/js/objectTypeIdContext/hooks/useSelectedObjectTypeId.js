'use es6';

import { useSelector } from 'react-redux';
import { useIsRewriteEnabled } from '../../rewrite/init/context/IsRewriteEnabledContext';
import { getCurrentObjectTypeId } from '../../rewrite/init/selectors/routerStateSelectors';
import { useObjectTypeIdContext } from '../context/ObjectTypeIdContext';
export var useSelectedObjectTypeId = function useSelectedObjectTypeId() {
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSelector(getCurrentObjectTypeId);
  } // eslint-disable-next-line react-hooks/rules-of-hooks


  var _useObjectTypeIdConte = useObjectTypeIdContext(),
      metaId = _useObjectTypeIdConte.metaId,
      objectId = _useObjectTypeIdConte.objectId;

  return metaId + "-" + objectId;
};