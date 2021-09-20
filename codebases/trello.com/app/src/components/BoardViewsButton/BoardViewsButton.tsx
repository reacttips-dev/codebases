import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import {
  BoardViewsPopover,
  ViewOption,
  PowerUpViewOption,
} from './BoardViewsPopover';
import { Popover, PopoverScreen, usePopover } from '@trello/nachos/popover';
import { memberId } from '@trello/session-cookie';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { RouteContext, RouteNames } from 'app/src/router';
import { BoardHeaderTestIds } from '@trello/test-ids';
import {
  BoardViewsButtonCallout,
  CalloutType,
} from './BoardViewsButtonCallout';
import { CSSTransition } from 'react-transition-group';
import { DownIcon } from '@trello/nachos/icons/down';
import { ListIcon } from '@trello/nachos/icons/list';
import { Lozenge } from 'app/src/components/Lozenge';

import { Button } from '@trello/nachos/button';
import { TrelloStorage } from '@trello/storage';
import { forTemplate } from '@trello/i18n';
import { BoardViewsPopoverUpsell } from './BoardViewsPopoverUpsell';
import { useBoardViewsPopoverUpsell } from './BoardViewsPopoverUpsell/useBoardViewsPopoverUpsell';

import { getViewsUpsellFlag } from 'app/src/components/ViewsGenerics';
import styles from './BoardViewsButton.less';
import { useBoardViewsButtonDismissOneTimeMessageMutation } from './BoardViewsButtonDismissOneTimeMessageMutation.generated';

import {
  useBoardViewsButtonMemberQuery,
  BoardViewsButtonMemberQuery,
  BoardViewsButtonMemberDocument,
} from './BoardViewsButtonMemberQuery.generated';
import { useLocation } from '@trello/router';
import { pathnameToRouteContext } from 'app/src/router/pathnameToRouteContext';

const format = forTemplate('board-views');
const formatUpsell = forTemplate('views_prompt');

enum Screen {
  BoardViews,
}

export interface BoardViewsButtonProps {
  isTeamMember: boolean;
  hasViewsFeature: boolean;
  orgName?: string;
  isOrgPrivate?: boolean;
  paidStatus?: 'enterprise' | 'bc' | 'standard' | 'free';
  isStandardOrFreeTeamBoardGuest: boolean;
  shouldShowTeamTableLink: boolean;
  idBoard: string;
  idOrg?: string;
  shortLink: string;
  preloadPlugins: () => Promise<void>;
  viewOptions: ViewOption[];
  clearFilters: () => void;
  backgroundBrightness?: 'light' | 'dark';
  isLoadingPowerUpViews: boolean;
  powerUpViewOptions: PowerUpViewOption[];
  setIframePopoverOverlayVisibility: (visibility: boolean) => void;
}

export const PowerUpViewIcon: React.FunctionComponent<
  Partial<PowerUpViewOption>
> = ({ icon, name }) => {
  return <img className={styles.pluginIcon} src={icon} alt={name} />;
};

