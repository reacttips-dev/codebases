import React, { useCallback, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import cx from 'classnames';

import {
  Card as SmartCard,
  Provider as SmartCardProvider,
} from '@atlaskit/smart-card';
import { useSharedState } from '@trello/shared-state';
import { Analytics } from '@trello/atlassian-analytics';
import { EventContainer } from '@atlassiansox/analytics-web-client';
import { featureFlagClient } from '@trello/feature-flag-client';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import FabricAnalyticsListeners from '@atlaskit/analytics-listeners';

import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { objectResolverClient } from 'app/scripts/network/object-resolver-client';
import { ResolveResponse } from 'app/scripts/network/object-resolver-client/types';
import { smartCardClient } from 'app/scripts/network/smart-card-client';
import {
  AkSmartCardWithProvider,
  useSmartLinkAnalytics,
  useAkSmartCardProviderRefresh,
} from 'app/src/components/SmartMedia';
import { Feature } from 'app/scripts/debug/constants';

import { EditCardButton, useEditCardButton } from './EditCardButton';
import styles from './LinkCard.less';

const PROVIDER_KEYS_WITH_BADGE = [
  'jira-object-provider',
  'bitbucket-object-provider',
];

interface LinkCardProps {
  url: string;
  openEditor: () => void;
  hideCover?: boolean;
  locale?: string;
  isEditable: boolean;
  hideActions?: boolean;
  analyticsContainers?: EventContainer;
}

export const LinkCard = ({
  url,
  openEditor,
  hideCover,
  locale = 'en',
  isEditable,
  hideActions,
  analyticsContainers,
}: LinkCardProps) => {
  const {
    showEditCardButton,
    hideEditCardButton,
    shouldShowEditCardButton,
  } = useEditCardButton();

  const [hasBadge, setHasBadge] = useState(false);
  const [authorizedProviders] = useSharedState(
    smartCardClient.authorizedProviders,
  );
  const [isSmartCard, setIsSmartCard] = useState(
    objectResolverClient.isCached(url),
  );
  const [resolvedUrl, setResolvedUrl] = useState<ResolveResponse | undefined>();
  const smartLinkAnalytics = useSmartLinkAnalytics(resolvedUrl, {
    source: 'cardView',
    containers: analyticsContainers,
    attributes: {
      component: 'linkCard',
    },
  });
  const akSmartCardProviderKey = useAkSmartCardProviderRefresh(resolvedUrl);

  const isSmartLinkCardFlag = featureFlagClient.get(
    'growth.trello-link-card-to-smart-link',
    false,
  );

  // This is hacky way to re-render the Smart Cards after the user has completed the authorization
  // flow for a provider. This can go away when @atlaskit/smart-card supports a singleton store prop
  const [providerKey, setProviderKey] = useState(Date.now());
  const [isUnauthed, setIsUnauthed] = useState(false);

  useEffect(() => {
    if (isSmartLinkCardFlag) {
      return;
    }

    const definitionId = resolvedUrl?.meta?.definitionId;
    if (isUnauthed && definitionId && authorizedProviders.has(definitionId)) {
      setProviderKey(Date.now());
      setIsUnauthed(false);
    }
  }, [isUnauthed, resolvedUrl, authorizedProviders, isSmartLinkCardFlag]);

  useEffect(() => {
    if (isSmartLinkCardFlag) {
      return;
    }

    const checkIfSmartCard = async () => {
      const resolved = await objectResolverClient.resolveUrl(url, {
        sourceComponent: 'link-card',
      });

      if (resolved) {
        setResolvedUrl(resolved);
        // Do not render Smart Cards for 404 links.
        setIsSmartCard(resolved.meta.visibility !== 'not_found');
        setIsUnauthed(resolved.meta.access === 'unauthorized');
        setHasBadge(
          (resolved.meta.key &&
            PROVIDER_KEYS_WITH_BADGE.includes(resolved.meta.key)) ||
            PROVIDER_KEYS_WITH_BADGE.includes(resolved.meta.definitionId),
        );
      } else {
        setIsSmartCard(false);
      }
    };

    setIsSmartCard(false);
    checkIfSmartCard();
  }, [url, setResolvedUrl, isSmartLinkCardFlag]);

  const handleLinkResolved = useCallback((resolved: ResolveResponse) => {
    setResolvedUrl(resolved);
    setIsSmartCard(resolved.meta.visibility !== 'not_found');
    setHasBadge(
      (resolved.meta.key &&
        PROVIDER_KEYS_WITH_BADGE.includes(resolved.meta.key)) ||
        PROVIDER_KEYS_WITH_BADGE.includes(resolved.meta.definitionId),
    );
  }, []);

  const handleLinkUnresolved = useCallback(() => {
    setResolvedUrl(undefined);
    setIsSmartCard(false);
  }, []);

  const handleSmartCardClick = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'linkCard',
      ...smartLinkAnalytics,
    });
  }, [smartLinkAnalytics]);

  const plainLink = () => (
    <a
      className={styles.link}
      href={url}
      target="_blank"
      onClick={handleSmartCardClick}
    >
      {url}
    </a>
  );

  const getInnerContent = () => {
    if (isSmartLinkCardFlag) {
      return (
        <a
          className={styles.link}
          href={url}
          target="_blank"
          // eslint-disable-next-line react/jsx-no-bind
          onClick={(e) => {
            e.stopPropagation();
            handleSmartCardClick();
          }}
        >
          <AkSmartCardWithProvider
            akSmartCardProps={{
              appearance: 'block',
              inheritDimensions: true,
              showActions: !hideActions,
            }}
            onLinkResolved={handleLinkResolved}
            onLinkUnresolved={handleLinkUnresolved}
            shouldRender={isSmartCard}
            onSmartCardClick={handleSmartCardClick}
            analyticsContextData={smartLinkAnalytics}
            akSmartCardProviderKey={akSmartCardProviderKey}
            // eslint-disable-next-line react/jsx-no-bind
            plainLink={plainLink}
            url={url}
          />
        </a>
      );
    }

    if (isSmartCard) {
      return (
        <FabricAnalyticsListeners
          client={Analytics.dangerouslyGetAnalyticsWebClient()}
        >
          <AnalyticsContext data={smartLinkAnalytics}>
            <SmartCardProvider client={smartCardClient} key={providerKey}>
              <IntlProvider locale={locale}>
                <a
                  className={styles.link}
                  href={url}
                  target="_blank"
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSmartCardClick();
                  }}
                >
                  <SmartCard
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={(e) => {
                      // This is needed to prevent the click event from propagating up to
                      // cardView.handleLinkInCardNameClick.
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(url, '_blank');
                      handleSmartCardClick();
                    }}
                    appearance="block"
                    url={url}
                    inheritDimensions
                    showActions={!hideActions}
                  />
                </a>
              </IntlProvider>
            </SmartCardProvider>
          </AnalyticsContext>
        </FabricAnalyticsListeners>
      );
    }

    return plainLink();
  };

  return (
    <div
      className={cx({
        [styles.smartLinkCard]: isSmartCard,
        [styles.linkCard]: !isSmartCard,
        [styles.hideCover]: hideCover,
        [styles.hasBadge]: hasBadge,
      })}
      onFocus={showEditCardButton}
      onBlur={hideEditCardButton}
      onMouseOver={showEditCardButton}
      onMouseOut={hideEditCardButton}
    >
      <EditCardButton
        onClick={openEditor}
        shouldShow={isEditable && shouldShowEditCardButton}
      />
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-workflowers',
          feature: Feature.LinkCard,
        }}
        sendCrashEvent={false}
        // eslint-disable-next-line react/jsx-no-bind
        errorHandlerComponent={plainLink}
      >
        {getInnerContent()}
      </ErrorBoundary>
    </div>
  );
};
