import ConversationHeaderIcons from './ConversationHeaderIcons';
import ConversationReadingPaneInfoPage from './ConversationReadingPaneInfoPage';
import ItemPart from './ItemPart';
import SeeMoreMessages from './SeeMoreMessages';
import SubjectHeader from './SubjectHeader';
import getUnreadMessageCount from '../utils/getUnreadMessageCount';
import logSelectionUIHotKeyUsage, { SelectionUIHotkey } from '../utils/logSelectionUIHotKeyUsage';
import { SAVE_SCROLL_DEBOUNCE } from '../utils/saveScrollPositionUtils';
import debounce from 'lodash/debounce';
import { observer } from 'mobx-react-lite';
import { lazyLogSigsDatapoint } from 'owa-analytics';
import { animateScrollTop } from 'owa-animation/lib/utils/animateScrollTop';
import type { ClientItemId } from 'owa-client-ids';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isGroupTableQuery } from 'owa-group-utils';
import { getGuid } from 'owa-guid';
import { useKeydownHandler } from 'owa-hotkeys';
import { createInitialActions, executeInitialActions, InitialActions } from 'owa-initial-actions';
import { isInlineImageStoreEmpty, lazyClearInlineImageStore } from 'owa-inline-image-loader';
import loc from 'owa-localize';
import { contentPaneLabel } from 'owa-locstrings/lib/strings/contentpanelabel.locstring.json';
import closeImmersiveReadingPane from 'owa-mail-actions/lib/closeImmersiveReadingPane';
import { userMailInteractionAction } from 'owa-mail-actions/lib/triage/userMailInteractionAction';
import { CalendarCardBottom, CalendarCardViewState } from 'owa-mail-calendar-card';
import findInlineComposeViewState from 'owa-mail-compose-actions/lib/utils/findInlineComposeViewState';
import type { ComposeViewState } from 'owa-mail-compose-store';
import { Compose, Dock } from 'owa-mail-compose-view';
import { ExtendedCardWrapper } from 'owa-mail-extended-card';
import { FocusComponent, lazyRegisterComponent, lazyResetFocus } from 'owa-mail-focus-manager';
import { getCommands } from 'owa-mail-hotkeys/lib/utils/MailModuleHotKeys';
import { isReadingPanePositionOff } from 'owa-mail-layout/lib/selectors/readingPanePosition';
import { shouldShowListView } from 'owa-mail-layout/lib/selectors/shouldShowListView';
import { getSelectedTableView } from 'owa-mail-list-store';
import expandCollapseAllItemParts from 'owa-mail-reading-pane-store/lib/actions/expandCollapseAllItemParts';
import expandCollapseFocusedItemPart from 'owa-mail-reading-pane-store/lib/actions/expandCollapseFocusedItemPart';
import firstLoadConversationReadingPane from 'owa-mail-reading-pane-store/lib/actions/firstLoadConversationReadingPane';
import setFocusedItemPart from 'owa-mail-reading-pane-store/lib/actions/setFocusedItemPart';
import setItemIdToScrollTo from 'owa-mail-reading-pane-store/lib/actions/setItemIdToScrollTo';
import { saveConversationScrollPosition } from 'owa-mail-reading-pane-store/lib/mutators/saveScrollPositionMutators';
import type ConversationReadingPaneViewState from 'owa-mail-reading-pane-store/lib/store/schema/ConversationReadingPaneViewState';
import { ExtendedCardType } from 'owa-mail-reading-pane-store/lib/store/schema/ExtendedCardViewState';
import { FocusedItemArea } from 'owa-mail-reading-pane-store/lib/store/schema/FocusedItemPart';
import type ItemPartViewState from 'owa-mail-reading-pane-store/lib/store/schema/ItemPartViewState';
import getConversationReadingPaneViewState from 'owa-mail-reading-pane-store/lib/utils/getConversationReadingPaneViewState';
import getDefaultDisposalType from 'owa-mail-reading-pane-store/lib/utils/getDefaultDisposalType';
import getFirstItemInConversation from 'owa-mail-reading-pane-store/lib/utils/getFirstItemInConversation';
import getLastestNonDraftItemId from 'owa-mail-reading-pane-store/lib/utils/getLastestNonDraftItemId';
import isAllItemPartsExpanded from 'owa-mail-reading-pane-store/lib/utils/isAllItemPartsExpanded';
import { SenderImage } from 'owa-mail-sender-persona-view';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import type ConversationItemParts from 'owa-mail-store/lib/store/schema/ConversationItemParts';
import mailStore from 'owa-mail-store/lib/store/Store';
import { getItemToShowFromNodeId } from 'owa-mail-store/lib/utils/conversationsUtils';
import { getDensityModeString } from 'owa-fabric-theme';
import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';
import { lazyDeleteItems } from 'owa-mail-triage-action';
import { useComputed } from 'owa-react-hooks/lib/useComputed';
import { useCustomAnimationFrame } from 'owa-react-hooks/lib/useCustomAnimationFrame';
import { useCustomTimeout } from 'owa-react-hooks/lib/useCustomTimeout';
import type Message from 'owa-service/lib/contract/Message';
import * as trace from 'owa-trace';
import { isBrowserEdge } from 'owa-user-agent/lib/userAgent';
import * as React from 'react';
import onArchive from 'owa-mail-commands/lib/actions/onArchive';
import focusNextPrevItemPartOrArea, {
    tryGetNewFocusedNodeOnDelete,
} from 'owa-mail-reading-pane-store/lib/actions/focusNextPrevItemPart';
import {
    lazySetAutoMarkAsReadTimer,
    lazyClearAutoMarkAsReadTimer,
} from 'owa-mail-mark-read-actions';
import {
    isItemPartInCollapsedItemsRollUp,
    hasSeeMoreButton,
} from 'owa-mail-reading-pane-store/lib/utils/rollUp/collapsedItemsRollUpUtils';
import {
    renderConversationReadingPane,
    renderComponentsBySortOrder,
} from '../utils/readingPaneRenderChooser';
import {
    getInitiallySelectedItemPart,
    getFocusedItemPart,
    getFocusedItemArea,
} from 'owa-mail-reading-pane-store/lib/utils/focusedItemPartUtils';
import {
    hasExtendedCard,
    isExtendedCardCoveringOriginalContent,
    getExtendedCardViewState,
} from 'owa-mail-reading-pane-store/lib/utils/extendedCardUtils';
import classNamesBind from 'classnames/bind';

