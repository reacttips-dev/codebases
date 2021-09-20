import { useEffect, useState } from 'react';

import { useSharedState } from '@trello/shared-state';

import { smartCardClient } from 'app/scripts/network/smart-card-client';
import { ResolveResponse } from 'app/scripts/network/object-resolver-client/types';

// This is hacky way to re-render the Smart Cards after the user has completed the authorization
// flow for a provider. This can go away when @atlaskit/smart-card supports a singleton store prop
export const useAkSmartCardProviderRefresh = (
  resolvedUrl: ResolveResponse | undefined,
) => {
  const [authorizedProviders] = useSharedState(
    smartCardClient.authorizedProviders,
  );

  const [akSmartCardProviderKey, setAkSmartCardProviderKey] = useState(
    new Date().getTime(),
  );

  const definitionId = resolvedUrl?.meta?.definitionId;
  const shouldSetAkSmartCardProviderKey = !!(
    definitionId && authorizedProviders.has(definitionId)
  );

  useEffect(() => {
    if (shouldSetAkSmartCardProviderKey) {
      setAkSmartCardProviderKey(new Date().getTime());
    }
  }, [shouldSetAkSmartCardProviderKey]);

  return akSmartCardProviderKey;
};
