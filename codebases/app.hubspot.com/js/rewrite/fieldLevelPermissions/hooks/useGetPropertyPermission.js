'use es6';

import { useStoreDependency } from 'general-store';
import { useSelector } from 'react-redux';
import { useIsRewriteEnabled } from '../../init/context/IsRewriteEnabledContext';
import { getGetPropertyPermission } from '../selectors/fieldLevelPermissionsSelectors';
import { getPropertyPermissionDependency } from '../../../crm_ui/property/fieldLevelPermissionsUIDependencies';
export var useGetPropertyPermission = function useGetPropertyPermission(objectType) {
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSelector(getGetPropertyPermission);
  } // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
  // eslint-disable-next-line react-hooks/rules-of-hooks


  return useStoreDependency(getPropertyPermissionDependency, {
    objectType: objectType
  });
};