import styles from './ReadingPane.scss';
import conversationStyles from './ConversationReadingPane.scss';
const classNames = classNamesBind.bind(conversationStyles);
import inlineComposeStyles from './InlineComposeStyles.scss';
import { lazyGetZoomStyle } from 'owa-custom-zoom';
const inlineComposeClassNames = classNamesBind.bind(inlineComposeStyles);

const FOSSILIZED_TEXT_PEEK_HEIGHT = 140;
const SCROLL_ANIMATION_DURATION = 300;

export interface ConversationReadingPaneProps {
    conversationId: ClientItemId;
    conversationSubject: string;
    conversationCategories: string[];
    instrumentationContext?: InstrumentationContext;
    shouldNotFocusOnInitialRender?: boolean;
    isSxS?: boolean;
}

export default observer(function ConversationReadingPane(props: ConversationReadingPaneProps) {
    const [setFocusTimer] = useCustomTimeout();
    const [scrollToInlineComposeTimer] = useCustomTimeout();
    const [scrollToTopTask] = useCustomAnimationFrame();

    React.useEffect(() => {
        unregisterPromise.current = lazyRegisterComponent.importAndExecute(
            FocusComponent.ReadingPane,
            setFocusOnReadingPane
        );
        if (!readingPaneContainer.current) {
            trace.errorThatWillCauseAlert('readingPaneContainer should not be null');
        }
        tryFinishRenderNewConversation();
        window.addEventListener('beforeunload', readingPaneDisplayEnd);

        return () => {
            // Clean up any pending timers when unmounting
            lazyClearAutoMarkAsReadTimer.importAndExecute();
            if (unregisterPromise.current) {
                unregisterPromise.current.then(cb => cb());
            }
            if (scrollRegion.current) {
                scrollRegion.current.removeEventListener('scroll', onScrollRegionScroll);
            }
            if (isFocusInReadingPane()) {
                lazyResetFocus.importAndExecute();
            }
            window.removeEventListener('beforeunload', readingPaneDisplayEnd);
        };
    }, []);

    React.useEffect(() => {
        isRenderingNewConversation.current = true;
        shouldKeepFocus.current = isFocusInReadingPane();
        readingPaneDisplayStart(props.instrumentationContext);

        // In some cases sxs can be loaded before RP code is loaded
        // updateLoadedConversation is called before setting the readingPaneStore.sxsId
        // Meaning firstLoadConversationReadingPane will be skipped, if this happens we must call it here
        if (props.isSxS && conversationReadingPaneViewState.get()?.loadingState?.isLoading) {
            firstLoadConversationReadingPane(props.conversationId.Id);
        }
        return () => readingPaneDisplayEnd();
    }, [props.conversationId?.Id]);

    React.useEffect(() => {
        if (isRenderingNewConversation.current) {
            // Inline image store is used to support the local lie scenario within a single conversation.
            // Once we navigate to a different conversation, clear the store so we don't fill the browser memory with dataURIs.
            if (!isInlineImageStoreEmpty()) {
                lazyClearInlineImageStore.importAndExecute();
            }

            // Clear mark as read timer if it's still pending when switching to a new conversation
            lazyClearAutoMarkAsReadTimer.importAndExecute();

            tryFinishRenderNewConversation();
        } else if (inlineComposeViewState.get()) {
            executeInitialActions(composeInitialActions.current);
        }
    });

    const saveScrollPosition = React.useCallback(() => {
        if (scrollRegion.current) {
            saveConversationScrollPosition(
                conversationReadingPaneViewState.get(),
                scrollRegion.current
            );
        }
    }, [props.conversationId.Id]);

    const debouncedSaveScrollPosition = React.useMemo(
        () => debounce(saveScrollPosition, SAVE_SCROLL_DEBOUNCE),
        [saveScrollPosition]
    );

    const onScrollRegionScroll = React.useCallback(() => {
        const { itemIdToScrollTo } = conversationReadingPaneViewState.get();
        if (itemIdToScrollTo) {
            // Set the itemIdToScrollTo back to null when the user starts scrolling. This allows back to back scrolling for the same item.
            setItemIdToScrollTo(props.conversationId.Id, null /* itemId */);
        }

        if (!props.isSxS) {
            debouncedSaveScrollPosition();
        }
    }, [props.conversationId.Id, props.isSxS]);

    const isRenderingNewConversation = React.useRef<boolean>(true);
    const readingPaneContainer = React.useRef<HTMLDivElement>();
    const scrollRegion = React.useRef<HTMLDivElement>();
    const itemPartDivElementToScrollTo = React.useRef<HTMLDivElement>();
    const itemPartToScrollToHasFossilizedText = React.useRef<boolean>();
    const composeInitialActions = React.useRef<InitialActions>();
    const shouldKeepFocus = React.useRef<boolean>();
    const readingPaneDisplayStartDate = React.useRef<Date>();
    const unregisterPromise = React.useRef<Promise<() => void>>();
    const initiallySelectedItemId = React.useRef<string>();
    const initiallySelectedInternetMessageId = React.useRef<string>();
    const viewSessionGuid = React.useRef<string>();

    const conversationNodeIds_0 = useComputed((): string[] => {
        const composeViewState = inlineComposeViewState.get();
        const conversationItemParts = mailStore.conversations.get(props.conversationId.Id);
        if (!conversationItemParts || conversationItemParts.conversationNodeIds.length == 0) {
            return [];
        } else {
            return conversationItemParts.conversationNodeIds.filter(nodeId => {
                const item = getItemToShowFromNodeId(nodeId);
                // Skip the draft item which has an inline compose in current conversation.
                if (
                    composeViewState?.itemId &&
                    item &&
                    composeViewState.itemId.Id == item.ItemId.Id
                ) {
                    return false;
                }
                return true;
            });
        }
    });
    const latestNonDraftItemId_0 = useComputed((): string => {
        return getLastestNonDraftItemId(props.conversationId.Id);
    });
    const inlineComposeViewState = useComputed(
        (): ComposeViewState => {
            return findInlineComposeViewState(props.conversationId.Id);
        }
    );
    const shouldShowSeeMoreMessages_0 = useComputed((): boolean => {
        return hasSeeMoreButton(conversationReadingPaneViewState.get());
    });
    const firstItemInConversation = useComputed(
        (): Message => {
            return getFirstItemInConversation(props.conversationId.Id);
        }
    );
    const conversationReadingPaneViewState = useComputed(
        (): ConversationReadingPaneViewState => {
            return getConversationReadingPaneViewState(props.conversationId.Id);
        }
    );
    /**
     * Callback when the reading pane gains focus from the focus manager
     */
    const setFocusOnReadingPane = (): boolean => {
        if (scrollRegion.current) {
            scrollRegion.current.focus();
            return true;
        } else if (readingPaneContainer.current) {
            readingPaneContainer.current.focus();
            return true;
        } else {
            return false;
        }
    };
    const isFocusInReadingPane = (): boolean => {
        return (
            document.activeElement == readingPaneContainer.current ||
            readingPaneContainer.current.contains(document.activeElement)
        );
    };
    const handleFocusOnInlineComposeUnmount = () => {
        if (!isRenderingNewConversation.current && readingPaneContainer.current) {
            setFocusOnReadingPane();
        } else {
            lazyResetFocus.importAndExecute();
        }
    };
    const scrollToItemPart = (
        itemPartDivElement: HTMLDivElement,
        hasFossilizedText: boolean,
        shouldAnimate: boolean
    ) => {
        // handleItemPartScrolling can be hit before we have a reference to the scroll region.
        // If that happens, save the itemPartDivElement and fossilizedTextHeight to scroll when we get the reference.
        if (scrollRegion.current) {
            const newScrollTopGetter = function () {
                // If fossilizedText exists on this item and sort order is newestOnBottom, offset the scroll to show a peek
                const fossilizedTextOffset =
                    isNewestOnBottom() && hasFossilizedText ? FOSSILIZED_TEXT_PEEK_HEIGHT : 0;
                // If we have a null reference to the itemPartDivElement (VSO #25783), fallback to 0 for offset top.
                // This could result in a negative number set for scrollTop, but this is safe as browser set scrollTop back to 0 in this case.
                const itemPartOffsetTop = itemPartDivElement ? itemPartDivElement.offsetTop : 0;
                return itemPartOffsetTop - fossilizedTextOffset;
            };
            if (shouldAnimate) {
                // We don't animate for the initial render, so reflow isn't our concern in this case.
                animateScrollTop(
                    scrollRegion.current,
                    newScrollTopGetter(),
                    SCROLL_ANIMATION_DURATION
                );
            } else {
                scrollToInlineComposeTimer(() => {
                    const composeViewState = inlineComposeViewState.get();
                    // When there is inline compose, no need to scroll to item part and compose will handle the initial scrolling
                    if (!composeViewState) {
                        // // This is for initial render, which is the case we care about reflow.
                        // // Querying scroll/box metrics on item part and fossilized text results in forced reflow.
                        // // Add timer to let reflow unblock UI rendering.
                        if (scrollRegion.current) {
                            scrollRegion.current.scrollTop = newScrollTopGetter();
                        }
                    }
                }, 0);
            }
        } else {
            itemPartDivElementToScrollTo.current = itemPartDivElement;
            itemPartToScrollToHasFossilizedText.current = hasFossilizedText;
        }
    };
    const handleItemPartScrolling_0 = (
        viewState: ItemPartViewState,
        itemPartDivElement: HTMLDivElement,
        hasFossilizedText: boolean,
        isDelayLoadCallback?: boolean
    ) => {
        const { itemIdToScrollTo, savedScrollPosition } = conversationReadingPaneViewState.get();
        const viewStateItemId = viewState.itemId;
        const initiallySelectedItemPart = getInitiallySelectedItemPart();
        if (!(initiallySelectedItemId.current && initiallySelectedInternetMessageId.current)) {
            initiallySelectedItemId.current = initiallySelectedItemPart?.itemId;
            const message =
                initiallySelectedItemId.current &&
                (mailStore.items.get(initiallySelectedItemId.current) as Message);
            initiallySelectedInternetMessageId.current = message?.InternetMessageId;
        }
        if (itemIdToScrollTo) {
            // If this conversation has a specific itemId to scroll to, check for that regardless of sort order.
            if (viewStateItemId == itemIdToScrollTo) {
                scrollToItemPart(
                    itemPartDivElement,
                    hasFossilizedText,
                    !isRenderingNewConversation.current /* don't animate for initial scroll */
                );
            }
        } else if (!props.isSxS && savedScrollPosition) {
            scrollToTopTask(() => {
                if (scrollRegion.current) {
                    scrollRegion.current.scrollTop = savedScrollPosition;
                }
            });
        } else if (
            isNewestOnBottom() &&
            initiallySelectedItemPart &&
            (isRenderingNewConversation.current || isDelayLoadCallback)
        ) {
            // Otherwise, only handle scrolling for newest on bottom.
            // This is the initial scroll case for a new conversation or one with a delayLoaded component.
            // Note: isRenderingNewConversation will be set to true in didUpdate. While this method also immediately
            // calls tryFinishRenderNewConversation, selectedConversationReadingPaneState.loadingState.isLoading will
            // still be true, therefore this method will get hit before isRenderingNewConversation gets set to false.
            if (viewStateItemId == initiallySelectedItemPart.itemId) {
                // If the item has TxP data, don't scroll. This will keep the scroll position at 0 and the TxP cards visible.
                const item = mailStore.items.get(viewStateItemId);
                if (item && !item.EntityNamesMap) {
                    scrollToItemPart(
                        itemPartDivElement,
                        hasFossilizedText,
                        false /* shouldAnimate */
                    );
                }
            }
        }
    };
    const handleFosslizedTextCollapsed = (fossilizedTextOffsetTop: number) => {
        if (scrollRegion.current) {
            const distanceOffScrollRegionTop =
                scrollRegion.current.getBoundingClientRect().top - fossilizedTextOffsetTop;
            if (distanceOffScrollRegionTop) {
                // This handles scroll when NewestOnBottomFossilizedText top is OFF scrollRegion.
                scrollRegion.current.scrollTop -= distanceOffScrollRegionTop;
            }
        }
    };
    const handleQuotedBodyExpanded = (quotedBodyOffsetTop: number) => {
        if (scrollRegion.current) {
            const distanceOffScreen =
                quotedBodyOffsetTop - scrollRegion.current.getBoundingClientRect().bottom;
            if (distanceOffScreen > -FOSSILIZED_TEXT_PEEK_HEIGHT) {
                // This check will capture 2 scenarios:
                // 1. If distanceOffScreen is positive, the top of the quotedBody is OFF screen. We therefore want to scroll by this distance and the peek height
                // so the top of the quotedBody lands at the same height each time.
                //
                // 2. If the distanceOffScreen is negative, the top of the quotedBody is ON screen, but if it is greater than -FOSSILIZED_TEXT_PEEK_HEIGHT,
                // not enough of it is shown. We therefore want to scroll by FOSSILIZED_TEXT_PEEK_HEIGHT - Math.abs(distanceOffScreen). But since we know
                // distance off screen is negative in this case, the equation comes out the same.
                animateScrollTop(
                    scrollRegion.current,
                    scrollRegion.current.scrollTop +
                        distanceOffScreen +
                        FOSSILIZED_TEXT_PEEK_HEIGHT,
                    SCROLL_ANIMATION_DURATION
                );
            }
        }
    };

    /* Checks to see if we have finished rendering a new conversation */
    const tryFinishRenderNewConversation = () => {
        if (isRenderingNewConversation.current) {
            if (isCurrentConversationLoaded()) {
                // If we've just successfully rendered a new conversation, handle first render logic now
                isRenderingNewConversation.current = false;
                // Bug 16940: Reading Pane: mousedown+mousemove cannot select text in Edge
                // In Edge, if we do not dismiss text selection in previous conversationReadingPane,
                // we're unable to select text in current conversationReadingPane by mousedown and mousemove,
                // instead, a drag of the whole conversationReadingPane is triggered.
                // To resolve the issue, we clear text selection on render a new conversation.
                if (isBrowserEdge()) {
                    window.getSelection().empty();
                }
                // On first render of reading pane content, set focus on reading pane if needed
                if (!props.shouldNotFocusOnInitialRender) {
                    if (isReadingPanePositionOff() || shouldKeepFocus.current) {
                        // We care reflow for initial render. Set a timer to let reflow unblock UI rendering.
                        setFocusTimer(() => {
                            setFocusOnReadingPane();
                        }, 0);
                        shouldKeepFocus.current = false;
                    }
                }
                // On first render of reading pane content, handle auto mark as read now
                lazySetAutoMarkAsReadTimer.importAndExecute(props.conversationId.Id);
            }
        }
    };
    const isCurrentConversationLoaded = (): boolean => {
        const selectedConversationReadingPaneState = conversationReadingPaneViewState.get();
        return (
            selectedConversationReadingPaneState?.conversationId?.Id == props.conversationId?.Id && // Make sure store is in sync with component
            !selectedConversationReadingPaneState?.loadingState?.isLoading &&
            !selectedConversationReadingPaneState?.loadingState?.hasLoadFailed
        );
    };
    const renderInlineCompose = (composeViewState: ComposeViewState): JSX.Element => {
        const composeClassNames = inlineComposeClassNames(inlineComposeStyles.composeContainer, {
            isNewestOnTop: !isNewestOnBottom(),
            isFocused: true,
        });
        const senderPersona = (
            <SenderImage sender={null} displaySelf={true} style={inlineComposeStyles.senderImage} />
        );
        return (
            <div className={composeClassNames} key={`inlineComposeDiv_${props.conversationId.Id}`}>
                <Compose
                    viewState={composeViewState}
                    initialActions={composeInitialActions.current}
                    className={inlineComposeStyles.inlineCompose}
                    senderPersona={senderPersona}
                    onUnmountFocusCallback={handleFocusOnInlineComposeUnmount}
                />
            </div>
        );
    };
    const renderReadingPaneContent = (
        selectedConversationReadingPaneState: ConversationReadingPaneViewState
    ): JSX.Element => {
        const conversationItemParts = mailStore.conversations.get(props.conversationId.Id);
        const latestNonDraftItemId = latestNonDraftItemId_0.get();
        const composeViewState = inlineComposeViewState.get();
        let composeRendered = false;
        let seeMoreMessagesRendered = false;
        const shouldShowSeeMoreMessages = shouldShowSeeMoreMessages_0.get();
        const focusedItemPart = getFocusedItemPart();
        const { instrumentationContext } = selectedConversationReadingPaneState;
        const calendarItemId = hasExtendedCard(
            selectedConversationReadingPaneState,
            ExtendedCardType.CalendarCard
        )
            ? (getExtendedCardViewState(
                  selectedConversationReadingPaneState,
                  ExtendedCardType.CalendarCard
              ) as CalendarCardViewState).eventId
            : null;
        // When there is inline compose, no need to scroll to item part and compose will handle
        // the initial scrolling
        const handleItemPartScrolling = composeViewState ? () => {} : handleItemPartScrolling_0;
        const conversationNodeIds = conversationNodeIds_0.get();
        const isSingleItemConversation = conversationNodeIds.length == 1;
        const conversationContent =
            conversationNodeIds.length > 0
                ? conversationNodeIds.map((nodeId, index) => {
                      let seeMoreMessages = null;
                      // Render the see more messages when
                      // This node is bundled with the see more messages and show see more messages
                      if (
                          nodeId ==
                              selectedConversationReadingPaneState.nodeIdBundledWithSeeMoreMessages &&
                          shouldShowSeeMoreMessages
                      ) {
                          seeMoreMessages = renderSeeMoreMessages(
                              selectedConversationReadingPaneState,
                              conversationItemParts
                          );
                          seeMoreMessagesRendered = true;
                      }
                      const itemPart = selectedConversationReadingPaneState.itemPartsMap.get(
                          nodeId
                      );
                      if (!itemPart) {
                          // If the item part is not rendered, but there is see more button bundled to this node,
                          // Render the see more button.
                          return seeMoreMessages;
                      }
                      // If this item part is in collapsed items roll up, no need to render it now.
                      if (
                          isItemPartInCollapsedItemsRollUp(
                              selectedConversationReadingPaneState,
                              itemPart
                          )
                      ) {
                          return null;
                      }
                      // If this item part is in the roll up(oof roll up or calendar roll up),
                      // no need to render it as normal item part.
                      if (itemPart.isInRollUp) {
                          return null;
                      }
                      let inlineCompose = null;
                      if (composeViewState) {
                          const conversationNode = mailStore.conversationNodes.get(nodeId);
                          if (
                              conversationNode &&
                              conversationNode.itemIds.indexOf(
                                  composeViewState.referenceItemId.Id
                              ) >= 0
                          ) {
                              inlineCompose = renderInlineCompose(composeViewState);
                              composeRendered = true;
                          }
                      }
                      const className = classNames(conversationStyles.itemPart, {
                          hasCompose: !!inlineCompose,
                      });
                      let isFocused;
                      // We shouldn't show focused state if there is an inline compose open
                      if (composeViewState) {
                          isFocused = false;
                      } else {
                          isFocused =
                              itemPart.conversationNodeId == focusedItemPart?.conversationNodeId;
                      }
                      const isLatestNonDraft = latestNonDraftItemId == itemPart.itemId;
                      const focusArea = isFocused ? getFocusedItemArea() : null;
                      const shouldNotGrabFocus =
                          isFocused &&
                          selectedConversationReadingPaneState.focusedItemPart.shouldNotGrabFocus;
                      return (
                          <div key={`itemPartDiv_${itemPart.itemId}`} className={className}>
                              {renderComponentsBySortOrder([
                                  <ItemPart
                                      key={`itemPart_${itemPart.itemId}`}
                                      instrumentationContext={instrumentationContext}
                                      viewState={itemPart}
                                      handleItemPartScrolling={handleItemPartScrolling}
                                      quotedBodyExpandedCallback={handleQuotedBodyExpanded}
                                      fossilizedTextCollapsedCallback={handleFosslizedTextCollapsed}
                                      isLatestNonDraft={isLatestNonDraft}
                                      focusedArea={focusArea}
                                      isFirstItemInConversation={
                                          isNewestOnBottom()
                                              ? index == 0
                                              : index == conversationNodeIds.length - 1
                                      }
                                      isSingleItemConversation={isSingleItemConversation}
                                      calendarItemId={calendarItemId}
                                      shouldNotGrabFocus={shouldNotGrabFocus}
                                      isSingleLineListView={isReadingPanePositionOff()}
                                  />,
                                  inlineCompose,
                                  seeMoreMessages,
                              ])}
                          </div>
                      );
                  })
                : null;
        const inlineCompose =
            composeViewState && !composeRendered ? renderInlineCompose(composeViewState) : null;
        // Render the see more messages if see more messages should be rendered, but not rendered yet,
        const seeMoreMessages =
            !seeMoreMessagesRendered && shouldShowSeeMoreMessages && conversationItemParts
                ? renderSeeMoreMessages(selectedConversationReadingPaneState, conversationItemParts)
                : null;
        return renderConversationReadingPane(conversationContent, inlineCompose, seeMoreMessages);
    };
    const setScrollRegionRef = (ref: HTMLDivElement) => {
        if (ref) {
            scrollRegion.current = ref;
            scrollRegion.current.addEventListener('scroll', onScrollRegionScroll);
            if (itemPartDivElementToScrollTo.current) {
                scrollToItemPart(
                    itemPartDivElementToScrollTo.current,
                    itemPartToScrollToHasFossilizedText.current,
                    false /* shouldAnimate */
                );
                itemPartDivElementToScrollTo.current = null;
                itemPartToScrollToHasFossilizedText.current = false;
            }
        } else {
            if (scrollRegion.current) {
                scrollRegion.current.removeEventListener('scroll', onScrollRegionScroll);
                scrollRegion.current = null;
            }
        }
    };
    const readingPaneDisplayStart = (instrumentationContext: InstrumentationContext) => {
        readingPaneDisplayStartDate.current = new Date();
        if (instrumentationContext) {
            userMailInteractionAction('ReadingPaneDisplayStart', [instrumentationContext]);
        }
        viewSessionGuid.current = getGuid();
    };
    const readingPaneDisplayEnd = () => {
        if (props.instrumentationContext) {
            userMailInteractionAction('ReadingPaneDisplayEnd', [props.instrumentationContext]);
        }
        lazyLogSigsDatapoint.importAndExecute('ViewMessage', {
            start: readingPaneDisplayStartDate.current,
            itemId: initiallySelectedInternetMessageId.current,
            customProperties: {
                MessageIdType: 'MessageODataId',
                MessageId: initiallySelectedItemId.current,
                ConversationId: props.conversationId.Id,
            },
            instanceId: viewSessionGuid.current,
        });

        initiallySelectedItemId.current = null;
        initiallySelectedInternetMessageId.current = null;
        viewSessionGuid.current = null;
    };
    const getExtendedCards = (
        selectedConversationReadingPaneState: ConversationReadingPaneViewState
    ): {
        cardInScrollRegion: JSX.Element;
        cardOutsideScrollRegion: JSX.Element;
    } => {
        let cardInScrollRegion = null;
        let cardOutsideScrollRegion = null;
        const { extendedCardViewState } = selectedConversationReadingPaneState;
        if (extendedCardViewState) {
            const extendedCardWrapper = (
                <ExtendedCardWrapper
                    key={`extendedCard_${props.conversationId.Id}`}
                    extendedCardViewState={extendedCardViewState}
                />
            );
            if (extendedCardViewState.inScrollRegion) {
                cardInScrollRegion = extendedCardWrapper;
            } else {
                cardOutsideScrollRegion = extendedCardWrapper;
            }
        }
        return { cardInScrollRegion, cardOutsideScrollRegion };
    };
    const renderSubjectHeader = (
        selectedConversationReadingPaneState: ConversationReadingPaneViewState
    ): JSX.Element => {
        const { conversationId, conversationSubject, conversationCategories, isSxS } = props;
        const firstItem = firstItemInConversation.get();
        const isYammerCard = hasExtendedCard(
            selectedConversationReadingPaneState,
            ExtendedCardType.Yammer
        );
        const stackedSubjectHeader = isFeatureEnabled('mon-tri-subjectHeader');
        return (
            <div
                className={classNames(
                    conversationStyles.subjectContainer,
                    stackedSubjectHeader && conversationStyles.stackedSubjectHeader,
                    {
                        isSpecialCaseCard: isYammerCard,
                    }
                )}>
                <SubjectHeader
                    className={classNames(
                        conversationStyles.subject,
                        isFeatureEnabled('mon-densities') && getDensityModeString(),
                        stackedSubjectHeader && conversationStyles.stackedSubjectHeader,
                        {
                            isSpecialCaseCard: isYammerCard,
                        }
                    )}
                    subject={conversationSubject}
                    categories={conversationCategories}
                    firstItemId={firstItem ? firstItem.ItemId.Id : null}
                    viewState={selectedConversationReadingPaneState}
                    specialCardIconName={isYammerCard ? ControlIcons.YammerLogo : null}
                    isSxS={isSxS}
                />
                <ConversationHeaderIcons conversationId={conversationId.Id} />
            </div>
        );
    };

    const isFocusInFluid = (target: HTMLElement) => {
        if (!isFeatureEnabled('cmp-prague')) {
            return false;
        }
        while (target) {
            if (target.dataset.fluidContainer) {
                return true;
            }
            target = target.parentElement;
        }
        return false;
    };
    /**
     * Hot keys
     */
    // Close mail is tied to the esc key in certain key sets.
    // Only when we know we are exiting from the immersive mode
    // we stop propagation else we let the event to propagate
    useKeydownHandler(
        readingPaneContainer,
        getCommands().closeMail,
        (evt: KeyboardEvent) => {
            // Return to listview from immersive mode and stop propagation
            if (!shouldShowListView()) {
                evt.stopPropagation();
                closeImmersiveReadingPane('Keyboard');
            }
        },
        { stopPropagation: false }
    );

    useKeydownHandler(readingPaneContainer, getCommands().expandCollapseAll, () => {
        expandCollapseAllItemParts(
            props.conversationId.Id,
            !isAllItemPartsExpanded(props.conversationId.Id) /*shouldExpand*/,
            true /*isFromShortcut*/
        );
    });

    useKeydownHandler(readingPaneContainer, getCommands().expandAll, () => {
        expandCollapseAllItemParts(
            props.conversationId.Id,
            true /*shouldExpand*/,
            true /*isFromShortcut*/
        );
    });

    useKeydownHandler(readingPaneContainer, getCommands().collapseAll, () => {
        expandCollapseAllItemParts(
            props.conversationId.Id,
            false /*shouldExpand*/,
            true /*isFromShortcut*/
        );
    });

    useKeydownHandler(readingPaneContainer, getCommands().focusNextItemPart, () => {
        if (!inlineComposeViewState.get()) {
            focusNextPrevItemPartOrArea(props.conversationId.Id, 1);
            logSelectionUIHotKeyUsage(SelectionUIHotkey.FocusNextItemPart);
        }
    });

    useKeydownHandler(readingPaneContainer, getCommands().focusPrevItemPart, () => {
        if (!inlineComposeViewState.get()) {
            focusNextPrevItemPartOrArea(props.conversationId.Id, -1);
            logSelectionUIHotKeyUsage(SelectionUIHotkey.FocusPrevItemPart);
        }
    });

    useKeydownHandler(
        readingPaneContainer,
        'enter',
        (ev: KeyboardEvent) => {
            const target = ev.target as HTMLElement;
            const tagName = target.tagName.toLowerCase();
            // Blacklist all things that we render in an ItemPart
            // that already have an action bound to 'enter'
            if (
                tagName != 'a' &&
                tagName != 'button' &&
                !target.classList.contains('lpc-hoverTarget') &&
                !isFocusInFluid(target)
            ) {
                expandCollapseFocusedItemPart(props.conversationId.Id);
                logSelectionUIHotKeyUsage(SelectionUIHotkey.EnterToToggleExpandCollapse);
            }
        },
        {
            stopPropagation: false,
            preventDefault: false,
        }
    );

    useKeydownHandler(readingPaneContainer, getCommands().deleteMail, () => {
        if (getFocusedItemArea() == FocusedItemArea.Item) {
            const focusedItemPart = getFocusedItemPart();
            if (focusedItemPart?.isExpanded) {
                const newFocusedNode = tryGetNewFocusedNodeOnDelete(
                    props.conversationId.Id,
                    focusedItemPart
                );
                const itemId = focusedItemPart.itemId;
                const item = mailStore.items.get(itemId);
                if (item) {
                    lazyDeleteItems
                        .importAndExecute(
                            [itemId],
                            getDefaultDisposalType(itemId),
                            [props.instrumentationContext],
                            'Keyboard',
                            item.MailboxInfo,
                            true /* disableResetFocus */
                        )
                        .then(() => {
                            // set focusedItemPart in the callback is to make sure itemPartDiv.focus() scroll to the correct position
                            setFocusedItemPart(newFocusedNode, item.ConversationId.Id);
                        });
                }
            }
        }
    });

    useKeydownHandler(readingPaneContainer, getCommands().archiveMail, () => {
        const tableView = getSelectedTableView();
        // archiving is disabled for groups
        if (isGroupTableQuery(tableView.tableQuery)) {
            return;
        }
        onArchive('Keyboard');
    });

    const selectedConversationReadingPaneState = conversationReadingPaneViewState.get();
    const showInfoPage =
        !selectedConversationReadingPaneState ||
        selectedConversationReadingPaneState.loadingState.isLoading ||
        selectedConversationReadingPaneState.loadingState.hasLoadFailed ||
        selectedConversationReadingPaneState.unsupportedItemId; // Info page could be <Spinner />, <EmptyStateReadingPane /> or <UnsupportedItemReadingPane />
    const subjectHeader = renderSubjectHeader(selectedConversationReadingPaneState);
    let content: JSX.Element = null;
    if (showInfoPage) {
        content = (
            <>
                {subjectHeader}
                {<ConversationReadingPaneInfoPage />}
            </>
        );
    } else if (!isCurrentConversationLoaded()) {
        // During transition, the conversation id in conversationReadingPaneViewState and this.props are not matched
        // which means that the current conversation is not loaded yet, only show the header during the transition
        content = subjectHeader;
    } else {
        let composeDock: JSX.Element = null;
        // Data is ready for render
        inlineComposeViewState.get();
        if (inlineComposeViewState.get()) {
            // Create compose initial actions and set scroll region
            composeInitialActions.current = createInitialActions();
            composeDock = (
                <Dock
                    viewState={inlineComposeViewState.get()}
                    initialActions={composeInitialActions.current}
                />
            );
        }
        const conversationReadingPaneContent = renderReadingPaneContent(
            selectedConversationReadingPaneState
        );

        const { cardInScrollRegion, cardOutsideScrollRegion } = getExtendedCards(
            selectedConversationReadingPaneState
        );
        const getZoomStyle = lazyGetZoomStyle.tryImportForRender();
        const scrollRegionContent = (
            <>
                <div className={getZoomStyle?.()}>{conversationReadingPaneContent}</div>
                <div className={styles.scrollRegionBottomBuffer} />
            </>
        );
        if (hasExtendedCard(selectedConversationReadingPaneState, ExtendedCardType.CalendarCard)) {
            content = (
                <>
                    {cardOutsideScrollRegion}
                    {getScrollRegion(
                        <CalendarCardBottom
                            viewState={
                                getExtendedCardViewState(
                                    selectedConversationReadingPaneState,
                                    ExtendedCardType.CalendarCard
                                ) as CalendarCardViewState
                            }
                            messagePane={scrollRegionContent}
                            unreadMessageCount={getUnreadMessageCount(
                                selectedConversationReadingPaneState
                            )}
                            messageScrollRef={setScrollRegionRef}
                        />,
                        composeDock
                    )}
                </>
            );
        } else {
            content = (
                <>
                    {subjectHeader}
                    {cardOutsideScrollRegion}
                    {selectedConversationReadingPaneState &&
                        !isExtendedCardCoveringOriginalContent(
                            selectedConversationReadingPaneState
                        ) &&
                        getScrollRegion(
                            <div
                                tabIndex={-1}
                                /* Add tab index to allow container to be scrollable via keyboard */ ref={
                                    setScrollRegionRef
                                }
                                data-is-scrollable={true}
                                className={classNames(styles.scrollRegion, 'customScrollBar')}>
                                {cardInScrollRegion}
                                {scrollRegionContent}
                            </div>,
                            composeDock
                        )}
                </>
            );
        }
    }
    return (
        <div
            tabIndex={-1}
            role={'main'}
            aria-label={loc(contentPaneLabel)}
            className={classNames(conversationStyles.flexContainer)}
            ref={ref => (readingPaneContainer.current = ref)}>
            {content}
        </div>
    );
});

function renderSeeMoreMessages(
    selectedConversationReadingPaneState: ConversationReadingPaneViewState,
    conversationItemParts: ConversationItemParts
): JSX.Element {
    const conversationId = selectedConversationReadingPaneState.conversationId.Id;
    return (
        <SeeMoreMessages
            key={conversationId}
            conversationReadingPaneViewState={selectedConversationReadingPaneState}
            canLoadMore={conversationItemParts.canLoadMore}
            isFocused={getFocusedItemArea() == FocusedItemArea.SeeMore}
            isLoadMoreInProgress={conversationItemParts.isLoadMoreInProgress}
            isCalendarCardOpen={hasExtendedCard(
                selectedConversationReadingPaneState,
                ExtendedCardType.CalendarCard
            )}
        />
    );
}

function getScrollRegion(content: JSX.Element, composeDock: JSX.Element): JSX.Element {
    return (
        <div className={conversationStyles.scrollRegionContainer}>
            {content}
            {composeDock}
        </div>
    );
}
