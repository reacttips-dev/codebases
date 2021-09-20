import { useMemo } from 'react';
import { ResolveResponse } from 'app/scripts/network/object-resolver-client/types';

import { SmartLinkAnalyticsContextType } from './types';

export const useSmartLinkAnalytics = (
  resolvedUrl: ResolveResponse | undefined,
  additionalContext: SmartLinkAnalyticsContextType,
) => {
  const { source, attributes, containers } = additionalContext;

  return useMemo(
    () => ({
      source,
      attributes: {
        definitionId: resolvedUrl?.meta?.definitionId,
        accessType: resolvedUrl?.meta?.requestAccess?.accessType,
        cloudId: resolvedUrl?.meta?.requestAccess?.cloudId,
        urlType: resolvedUrl?.data?.generator?.name,
        urlAccess: resolvedUrl?.meta?.access,
        ...(attributes && attributes),
        containers,
      },
    }),
    [resolvedUrl, attributes, source, containers],
  );
};