export const BoardViewsButton: React.FunctionComponent<BoardViewsButtonProps> = ({
  isTeamMember,
  hasViewsFeature,
  orgName,
  isOrgPrivate,
  paidStatus,
  isStandardOrFreeTeamBoardGuest,
  shouldShowTeamTableLink,
  idBoard,
  idOrg,
  shortLink,
  preloadPlugins,
  viewOptions,
  clearFilters,
  backgroundBrightness,
  isLoadingPowerUpViews,
  powerUpViewOptions,
  setIframePopoverOverlayVisibility,
}) => {
  const {
    data: memberQueryData,
    refetch,
    loading,
  } = useBoardViewsButtonMemberQuery({
    variables: { memberId: memberId || '' },
  });

  const oneTimeMessagesDismissed =
    memberQueryData?.member?.oneTimeMessagesDismissed;

  const {
    isUpsellEnabled,
    isUpsellDefaultOpenEnabled,
  } = useBoardViewsPopoverUpsell({
    orgId: idOrg,
  });
  const inverseColor = backgroundBrightness === 'light' ? 'dark' : 'light';

  const location = useLocation();
  const route = useMemo(
    () => pathnameToRouteContext(`${location.pathname}${location.search}`),
    [location],
  );
  const path = route.routePath;
  const pathArgs = path.split('/');
  const currentView = pathArgs[4] || 'board';

  let currentIdPlugin: string | undefined;
  let currentPluginViewKey: string | undefined;
  let ButtonIcon;
  let currentViewString;

  let PowerButtonIcon;
  let powerButtonIconProps = {};

  if (currentView === 'power-up') {
    currentIdPlugin = pathArgs[5];
    currentPluginViewKey = pathArgs[7];

    if (currentPluginViewKey && currentPluginViewKey.includes('?')) {
      currentPluginViewKey = currentPluginViewKey.split('?')[0];
    }

    const viewOption = powerUpViewOptions.find(
      (option) =>
        option.idPlugin === currentIdPlugin &&
        option.key === currentPluginViewKey,
    );

    if (viewOption) {
      currentViewString = viewOption.name;
      PowerButtonIcon = PowerUpViewIcon;
      powerButtonIconProps = {
        name: viewOption.name,
        icon: viewOption.icon,
      };
    } else {
      currentViewString = format('board');
      ButtonIcon = ListIcon;
    }
  } else {
    // Account for query params from filtering to get correct ViewString
    const trimmedCurrentView = currentView.split('?')[0];

    const viewOption = viewOptions.find(
      (option) => option.name === trimmedCurrentView && option.isVisible,
    );

    currentViewString = viewOption
      ? format(trimmedCurrentView.toString())
      : format('board');

    ButtonIcon = viewOption ? viewOption.icon : ListIcon;
  }

  const [
    dismissOneTimeMessage,
  ] = useBoardViewsButtonDismissOneTimeMessageMutation();

  const optimisticDismissOneTimeMessage = useCallback(
    (messageId: string) => {
      dismissOneTimeMessage({
        variables: { messageId, memberId: memberId! },
        optimisticResponse: {
          __typename: 'Mutation',
          addOneTimeMessagesDismissed: {
            id: 'me',
            oneTimeMessagesDismissed: oneTimeMessagesDismissed?.concat([
              messageId,
            ]),
            __typename: 'Member',
          },
        },
        update: (cache, result) => {
          const data = cache.readQuery<BoardViewsButtonMemberQuery>({
            query: BoardViewsButtonMemberDocument,
            variables: { memberId: memberId || '' },
          });

          if (!data?.member) {
            return;
          }

          // Make sure we're not losing any messages in the cache with out optimistic response
          const mergedMessagesDismissed = new Set([
            ...(data?.member?.oneTimeMessagesDismissed || []),
            ...(result?.data?.addOneTimeMessagesDismissed
              ?.oneTimeMessagesDismissed || oneTimeMessagesDismissed!),
          ]);
          cache.writeQuery<BoardViewsButtonMemberQuery>({
            query: BoardViewsButtonMemberDocument,
            data: {
              ...data,
              member: {
                ...data.member,
                oneTimeMessagesDismissed: [...mergedMessagesDismissed],
              },
            },
          });
        },
      });
    },
    [dismissOneTimeMessage, oneTimeMessagesDismissed],
  );

  const getViewOneTimeMessageName = (viewName: string) => {
    return `${viewName}-views-switcher-new-pill`;
  };

  //TODO: This "!isTeamMember => false" logic should be encapsulated into the canViewTeamTablePage helper.
  const showTeamTableLink: boolean = isTeamMember
    ? shouldShowTeamTableLink
    : false;

  const viewsNewToUser = useMemo(
    () => [
      ...viewOptions
        .filter(
          (opt) =>
            opt.isVisible &&
            !opt.isGA &&
            !oneTimeMessagesDismissed?.includes(
              getViewOneTimeMessageName(opt.name),
            ),
        )
        .map((opt) => opt.name),
      ...(!oneTimeMessagesDismissed?.includes(
        getViewOneTimeMessageName('team-table'),
      ) && showTeamTableLink
        ? ['team-table']
        : []),
    ],
    [oneTimeMessagesDismissed, showTeamTableLink, viewOptions],
  );

  const routeIsOnBoardView = (route: RouteContext): boolean => {
    const pathComponents = route.routePath.split('/');
    const isBoardPath = pathComponents[1] === 'b';
    const isBoardRouteType = route.routeName === RouteNames.BOARD;
    const isNotOtherViewOrButler = pathComponents.length < 5;
    return isBoardPath && isBoardRouteType && isNotOtherViewOrButler;
  };

  /*
  Only evaluate the oneTimeMessagesDismissed for the new pills if the user can
  see the switcher
  */
  const [showNewPill, setShowNewPill] = useState(false);
  const [showPopover, setShowPopover] = useState(
    isUpsellDefaultOpenEnabled &&
      routeIsOnBoardView(route) &&
      !oneTimeMessagesDismissed?.includes('views-switcher-callout') &&
      !oneTimeMessagesDismissed?.includes(
        'nusku.views-switcher-upsell-default-open',
      ),
  );

  const [callout, setCallout] = useState<CalloutType>(CalloutType.None);
  const [calloutDismissed, setCalloutDismissed] = useState(false);

  useEffect(() => {
    setShowNewPill(
      !loading &&
        !calloutDismissed &&
        oneTimeMessagesDismissed! &&
        hasViewsFeature && //Only show to latest BC for now because of issues with the upsell text saying "upgrade to get more pups"
        routeIsOnBoardView(route) &&
        viewsNewToUser.length > 0,
    );
  }, [
    hasViewsFeature,
    loading,
    oneTimeMessagesDismissed,
    route,
    viewsNewToUser.length,
    calloutDismissed,
  ]);

  useEffect(() => {
    const shouldShowCallout =
      !loading &&
      !calloutDismissed &&
      showNewPill && // Only show visualize in new ways if a view is 'new' to a user
      !isUpsellDefaultOpenEnabled &&
      routeIsOnBoardView(route) &&
      !oneTimeMessagesDismissed?.includes('views-switcher-callout') &&
      !oneTimeMessagesDismissed?.includes(
        'nusku.views-switcher-upsell-default-open',
      );

    if (shouldShowCallout) {
      setCallout(CalloutType.VisualizeInNewWays);
    }
  }, [
    isUpsellDefaultOpenEnabled,
    loading,
    oneTimeMessagesDismissed,
    route,
    showNewPill,
    calloutDismissed,
  ]);

  const onHide = useCallback(() => {
    Analytics.sendClosedComponentEvent({
      componentName: 'boardViewsInlineDialog',
      componentType: 'inlineDialog',
      source: 'boardScreen',
      containers: {
        organization: {
          id: idOrg,
        },
        board: {
          id: idBoard,
        },
      },
    });

    setIframePopoverOverlayVisibility(false);

    if (showPopover) {
      optimisticDismissOneTimeMessage(
        'nusku.views-switcher-upsell-default-open',
      );
      setShowPopover(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idBoard, idOrg, setIframePopoverOverlayVisibility, showPopover]);

  const {
    show,
    toggle,
    hide,
    popoverProps,
    triggerRef,
  } = usePopover<HTMLButtonElement>({
    initialScreen: Screen.BoardViews,
    onHide,
    onShow: () => setIframePopoverOverlayVisibility(true),
  });

  useEffect(() => {
    if (showPopover) {
      show();
    }
  }, [showPopover, show]);

  useEffect(() => {
    try {
      const VIEWS_SWITCHER_CACHE_KEY = `views-switcher-callout-${shortLink}`;
      if (callout !== CalloutType.None || showPopover) {
        TrelloStorage.unset(VIEWS_SWITCHER_CACHE_KEY);

        Analytics.sendOperationalEvent({
          action: 'unset',
          actionSubject: 'viewsSwitcherCalloutCache',
          source: 'boardScreen',
          containers: formatContainers({ idBoard: shortLink }),
        });
      } else if (!TrelloStorage.get(VIEWS_SWITCHER_CACHE_KEY)) {
        const currentTime = Date.now();
        TrelloStorage.set(VIEWS_SWITCHER_CACHE_KEY, currentTime);

        Analytics.sendOperationalEvent({
          action: 'set',
          actionSubject: 'viewsSwitcherCalloutCache',
          source: 'boardScreen',
          containers: formatContainers({ idBoard: shortLink }),
          attributes: {
            currentTime,
          },
        });
      }
    } catch (e) {
      Analytics.sendOperationalEvent({
        action: 'errored',
        actionSubject: 'viewsSwitcherCalloutCache',
        source: 'boardScreen',
        containers: formatContainers({ idBoard: shortLink }),
        attributes: {
          message: e?.message,
          name: e?.name,
        },
      });
    }
  }, [callout, showPopover, shortLink]);

  useEffect(() => {
    //Sending analytics exposure events
    getViewsUpsellFlag('remarkable.org-table-view-free-team-upsell', false);
  }, []);

  const closeCallout = useCallback(() => {
    if (callout === CalloutType.VisualizeInNewWays) {
      optimisticDismissOneTimeMessage('views-switcher-callout');
    }
    setCallout(CalloutType.None);
  }, [optimisticDismissOneTimeMessage, callout]);

  const dismissNewPill = useCallback(() => {
    if (showNewPill) {
      setShowNewPill(false);
      viewsNewToUser.forEach((view) => {
        optimisticDismissOneTimeMessage(getViewOneTimeMessageName(view));
      });
      refetch();
    }
  }, [optimisticDismissOneTimeMessage, refetch, showNewPill, viewsNewToUser]);

  const onBoardViewsButtonClick = useCallback(() => {
    closeCallout();
    toggle();
    dismissNewPill();
    setCalloutDismissed(true);
    Analytics.sendClickedButtonEvent({
      buttonName: 'boardViewsButton',
      containers: {
        board: {
          id: idBoard,
        },
        organization: {
          id: idOrg,
        },
      },
      attributes: {
        hasNewPill: showNewPill,
      },
      source: 'boardScreen',
    });
  }, [closeCallout, dismissNewPill, idBoard, idOrg, showNewPill, toggle]);

  // if the first view option isn't the board, something's gone wrong
  if (viewOptions[0].name !== 'board') {
    return null;
  }

  const visibleViews = viewOptions.reduce(
    (acc, option) => (option.isVisible ? acc + 1 : acc),
    0,
  );
  // Show the button if we have views available besides board view
  // or the team table link is available.
  // visibleViews > 1 check is for old bc accounts / personal boards unless it's standard or free board
  const showBoardViewsButton = visibleViews > 1 || showTeamTableLink;
  if (!showBoardViewsButton && !isStandardOrFreeTeamBoardGuest) {
    return null;
  }

  return (
    <>
      <Button
        title={format('board-views')}
        ref={triggerRef}
        className={styles.boardViewsButton}
        appearance={
          backgroundBrightness === 'dark' ? 'transparent' : 'transparent-dark'
        }
        testId={BoardHeaderTestIds.BoardViewsSwitcherButton}
        onClick={onBoardViewsButtonClick}
        onMouseOver={preloadPlugins}
        onFocus={preloadPlugins}
        iconBefore={
          <>
            <CSSTransition
              in={!!showNewPill}
              timeout={150}
              unmountOnExit
              classNames={{
                exit: styles.newPillExit,
                exitActive: styles.newPillExitActive,
              }}
            >
              <span
                className={styles.boardViewsNewLozenge}
                data-test-id={BoardHeaderTestIds.BoardViewsSwitcherNewPill}
              >
                <Lozenge color="green">{format('new')}</Lozenge>
              </span>
            </CSSTransition>
            {ButtonIcon && (
              <ButtonIcon
                dangerous_className={styles.icon}
                size={'small'}
                block
                color={inverseColor}
              />
            )}
            {PowerButtonIcon && <PowerButtonIcon {...powerButtonIconProps} />}
          </>
        }
        iconAfter={
          <DownIcon
            dangerous_className={styles.icon}
            size={'small'}
            block
            color={inverseColor}
          />
        }
      >
        <span className={styles.boardViewsLabel}>{currentViewString}</span>
        <BoardViewsButtonCallout
          onClose={closeCallout}
          idBoard={idBoard}
          idOrg={idOrg}
          callout={callout}
        />
      </Button>

      <Popover
        {...popoverProps}
        size={
          isUpsellEnabled || isStandardOrFreeTeamBoardGuest ? 'large' : 'medium'
        }
        noVerticalPadding
      >
        <PopoverScreen
          id={Screen.BoardViews}
          title={
            isUpsellEnabled || isStandardOrFreeTeamBoardGuest
              ? formatUpsell('views-prompt-header')
              : null
          }
        >
          {isUpsellEnabled || isStandardOrFreeTeamBoardGuest ? (
            <BoardViewsPopoverUpsell
              orgName={orgName}
              orgId={idOrg}
              boardId={idBoard}
              hidePopover={hide}
              isStandardOrFreeTeamBoardGuest={isStandardOrFreeTeamBoardGuest}
            />
          ) : (
            <BoardViewsPopover
              idBoard={idBoard}
              shortLink={shortLink}
              orgName={orgName}
              idOrg={idOrg}
              paidStatus={paidStatus}
              isOrgPrivate={isOrgPrivate}
              shouldShowTeamTableLink={showTeamTableLink}
              hidePopover={hide}
              currentView={currentView}
              viewOptions={viewOptions}
              clearFilters={clearFilters}
              isLoadingPowerUpViews={isLoadingPowerUpViews}
              powerUpViewOptions={powerUpViewOptions}
              currentPowerUpView={{
                idPlugin: currentIdPlugin,
                key: currentPluginViewKey,
              }}
              hasViewsFeature={hasViewsFeature}
            />
          )}
        </PopoverScreen>
      </Popover>
    </>
  );
};
