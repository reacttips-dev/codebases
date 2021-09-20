import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl';

import {
  Card as AkSmartCard,
  Provider as AkSmartCardProvider,
  CardAppearance,
} from '@atlaskit/smart-card';
import FabricAnalyticsListeners from '@atlaskit/analytics-listeners';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import { Analytics } from '@trello/atlassian-analytics';

import { smartCardClient } from 'app/scripts/network/smart-card-client';
import { objectResolverClient } from 'app/scripts/network/object-resolver-client';
import { ResolveResponse } from 'app/scripts/network/object-resolver-client/types';

import { useAkMediaLocale } from './useAkMediaLocale';

interface AnalyticsContextDataType {
  attributes: {
    component?: string;
    definitionId?: string;
    accessType?: string;
    cloudId?: string;
    urlType?: string;
  };
}

export interface AkSmartCardProps {
  appearance: CardAppearance;
  inheritDimensions: boolean;
  showActions: boolean;
}

interface Props {
  url: string;
  plainLink: () => JSX.Element;
  akSmartCardProps: AkSmartCardProps;
  onLinkResolved?: (resolved: ResolveResponse) => void;
  onLinkUnresolved?: () => void;
  onSmartCardClick?: () => void;
  shouldRender: boolean;
  analyticsContextData: AnalyticsContextDataType;
  akSmartCardProviderKey: number;
}

export const AkSmartCardWithProvider = ({
  url,
  plainLink,
  onSmartCardClick,
  onLinkResolved,
  onLinkUnresolved,
  akSmartCardProps,
  shouldRender = false,
  analyticsContextData,
  akSmartCardProviderKey,
}: Props) => {
  const { language, messages, isLocaleReady } = useAkMediaLocale();

  useEffect(() => {
    const checkIfSmartCard = async () => {
      const resolved = await objectResolverClient.resolveUrl(url, {
        sourceComponent: 'atlaskit-smart-card',
      });

      if (resolved) {
        onLinkResolved?.(resolved);
      } else {
        onLinkUnresolved?.();
      }
    };

    checkIfSmartCard();
  }, [url, onLinkResolved, onLinkUnresolved]);

  return shouldRender && isLocaleReady ? (
    <FabricAnalyticsListeners
      client={Analytics.dangerouslyGetAnalyticsWebClient()}
    >
      <AnalyticsContext data={analyticsContextData}>
        <AkSmartCardProvider
          client={smartCardClient}
          key={akSmartCardProviderKey}
        >
          <IntlProvider locale={language} messages={messages}>
            <AkSmartCard
              // eslint-disable-next-line react/jsx-no-bind
              onClick={(e) => {
                // This is needed to prevent the click event from propagating up to
                // cardView.handleLinkInCardNameClick.
                e.preventDefault();
                e.stopPropagation();
                window.open(url, '_blank');
                onSmartCardClick?.();
              }}
              url={url}
              {...akSmartCardProps}
            />
          </IntlProvider>
        </AkSmartCardProvider>
      </AnalyticsContext>
    </FabricAnalyticsListeners>
  ) : (
    plainLink()
  );
};
