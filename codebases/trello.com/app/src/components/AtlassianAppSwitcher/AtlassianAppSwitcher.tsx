import React, { FunctionComponent } from 'react';
import AtlassianSwitcher, {
  createAvailableProductsProvider,
  createJoinableSitesProvider,
} from '@atlaskit/atlassian-switcher';
import { IntlProvider } from 'react-intl';
import FabricAnalyticsListeners, {
  FabricChannel,
} from '@atlaskit/analytics-listeners';
import { Analytics } from '@trello/atlassian-analytics';
import { N300, N800 } from '@trello/colors';
import { TargetType } from '@atlassiansox/cross-flow-support/trello';

import { AnalyticsContext } from '@atlaskit/analytics-next';
import { JoinableSiteClickHandler } from '@atlaskit/atlassian-switcher/dist/types/types';

export enum AtlassianSwitcherVariations {
  CONTROL = 'control',
  NOT_ENROLLED = 'not-enrolled',
  EXPERIMENT = 'experiment',
}

const trelloTheme = {
  primaryTextColor: N800,
  secondaryTextColor: N300,
  primaryHoverBackgroundColor: '#E0E2E5',
  secondaryHoverBackgroundColor: '#F5F6F7',
};

interface AtlassianAppSwitcherProps {
  aaId?: string;
  triggerXFlow: (productKey: TargetType) => void;
  onDiscoverMoreClicked: () => void;
  highlightedJoinableItemHref?: string;
  onJoinableSiteClicked?: JoinableSiteClickHandler;
  joinableSitesDataProvider:
    | ReturnType<typeof createJoinableSitesProvider>
    | undefined;
  availableProductsDataProvider:
    | ReturnType<typeof createAvailableProductsProvider>
    | undefined;
  nonAaMastered: boolean;
  defaultSignupEmail?: string | null;
  locale?: string;
  onClose: () => void;
}

export const AtlassianAppSwitcher: FunctionComponent<AtlassianAppSwitcherProps> = ({
  aaId,
  triggerXFlow,
  onDiscoverMoreClicked,
  joinableSitesDataProvider,
  highlightedJoinableItemHref,
  onJoinableSiteClicked,
  availableProductsDataProvider,
  nonAaMastered,
  defaultSignupEmail,
  locale = 'en',
  onClose,
}) => {
  const recommendationsFeatureFlags = { isProductStoreInTrelloEnabled: true };

  const discoverySwitcherProps = {
    triggerXFlow,
    onDiscoverMoreClicked,
    recommendationsFeatureFlags,
    highlightedJoinableItemHref,
    onJoinableSiteClicked,
    joinableSitesDataProvider,
    availableProductsDataProvider,
  };
  const analyticsContextData = {
    navigationCtx: {
      attributes: {
        aaId,
        isAaMastered: !nonAaMastered,
      },
    },
  };

  return (
    <IntlProvider locale={locale}>
      {
        <FabricAnalyticsListeners
          client={Analytics.dangerouslyGetAnalyticsWebClient()}
          excludedChannels={[
            FabricChannel.atlaskit,
            FabricChannel.elements,
            FabricChannel.editor,
            FabricChannel.media,
          ]}
        >
          <AnalyticsContext data={analyticsContextData}>
            <AtlassianSwitcher
              product="trello"
              appearance="standalone"
              theme={trelloTheme}
              {...discoverySwitcherProps}
              nonAaMastered={nonAaMastered}
              defaultSignupEmail={
                defaultSignupEmail === null ? undefined : defaultSignupEmail
              }
              onClose={onClose}
            />
          </AnalyticsContext>
        </FabricAnalyticsListeners>
      }
    </IntlProvider>
  );
};
