'use es6';

import { useSelector } from 'react-redux';
import { useIsRewriteEnabled } from '../../init/context/IsRewriteEnabledContext';
import { getScopesInLegacyFormat } from '../selectors/authSelectors';
import ScopesContainer from '../../../containers/ScopesContainer';
export var useScopes = function useScopes() {
  var isRewriteEnabled = useIsRewriteEnabled();

  if (isRewriteEnabled) {
    // See https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/270 for context
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSelector(getScopesInLegacyFormat);
  }

  return ScopesContainer.get();
};