'use es6';

import { useSelector } from 'react-redux';
import { useIsRewriteEnabled } from '../../init/context/IsRewriteEnabledContext';
import { getHasAllGates } from '../selectors/authSelectors';
import { hasAllGates } from '../../../extensions/utils/hasAllGates';
export var useHasAllGates = function useHasAllGates() {
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSelector(getHasAllGates);
  }

  return hasAllGates;
};