import { useCallback, useMemo } from 'react';
import { JoinableSiteClickHandler } from '@atlaskit/atlassian-switcher/dist/types/types';
import {
  getMandoPtCache,
  boardHasEnoughMembers,
  invalidateBoardsCache,
  setOptimisticCardDismiss,
} from './caching';
import { useIsBoardViewsCalloutDone } from './targeting';
import {
  JoinableProductDataProvider,
  JoinableSitesDataProvider,
  ProductName,
} from './types';
import { NOT_A_BOARD, useCurrentBoardId } from './useCurrentBoardId';
import {
  usePushTouchpointsMessages,
  DISMISS_HIGHLIGHT,
  DISMISS_CARD,
  DISMISS_NUDGE,
} from './usePushTouchpointsMessages';
import { useUnwrapProvider } from './useUnwrapProvider';
import { useJoinableProductsProvider } from './useJoinableProductsProvider';
import { Analytics } from '@trello/atlassian-analytics';

export interface SwitcherNudgeState {
  cardHidden: boolean;
  nudgeHidden: boolean;
  highlightHidden: boolean;
  overlappingCollaborators?: string[];
  numOfCollaborators: number;
  currentBoardId: string;
  productName?: ProductName;
  productUrl?: string;
  cloudId?: string;
  provider: JoinableSitesDataProvider;
  onJoinableSiteClicked: JoinableSiteClickHandler;
  dismissCard: () => void;
  dismissNudge: () => void;
}

export const MIN_COLLABS = 2;

export const sendHighlightDismissedEvent = () =>
  Analytics.sendDismissedComponentEvent({
    componentType: 'highlight',
    componentName: 'atlassianSwitcherMenuProductHighlight',
    source: 'appHeader',
  });

export const usePtSwitcherNudgeState = (
  memberId: string,
  isSwitcherMenuOpen: boolean,
  featureEnabled: boolean,
): SwitcherNudgeState => {
  const provider = useJoinableProductsProvider(memberId, !featureEnabled);

  const [
    { cardDismissed, nudgeDismissed, highlightDismissed },
    dismissMessage,
  ] = usePushTouchpointsMessages();
  const { lastVisitedBoard, optimisticCardDismiss } = getMandoPtCache(memberId);

  const currentBoardId = useCurrentBoardId();
  const isOnABoard = currentBoardId !== NOT_A_BOARD;

  const isBoardViewsCalloutDone = useIsBoardViewsCalloutDone(currentBoardId);
  const lessThanMinMembers = !boardHasEnoughMembers(
    currentBoardId,
    lastVisitedBoard,
  );

  const skipProviderUnwrap =
    !featureEnabled ||
    !isBoardViewsCalloutDone ||
    lessThanMinMembers ||
    (!isSwitcherMenuOpen && nudgeDismissed);

  const {
    cloudId,
    overlappingCollaborators,
    productUrl: highlightUrl,
    productName,
    providerLoading,
  } = useUnwrapProvider(
    provider as JoinableProductDataProvider,
    skipProviderUnwrap,
  );

  const numOfCollaborators = overlappingCollaborators?.length ?? 0;
  const hasEnoughCollaborators = numOfCollaborators >= MIN_COLLABS;

  const cardHidden = !!optimisticCardDismiss || cardDismissed;

  const nudgeHidden =
    nudgeDismissed ||
    !isOnABoard ||
    providerLoading ||
    !hasEnoughCollaborators ||
    !isBoardViewsCalloutDone;

  const highlightHidden =
    highlightDismissed ||
    !isOnABoard ||
    !hasEnoughCollaborators ||
    !isBoardViewsCalloutDone;

  const productUrl = !highlightHidden ? highlightUrl : undefined;

  const onJoinableSiteClicked = useCallback<JoinableSiteClickHandler>(
    ({ href }) => {
      if (href && memberId) {
        invalidateBoardsCache(href, memberId);
      }
      if (href === productUrl && hasEnoughCollaborators) {
        dismissMessage(DISMISS_HIGHLIGHT);
        sendHighlightDismissedEvent();
      }
    },
    [memberId, productUrl, hasEnoughCollaborators, dismissMessage],
  );

  const dismissCard = useCallback(() => {
    setOptimisticCardDismiss(memberId);
    dismissMessage(DISMISS_CARD);
  }, [dismissMessage, memberId]);

  const dismissNudge = useCallback(() => {
    dismissMessage(DISMISS_NUDGE);
  }, [dismissMessage]);

  const ptSwitcherNudgeState = useMemo<SwitcherNudgeState>(
    () => ({
      cardHidden,
      nudgeHidden,
      highlightHidden,
      overlappingCollaborators,
      numOfCollaborators,
      currentBoardId,
      productName,
      productUrl,
      cloudId,
      dismissCard,
      dismissNudge,
      provider,
      onJoinableSiteClicked,
    }),
    [
      cardHidden,
      nudgeHidden,
      highlightHidden,
      overlappingCollaborators,
      numOfCollaborators,
      currentBoardId,
      productName,
      productUrl,
      cloudId,
      dismissCard,
      dismissNudge,
      onJoinableSiteClicked,
      provider,
    ],
  );

  return ptSwitcherNudgeState;
};
