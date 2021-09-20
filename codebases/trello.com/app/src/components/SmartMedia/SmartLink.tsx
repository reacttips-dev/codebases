import React, { useState, useCallback, useMemo, useEffect } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { useSharedState } from '@trello/shared-state';

import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { ResolveResponse } from 'app/scripts/network/object-resolver-client/types';
import { smartCardClient } from 'app/scripts/network/smart-card-client';
import { useFeatureFlag } from '@trello/feature-flag-client';

import {
  AkSmartCardWithProvider,
  AkSmartCardProps,
} from './AkSmartCardWithProvider';
import { SmartLinkAnalyticsContextType } from './types';

interface Props {
  url: string;
  plainLink: () => JSX.Element;
  analyticsContext: SmartLinkAnalyticsContextType;
}

const withErrorBoundary = (Component: React.FunctionComponent<Props>) => (
  props: Props,
) => {
  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-workflowers',
        feature: Feature.SmartLink,
      }}
      errorHandlerComponent={props.plainLink}
    >
      <Component {...props} />
    </ErrorBoundary>
  );
};

// eslint-disable-next-line @trello/no-module-logic
export const SmartLink = withErrorBoundary(
  ({ url, plainLink, analyticsContext }: Props) => {
    const { source, attributes, containers } = analyticsContext;
    const [shouldRender, setShouldRender] = useState(false);
    const [resolvedUrl, setResolvedUrl] = useState<
      ResolveResponse | undefined
    >();
    const [authorizedProviders] = useSharedState(
      smartCardClient.authorizedProviders,
    );
    const definitionId = resolvedUrl?.meta?.definitionId;
    const shouldSetAkSmartCardProviderKey = !!(
      definitionId && authorizedProviders.has(definitionId)
    );

    const akSmartCardProps: AkSmartCardProps = {
      appearance: 'inline',
      inheritDimensions: true,
      showActions: false,
    };

    // render Loom links in card comments as block Smart Cards
    if (useFeatureFlag('teamplates.web.loom-integration', false)) {
      if (
        attributes?.fromSection === 'comment' &&
        source === 'cardDetailScreen' &&
        resolvedUrl?.data?.url?.includes('https://www.loom.com')
      ) {
        akSmartCardProps['appearance'] = 'embed';
        akSmartCardProps['inheritDimensions'] = false;
      }
    }

    // This is hacky way to re-render the Smart Cards after the user has completed the authorization
    // flow for a provider. This can go away when @atlaskit/smart-card supports a singleton store prop
    const [akSmartCardProviderKey, setAkSmartCardProviderKey] = useState(
      Date.now(),
    );

    useEffect(() => {
      if (shouldSetAkSmartCardProviderKey) {
        setAkSmartCardProviderKey(Date.now());
      }
    }, [shouldSetAkSmartCardProviderKey]);

    const smartLinkAttAnalytics = useMemo(
      () => ({
        source,
        attributes: {
          component: 'smartLink',
          definitionId: resolvedUrl?.meta?.definitionId,
          accessType: resolvedUrl?.meta?.requestAccess?.accessType,
          cloudId: resolvedUrl?.meta?.requestAccess?.cloudId,
          urlType: resolvedUrl?.data?.generator?.name,
          urlAccess: resolvedUrl?.meta?.access,
          ...(attributes && attributes),
          ...(containers && containers),
        },
      }),
      [resolvedUrl, attributes, source, containers],
    );

    const handleLinkResolved = useCallback((resolved: ResolveResponse) => {
      setResolvedUrl(resolved);
      setShouldRender(true);
    }, []);

    const handleLinkUnresolved = useCallback(() => {
      setResolvedUrl(undefined);
      setShouldRender(false);
    }, []);

    const handleSmartCardClick = useCallback(() => {
      Analytics.sendClickedLinkEvent({
        linkName: 'smartLink',
        ...smartLinkAttAnalytics,
      });
    }, [smartLinkAttAnalytics]);

    return (
      <AkSmartCardWithProvider
        url={url}
        plainLink={plainLink}
        akSmartCardProps={akSmartCardProps}
        onLinkResolved={handleLinkResolved}
        onLinkUnresolved={handleLinkUnresolved}
        shouldRender={shouldRender}
        onSmartCardClick={handleSmartCardClick}
        analyticsContextData={smartLinkAttAnalytics}
        akSmartCardProviderKey={akSmartCardProviderKey}
      />
    );
  },
);
