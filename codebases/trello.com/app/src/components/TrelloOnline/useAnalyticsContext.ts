import { useState, useEffect } from 'react';
import { Analytics } from '@trello/atlassian-analytics';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { getDefaultAnalyticsContext } from './defaultAnalyticsContext/getDefaultAnalyticsContext';
import { useOrgIdFromRoute } from './useOrgIdFromRoute';
import { useMemberContextData } from './useMemberContextData';
import { useOrgContextData } from './useOrgContextData';

export const useAnalyticsContext = () => {
  const isFeatureFlagEnabled = useFeatureFlag(
    'nusku.default-attributes',
    false,
  );
  const initialRoutePath = isFeatureFlagEnabled ? window.location.pathname : '';
  const [routePath, setRoutePath] = useState(initialRoutePath);
  const updateRoutePath = () => setRoutePath(window.location.pathname);
  const orgId = useOrgIdFromRoute(routePath);
  const memberData = useMemberContextData();
  const orgData = useOrgContextData(orgId);

  useEffect(() => {
    if (!isFeatureFlagEnabled) return;
    Analytics.clearContext('organization');
    Analytics.clearContext('workspace');
  }, [isFeatureFlagEnabled, orgId]);

  useEffect(() => {
    if (!isFeatureFlagEnabled) return;
    const newContext = getDefaultAnalyticsContext({
      member: memberData?.member,
      organization: orgData?.organization,
      workspace: orgData?.organization, //we should use orgData until a workspace exists to query with GraphQL
    });
    Analytics.setContext(newContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberData?.member?.id, orgData?.organization?.id]);

  // This hook relies on @trello/history-events to polyfill the pushstate and replacestate events.
  useEffect(() => {
    if (!isFeatureFlagEnabled) {
      if (Object.keys(Analytics.defaultContext).length)
        Analytics.clearContext();
      return;
    }

    window.addEventListener('pushstate', updateRoutePath);
    window.addEventListener('replacestate', updateRoutePath);
    window.addEventListener('popstate', updateRoutePath);

    return () => {
      window.removeEventListener('pushstate', updateRoutePath);
      window.removeEventListener('replacestate', updateRoutePath);
      window.removeEventListener('popstate', updateRoutePath);
    };
  }, [isFeatureFlagEnabled]);
};
