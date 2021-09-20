import React, { FunctionComponent, useCallback, Suspense } from 'react';
import { ApplicationSwitcherIcon } from '@trello/nachos/icons/application-switcher';
import { HeaderTestIds } from '@trello/test-ids';
import { MemberModel } from 'app/gamma/src/types/models';
import HeaderButton from './button';
import classnames from 'classnames';
import { Analytics } from '@trello/atlassian-analytics';
import {
  AtlassianSwitcherPrefetchTrigger,
  fetchProductRecommendations,
  createJoinableSitesProvider,
  createAvailableProductsProvider,
} from '@atlaskit/atlassian-switcher';
import { atlassianApiGateway } from '@trello/config';
import {
  setLocationToWacSoftware,
  setLocationToTryProduct,
  SWITCHER_AVAILABLE_PRODUCTS_URL,
  UtmCampaign,
} from 'app/gamma/src/util/cross-flow-essentials';
import { usePopover, Popover } from '@trello/nachos/popover';
import { AtlassianAppSwitcher } from 'app/src/components/AtlassianAppSwitcher';
import { forTemplate } from '@trello/i18n';
import {
  useCrossFlow,
  TargetType,
} from '@atlassiansox/cross-flow-support/trello';
import { useLazyComponent } from '@trello/use-lazy-component';
import {
  useIsPushTouchpointsEnabled,
  usePtSwitcherNudgeState,
} from 'app/src/components/SwitcherSpotlight';
import styles from './header.less';

interface AtlassianAppSwitcherButtonProps {
  member: MemberModel | undefined;
  redesign?: boolean;
}

const format = forTemplate('cross_flow');

// eslint-disable-next-line @trello/no-module-logic
const availableSitesDataProviderForAa = createAvailableProductsProvider(
  SWITCHER_AVAILABLE_PRODUCTS_URL,
);

// eslint-disable-next-line @trello/no-module-logic
const joinableSitesDataProviderForAa = createJoinableSitesProvider(
  // eslint-disable-next-line @trello/no-module-logic
  fetchProductRecommendations(`${atlassianApiGateway}gateway/api/invitations`),
);

type JoinableSitesDataProvider =
  | typeof joinableSitesDataProviderForAa
  | undefined;

export const AtlassianAppSwitcherButton: FunctionComponent<AtlassianAppSwitcherButtonProps> = ({
  member,
  redesign = false,
}) => {
  const locale = member?.prefs?.locale;
  const aaId = member?.aaId || undefined;
  const isAaMastered = member?.isAaMastered;
  const defaultSignupEmail = member?.email;

  let joinableSitesDataProvider: JoinableSitesDataProvider = joinableSitesDataProviderForAa;

  const onShow = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'atlassianSwitcherHeaderButton',
      source: 'appHeader',
      attributes: {
        aaId,
        isAaMastered,
      },
    });
  }, [aaId, isAaMastered]);

  const {
    popoverProps,
    triggerRef,
    toggle: togglePopover,
    hide,
  } = usePopover<HTMLButtonElement>({ onShow });

  /** Push Touchpoints Switcher Nudge. See more: go/ptprod */
  const memberId = member?.id ?? '';
  const menuOpen = popoverProps.isVisible;
  const ptEnabled = useIsPushTouchpointsEnabled(member);
  const ptNudgeState = usePtSwitcherNudgeState(memberId, menuOpen, ptEnabled);
  if (ptEnabled) joinableSitesDataProvider = ptNudgeState.provider;

  const crossFlow = useCrossFlow();

  const handleTryClick = useCallback(
    (productKey: TargetType) => {
      hide();
      if (crossFlow.isEnabled) {
        crossFlow.api.open({
          journey: 'decide',
          targetProduct: productKey,
          sourceComponent: 'atlassian-switcher',
          sourceContext: 'try',
          experimentalOptions: {
            crossFlowSupportInTrelloRollout: true,
            enhancedJSWValuePropositionEnabled: true,
          },
        });
      } else {
        setLocationToTryProduct(productKey, {
          campaign: UtmCampaign.ATLASSIAN_SWITCHER,
        });
      }
    },
    [hide, crossFlow],
  );

  const handleDiscoverMoreClick = useCallback(() => {
    hide();

    if (crossFlow.isEnabled) {
      crossFlow.api.open({
        journey: 'discover',
        sourceComponent: 'atlassian-switcher',
        sourceContext: 'more',
        experimentalOptions: {
          crossFlowSupportInTrelloRollout: true,
          enhancedJSWValuePropositionEnabled: true,
        },
      });
    } else {
      setLocationToWacSoftware({ campaign: UtmCampaign.ATLASSIAN_SWITCHER });
    }
  }, [hide, crossFlow]);

  const SwitcherSpotlight = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "switcher-spotlight" */ 'app/src/components/SwitcherSpotlight/SwitcherSpotlight'
      ),
    { namedImport: 'SwitcherSpotlight', preload: ptEnabled },
  );

  const renderHeaderButton = useCallback(
    () => (
      <HeaderButton
        icon={<ApplicationSwitcherIcon color="light" />}
        onClick={togglePopover}
        ref={triggerRef}
        testId={HeaderTestIds.AtlassianAppSwitcher}
        ariaLabel={format('switch to')}
        className={classnames(
          redesign && styles.headerButtonRedesign,
          redesign && styles.appSwitcherRedesign,
        )}
      />
    ),
    [redesign, togglePopover, triggerRef],
  );

  return (
    <>
      <AtlassianSwitcherPrefetchTrigger
        joinableSitesDataProvider={joinableSitesDataProvider}
        availableProductsDataProvider={availableSitesDataProviderForAa}
      >
        {ptEnabled ? (
          <Suspense fallback={renderHeaderButton()}>
            <SwitcherSpotlight nudgeState={ptNudgeState}>
              {renderHeaderButton()}
            </SwitcherSpotlight>
          </Suspense>
        ) : (
          renderHeaderButton()
        )}
      </AtlassianSwitcherPrefetchTrigger>
      <Popover
        {...popoverProps}
        title={format('more from atlassian')}
        testId={HeaderTestIds.AtlassianAppSwitcher}
      >
        <AtlassianAppSwitcher
          aaId={aaId}
          triggerXFlow={handleTryClick}
          onDiscoverMoreClicked={handleDiscoverMoreClick}
          joinableSitesDataProvider={joinableSitesDataProvider}
          highlightedJoinableItemHref={ptNudgeState.productUrl}
          onJoinableSiteClicked={ptNudgeState.onJoinableSiteClicked}
          availableProductsDataProvider={availableSitesDataProviderForAa}
          nonAaMastered={!isAaMastered}
          defaultSignupEmail={defaultSignupEmail}
          onClose={hide}
          locale={locale}
        />
      </Popover>
    </>
  );
};
