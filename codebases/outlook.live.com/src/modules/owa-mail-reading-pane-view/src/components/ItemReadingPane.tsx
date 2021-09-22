import ItemReadingPaneContent from './ItemReadingPaneContent';
import SubjectHeader from './SubjectHeader';
import SupportedItemReadingPaneLoadedContent from './SupportedItemReadingPaneLoadedContent';
import UnsupportedItemReadingPane from './UnsupportedItemReadingPane';
import { SAVE_SCROLL_DEBOUNCE } from '../utils/saveScrollPositionUtils';
import debounce from 'lodash/debounce';
import { observer } from 'mobx-react-lite';
import { lazyLogSigsDatapoint } from 'owa-analytics';
import type { ClientItemId } from 'owa-client-ids';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import * as GetItemManager from 'owa-get-item-manager';
import { isGroupTableQuery } from 'owa-group-utils';
import { getGuid } from 'owa-guid';
import { useKeydownHandler } from 'owa-hotkeys';
import { createInitialActions, executeInitialActions, InitialActions } from 'owa-initial-actions';
import loc from 'owa-localize';
import { contentPaneLabel } from 'owa-locstrings/lib/strings/contentpanelabel.locstring.json';
import { itemHeaderForward } from 'owa-locstrings/lib/strings/itemheaderforward.locstring.json';
import { itemHeaderReply } from 'owa-locstrings/lib/strings/itemheaderreply.locstring.json';
import { itemHeaderReplyAll } from 'owa-locstrings/lib/strings/itemheaderreplyall.locstring.json';
import closeImmersiveReadingPane from 'owa-mail-actions/lib/closeImmersiveReadingPane';
import { closeDeeplinkReadingPane } from 'owa-mail-actions/lib/readingPaneActions';
import { userMailInteractionAction } from 'owa-mail-actions/lib/triage/userMailInteractionAction';
import { lazyForwardMessage, lazyReplyToMessage } from 'owa-mail-compose-actions';
import findInlineComposeViewState from 'owa-mail-compose-actions/lib/utils/findInlineComposeViewState';
import type { ComposeViewState } from 'owa-mail-compose-store';
import { Compose, Dock } from 'owa-mail-compose-view';
import { ExtendedCardWrapper } from 'owa-mail-extended-card';
import { FocusComponent, lazyRegisterComponent } from 'owa-mail-focus-manager';
import { getCommands } from 'owa-mail-hotkeys/lib/utils/MailModuleHotKeys';
import { isReadingPanePositionOff } from 'owa-mail-layout/lib/selectors/readingPanePosition';
import { shouldShowListView } from 'owa-mail-layout/lib/selectors/shouldShowListView';
import getSelectedTableViewId from 'owa-mail-list-store/lib/utils/getSelectedTableViewId';
import initItemLocale from 'owa-mail-reading-pane-store/lib/actions/translation/initItemLocale';
import { saveItemScrollPosition } from 'owa-mail-reading-pane-store/lib/mutators/saveScrollPositionMutators';
import type ItemReadingPaneViewState from 'owa-mail-reading-pane-store/lib/store/schema/ItemReadingPaneViewState';
import type LoadingState from 'owa-mail-reading-pane-store/lib/store/schema/LoadingState';
import getDefaultDisposalType from 'owa-mail-reading-pane-store/lib/utils/getDefaultDisposalType';
import { SenderImage } from 'owa-mail-sender-persona-view';
import type { ClientItem } from 'owa-mail-store';
import mailStore from 'owa-mail-store/lib/store/Store';
import getItemRightsManagementRestrictions from 'owa-mail-store/lib/utils/getItemRightsManagementRestrictions';
import { lazyLoadActiveVotingProviders } from 'owa-mail-voting';
import { useComputed } from 'owa-react-hooks/lib/useComputed';
import { useCustomAnimationFrame } from 'owa-react-hooks/lib/useCustomAnimationFrame';
import { useCustomTimeout } from 'owa-react-hooks/lib/useCustomTimeout';
import type FlagStatus from 'owa-service/lib/contract/FlagStatus';
import type Message from 'owa-service/lib/contract/Message';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { lazyIsSmimeItemDecoding } from 'owa-smime';
import SmimeType from 'owa-smime-adapter/lib/store/schema/SmimeType';
import getSmimeType from 'owa-smime/lib/utils/getSmimeType';
import isSMIMEItem from 'owa-smime/lib/utils/isSMIMEItem';
import showActionBlockedDialog from 'owa-smime/lib/utils/showActionBlockedDialog';
import * as trace from 'owa-trace';
import * as React from 'react';
import onArchive from 'owa-mail-commands/lib/actions/onArchive';
import ExtendedCardViewState, {
    ExtendedCardType,
} from 'owa-mail-reading-pane-store/lib/store/schema/ExtendedCardViewState';
import {
    getSelectedTableView,
    isItemOfMessageType,
    shouldSuppressServerMarkReadOnReplyOrForward,
} from 'owa-mail-list-store';
import {
    lazyClearAutoMarkAsReadTimer,
    lazySetAutoMarkAsReadTimer,
    lazyMarkItemAsReadFromReadingPane,
} from 'owa-mail-mark-read-actions';
import {
    lazyDeleteItems,
    lazyMarkItemJunkNotJunkFromReadingPane,
    lazySetItemsFlagStateFromItemIds,
} from 'owa-mail-triage-action';
import {
    isExtendedCardCoveringOriginalContent,
    hasExtendedCard,
} from 'owa-mail-reading-pane-store/lib/utils/extendedCardUtils';
import ProjectionContext from 'owa-popout-v2/lib/context/ProjectionContext';
import getTabIdFromProjection from 'owa-popout-v2/lib/utils/getTabIdFromProjection';
import { getDensityModeString } from 'owa-fabric-theme';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import classNamesBind from 'classnames/bind';
import ItemHeaderIcons from './ItemHeaderIcons';

import styles from './ReadingPane.scss';
import itemReadingPaneStyles from './ItemReadingPane.scss';
const itemReadingPaneClassNames = classNamesBind.bind(itemReadingPaneStyles);
import classNames from 'classnames';

import inlineComposeStyles from './InlineComposeStyles.scss';
const inlineComposeClassNames = classNamesBind.bind(inlineComposeStyles);
import { lazyGetZoomStyle } from 'owa-custom-zoom';

export interface ItemReadingPaneProps {
    itemId: ClientItemId;
    itemReadingPaneViewState: ItemReadingPaneViewState;
    itemSubject?: string;
    item?: ClientItem;
    isItemAttachment?: boolean;
    isPopout?: boolean;
    onLoad?: () => void;
    onLoadFailed?: () => void;
    isSxS?: boolean;
}

export default observer(function ItemReadingPane(props: ItemReadingPaneProps) {
    props = {
        item: mailStore.items.get(props.itemId?.Id),
        ...props,
    };
    const [setFocusTimer] = useCustomTimeout();
    const [scrollToTopTask] = useCustomAnimationFrame();
    const targetWindow = React.useContext(ProjectionContext);

    React.useEffect(() => {
        window.addEventListener('beforeunload', readingPaneDisplayEnd);
        unregisterPromise.current = lazyRegisterComponent.importAndExecute(
            FocusComponent.ReadingPane,
            setFocusOnReadingPane
        );
        if (!readingPaneContainer.current) {
            trace.errorThatWillCauseAlert('readingPaneContainer should not be null');
        }
        tryFinishRenderNewItem();

        return () => {
            // Clean up any pending timers when unmounting
            lazyClearAutoMarkAsReadTimer.importAndExecute();
            if (unregisterPromise.current) {
                unregisterPromise.current.then(cb => cb());
            }

            if (scrollRegion.current) {
                scrollRegion.current.removeEventListener('scroll', onScrollRegionScroll);
            }
            window.removeEventListener('beforeunload', readingPaneDisplayEnd);
        };
    }, []);

    const isRenderingNewItem = React.useRef<boolean>(true);
    const scrollRegion = React.useRef<HTMLDivElement>();
    const readingPaneContainer = React.useRef<HTMLDivElement>();
    const readingPaneDisplayStartDate = React.useRef<Date>();
    const composeInitialActions = React.useRef<InitialActions>();
    const unregisterPromise = React.useRef<Promise<() => void>>();
    const internetMessageId = React.useRef<string>();
    const viewSessionGuid = React.useRef<string>();

    const inlineComposeViewState_0 = useComputed(
        (): ComposeViewState => {
            return findInlineComposeViewState(
                props.itemId?.Id,
                ReactListViewType.Message,
                false /*includeDelaySend*/,
                getTabIdFromProjection(targetWindow)
            );
        }
    );
    const inlineComposeViewState = inlineComposeViewState_0.get();

    React.useEffect(() => {
        isRenderingNewItem.current = true;
        readingPaneDisplayStart();
        return () => readingPaneDisplayEnd();
    }, [props.itemId?.Id]);

    React.useEffect(() => {
        if (props.item) {
            internetMessageId.current = (props.item as Message).InternetMessageId;
        }
    }, [props.item]);

    React.useEffect(() => {
        if (isRenderingNewItem.current) {
            // Clear mark as read timer if it's still pending when switching to a new item
            lazyClearAutoMarkAsReadTimer.importAndExecute();
            tryFinishRenderNewItem();
        } else if (inlineComposeViewState_0.get()) {
            executeInitialActions(composeInitialActions.current);
        }
    });

    const setScrollRegionRef = (ref: HTMLDivElement) => {
        if (ref) {
            scrollRegion.current = ref;
            scrollRegion.current.addEventListener('scroll', onScrollRegionScroll);
        } else {
            if (scrollRegion.current) {
                scrollRegion.current.removeEventListener('scroll', onScrollRegionScroll);
                scrollRegion.current = null;
            }
        }
    };

    const saveScrollPosition = React.useCallback(() => {
        if (scrollRegion.current) {
            saveItemScrollPosition(props.itemReadingPaneViewState, scrollRegion.current);
        }
    }, [props.itemReadingPaneViewState]);

    const debouncedSaveScrollPosition = React.useMemo(
        () => debounce(saveScrollPosition, SAVE_SCROLL_DEBOUNCE),
        [saveScrollPosition]
    );

    const onScrollRegionScroll = React.useCallback(() => {
        if (!props.isSxS) {
            debouncedSaveScrollPosition();
        }
    }, [props.itemReadingPaneViewState, props.isSxS]);

    const loadingState_0 = useComputed(
        (): LoadingState => {
            // Create a local loadingState here so isLoading can take itemId into consideration.
            // If the itemId in props is out of sync with the store, we're loading a new item.
            // When we render an item view that has inlineCompose in it, for loading we need to check the itemId and referenceItemId match.
            let isLoading: boolean;
            if (props.itemReadingPaneViewState) {
                if (inlineComposeViewState_0.get()) {
                    isLoading =
                        props.itemReadingPaneViewState.loadingState.isLoading ||
                        props.itemId?.Id != inlineComposeViewState_0.get().referenceItemId.Id;
                } else {
                    isLoading = props.itemReadingPaneViewState.loadingState.isLoading;
                }
            }
            const loadingState: LoadingState = props.itemReadingPaneViewState && {
                isLoading: isLoading,
                hasLoadFailed: props.itemReadingPaneViewState.loadingState.hasLoadFailed,
            };
            return loadingState;
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
    const isGroupItem = () => {
        return props.item?.MailboxInfo && props.item.MailboxInfo.type == 'GroupMailbox';
    };
    const tryFinishRenderNewItem = () => {
        if (isRenderingNewItem.current) {
            if (isCurrentItemLoaded()) {
                isRenderingNewItem.current = false;
                if (props.onLoad) {
                    props.onLoad();
                }

                // Scroll to top after a new message is rendered.
                scrollToTopTask(() => {
                    if (scrollRegion.current) {
                        scrollRegion.current.scrollTop = props.itemReadingPaneViewState
                            .savedScrollPosition
                            ? props.itemReadingPaneViewState.savedScrollPosition
                            : 0;
                    }
                });

                // On first render of reading pane content, set focus on reading pane if needed
                if (isReadingPanePositionOff()) {
                    // We care reflow for initial render. Set a timer to let reflow unblock UI rendering.
                    setFocusTimer(() => {
                        setFocusOnReadingPane();
                    }, 0);
                }
                if (isItemOfMessageType(props.item)) {
                    lazySetAutoMarkAsReadTimer.importAndExecute(props.itemId?.Id);
                }
                if ((props.item as Message)?.VotingInformation) {
                    lazyLoadActiveVotingProviders
                        .import()
                        .then(loadActiveVotingProviders =>
                            loadActiveVotingProviders(props.itemId?.Id)
                        );
                }
                // When this item is loaded, try to get the additional properties for this item.
                // Do nothing for item attachment preview
                if (!props.isItemAttachment) {
                    GetItemManager.lazyGetAdditionalPropertiesFromServer
                        .import()
                        .then(getAdditionalPropertiesFromServer => {
                            getAdditionalPropertiesFromServer(
                                props.itemId?.Id,
                                ReactListViewType.Message,
                                shouldShowUnstackedReadingPane()
                                    ? 'UnstackedReadingPane' // scenario name to help decide whether we want to use Hx resolver or not
                                    : null
                            );
                            // Initialize item locale for inline translation
                            initItemLocale(
                                props.item,
                                props.itemReadingPaneViewState.itemViewState
                            );
                        });
                }
            } else if (isCurrentItemLoadedFailed()) {
                if (props.onLoadFailed) {
                    props.onLoadFailed();
                }
            }
        }
    };
    const isCurrentItemLoaded = () => {
        return (
            props.itemReadingPaneViewState &&
            props.itemReadingPaneViewState.itemId == props.itemId?.Id && // Make sure store is in sync with component
            !props.itemReadingPaneViewState.loadingState.isLoading &&
            !props.itemReadingPaneViewState.loadingState.hasLoadFailed
        );
    };
    const isCurrentItemLoadedFailed = () => {
        return (
            props.itemReadingPaneViewState &&
            props.itemReadingPaneViewState.itemId === props.itemId?.Id && // Make sure store is in sync with component
            props.itemReadingPaneViewState.loadingState.hasLoadFailed
        );
    };
    const createContainer = () => {
        const { item, itemReadingPaneViewState, isItemAttachment } = props;
        return itemReadingPaneViewState.isUnsupportedItem && !isItemAttachment ? (
            <UnsupportedItemReadingPane
                itemId={item?.ItemId?.Id}
                isItemAttachment={isItemAttachment}
            />
        ) : (
            !isExtendedCardCoveringOriginalContent(itemReadingPaneViewState) && (
                <SupportedItemReadingPaneLoadedContent
                    {...props}
                    irmRestrictions={getItemRightsManagementRestrictions(item)}
                    isCurrentItemLoaded={isCurrentItemLoaded()}
                    isSingleLineListView={isReadingPanePositionOff()}
                />
            )
        );
    };

    const getExtendedCards = React.useCallback(() => {
        let cardInScrollRegion = null;
        let cardOutsideScrollRegion = null;
        if (props.itemReadingPaneViewState) {
            const { extendedCardViewState } = props.itemReadingPaneViewState;
            if (extendedCardViewState) {
                const extendedCardWrapperElement = (
                    <ExtendedCardWrapper
                        key={`extendedCard_${props.itemId?.Id}`}
                        extendedCardViewState={extendedCardViewState}
                    />
                );
                if (extendedCardViewState.inScrollRegion) {
                    cardInScrollRegion = extendedCardWrapperElement;
                } else {
                    cardOutsideScrollRegion = getOutsideExtendedCardWrapper(
                        extendedCardViewState,
                        extendedCardWrapperElement
                    );
                }
            }
        }
        return { cardInScrollRegion, cardOutsideScrollRegion };
    }, [props.itemReadingPaneViewState?.extendedCardViewState]);
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
            if (!shouldShowListView()) {
                evt.stopPropagation();
                closeImmersiveReadingPane('Keyboard');
            }
        },
        { stopPropagation: false }
    );

    const isResponseBlockedForSmimeDecoding = async (): Promise<boolean> => {
        const isSmimeItemDecoding = await lazyIsSmimeItemDecoding.import();
        return isSmimeItemDecoding(props.item);
    };
    const shouldBlockResponseForSmimeItem = async (): Promise<boolean> => {
        return isSMIMEItem(props.item) && !isConsumer() && isResponseBlockedForSmimeDecoding();
    };

    useKeydownHandler(readingPaneContainer, getCommands().reply, async () => {
        // Block response to S/MIME item when item is decoding
        if (await shouldBlockResponseForSmimeItem()) {
            showActionBlockedDialog(loc(itemHeaderReply));
            return;
        }
        // Reply is disabled for groups and item previews
        if (
            !isGroupItem() &&
            !props.isItemAttachment &&
            getItemRightsManagementRestrictions(props.item).ReplyAllowed
        ) {
            replyReplyAllInternal(false /* isReplyAll */);
        }
    });

    useKeydownHandler(readingPaneContainer, getCommands().replyAll, async () => {
        // Block response to S/MIME item when item is decoding
        if (await shouldBlockResponseForSmimeItem()) {
            showActionBlockedDialog(loc(itemHeaderReplyAll));
            return;
        }

        // Reply all is disabled for item previews
        if (
            !props.isItemAttachment &&
            getItemRightsManagementRestrictions(props.item).ReplyAllAllowed
        ) {
            replyReplyAllInternal(true /* isReplyAll */);
        }
    });

    const replyReplyAllInternal = (isReplyAll: boolean) => {
        lazyReplyToMessage.importAndExecute({
            referenceItemOrId: props.item || props.itemId?.Id,
            mailboxInfo: props.itemId?.mailboxInfo,
            isReplyAll: isReplyAll,
            useFullCompose: true,
            actionSource: 'Keyboard',
            instrumentationContexts: getInstrumentationContext(),
            conversationId: null,
            suppressServerMarkReadOnReplyOrForward: shouldSuppressServerMarkReadOnReplyOrForward(
                getSelectedTableView()
            ),
        });
    };

    useKeydownHandler(readingPaneContainer, getCommands().forward, async () => {
        // Block response to S/MIME item when item is decoding
        if (await shouldBlockResponseForSmimeItem()) {
            showActionBlockedDialog(loc(itemHeaderForward));
            return;
        }

        // Forward is disabled for item previews
        if (
            !props.isItemAttachment &&
            getItemRightsManagementRestrictions(props.item).ForwardAllowed
        ) {
            lazyForwardMessage.importAndExecute(
                props.item || props.itemId?.Id,
                props.itemId?.mailboxInfo,
                'Keyboard',
                getInstrumentationContext(),
                shouldSuppressServerMarkReadOnReplyOrForward(getSelectedTableView())
            );
        }
    });

    useKeydownHandler(readingPaneContainer, getCommands().archiveMail, async () => {
        const tableView = getSelectedTableView();

        // tableView is null in case of deeplink.
        // VSO 86013 tracks the absence of archive functionality in deeplink.
        if (tableView) {
            // archiving is disabled for groups
            if (isGroupTableQuery(tableView.tableQuery)) {
                return;
            }
            onArchive('Keyboard');
        }
    });

    useKeydownHandler(readingPaneContainer, getCommands().markAsJunk, () => {
        const tableView = getSelectedTableView();
        // mark as junk is disabled for groups
        if (isGroupTableQuery(tableView?.tableQuery)) {
            return;
        }
        lazyMarkItemJunkNotJunkFromReadingPane
            .importAndExecute(
                props.itemId?.Id,
                tableView,
                'Keyboard',
                getInstrumentationContext(),
                targetWindow
            )
            .then(() => {
                closeDeeplinkReadingPane();
            });
    });

    useKeydownHandler(readingPaneContainer, getCommands().deleteMail, () => {
        lazyDeleteItems
            .importAndExecute(
                [props.itemId?.Id],
                getDefaultDisposalType(props.itemId?.Id),
                getInstrumentationContext(),
                'Keyboard',
                props.itemId?.mailboxInfo
            )
            .then(() => {
                closeDeeplinkReadingPane();
            });
    });

    useKeydownHandler(readingPaneContainer, getCommands().markAsRead, () => {
        markItemAsReadUnread(true);
    });

    useKeydownHandler(readingPaneContainer, getCommands().markAsUnread, () => {
        markItemAsReadUnread(false);
    });

    useKeydownHandler(readingPaneContainer, getCommands().toggleFlag, () => {
        // Toggle flag is disabled for groups
        if (isGroupItem()) {
            return;
        }
        let flagStatusValueToSet: FlagStatus;
        if (props.item?.Flag.FlagStatus != 'Flagged') {
            flagStatusValueToSet = 'Flagged';
        } else {
            flagStatusValueToSet = 'NotFlagged';
        }
        lazySetItemsFlagStateFromItemIds.importAndExecute(
            [props.itemId?.Id],
            getInstrumentationContext(),
            { FlagStatus: flagStatusValueToSet },
            getSelectedTableViewId(),
            'Keyboard'
        );
    });

    const markItemAsReadUnread = (isReadValue: boolean) => {
        lazyMarkItemAsReadFromReadingPane.importAndExecute(
            props.itemId?.Id,
            getSelectedTableView(),
            isReadValue,
            getInstrumentationContext(),
            'Keyboard'
        );
    };
    const getInstrumentationContext = (viewState?: ItemReadingPaneViewState) => {
        viewState = viewState || props.itemReadingPaneViewState;
        return viewState?.instrumentationContext ? [viewState.instrumentationContext] : [];
    };
    const readingPaneDisplayStart = () => {
        readingPaneDisplayStartDate.current = new Date();
        userMailInteractionAction('ReadingPaneDisplayStart', getInstrumentationContext());
        viewSessionGuid.current = getGuid();
    };
    const readingPaneDisplayEnd = () => {
        const { itemId, itemReadingPaneViewState } = props;
        userMailInteractionAction(
            'ReadingPaneDisplayEnd',
            getInstrumentationContext(itemReadingPaneViewState)
        );
        lazyLogSigsDatapoint.importAndExecute('ViewMessage', {
            start: readingPaneDisplayStartDate.current,
            itemId: internetMessageId.current,
            customProperties: {
                MessageIdType: 'MessageODataId',
                MessageId: itemId?.Id,
            },
            instanceId: viewSessionGuid.current,
        });
        // Clean up the item in GetItemManager when this reading pane is end.
        // Do nothing for item attachment preview
        if (!props.isItemAttachment) {
            GetItemManager.lazyCleanUpByItemId
                .import()
                .then(cleanUpByItemId => cleanUpByItemId(itemId?.Id));
        }

        internetMessageId.current = null;
        viewSessionGuid.current = null;
    };
    const renderInlineCompose = (inlineComposeViewState: ComposeViewState): JSX.Element => {
        if (inlineComposeViewState) {
            const composeClassNames = inlineComposeClassNames(
                inlineComposeStyles.composeContainer,
                {
                    // We render inline compose in ItemReadingPane when the email is translated.
                    // The user is not using conversation view mode in which they can select where to render the compose.
                    // In this case, we render the compose on the top part of the Reading Pane.
                    isNewestOnTop: true,
                    isFocused: true,
                }
            );
            const senderPersona = (
                <SenderImage
                    sender={null}
                    displaySelf={true}
                    style={inlineComposeStyles.senderImage}
                />
            );
            const result = (
                <div className={composeClassNames} key={`inlineComposeDiv_${props.itemId?.Id}`}>
                    <Compose
                        viewState={inlineComposeViewState}
                        initialActions={composeInitialActions.current}
                        className={inlineComposeStyles.inlineCompose}
                        senderPersona={senderPersona}
                        onUnmountFocusCallback={null}
                    />
                </div>
            );
            return result;
        }
        return null;
    };
    const { itemReadingPaneViewState, isSxS } = props;
    const subject = props.itemSubject || props.item?.Subject;
    const categories = props.item?.Categories;
    const isSmimeEncrypted = ![
        SmimeType.None,
        SmimeType.ClearSigned,
        SmimeType.OpaqueSigned,
    ].includes(getSmimeType(props.item));
    let composeDock: JSX.Element = null;
    const loadingState = loadingState_0.get();
    if (inlineComposeViewState) {
        // Create compose initial actions and dock component for browser compatibility.
        composeInitialActions.current = createInitialActions();
        composeDock = (
            <Dock
                viewState={inlineComposeViewState}
                initialActions={composeInitialActions.current}
            />
        );
    }
    const { cardInScrollRegion, cardOutsideScrollRegion } = getExtendedCards();
    const hasYammerCard = hasExtendedCard(itemReadingPaneViewState, ExtendedCardType.Yammer);
    const isExtendedCardCoveringContent = isExtendedCardCoveringOriginalContent(
        itemReadingPaneViewState
    );
    const containerClassName = isExtendedCardCoveringContent
        ? itemReadingPaneStyles.blockContainer
        : itemReadingPaneStyles.flexContainer;
    const getZoomStyle = lazyGetZoomStyle.tryImportForRender();

    return (
        <div
            tabIndex={-1}
            role={'main'}
            aria-label={loc(contentPaneLabel)}
            className={containerClassName}
            ref={ref => (readingPaneContainer.current = ref)}>
            {!props.isItemAttachment && (
                <>
                    <div
                        className={itemReadingPaneClassNames(
                            itemReadingPaneStyles.subjectContainer,
                            itemReadingPaneStyles.subject,
                            itemReadingPaneStyles.stackedSubject
                        )}>
                        <SubjectHeader
                            categories={categories}
                            className={itemReadingPaneClassNames(
                                isFeatureEnabled('mon-densities') && getDensityModeString()
                            )}
                            isSmimeEncrypted={isSmimeEncrypted}
                            subject={subject}
                            viewState={itemReadingPaneViewState}
                            firstItemId={props.itemId?.Id}
                            specialCardIconName={hasYammerCard && ControlIcons.YammerLogo}
                            isSxS={isSxS}
                        />
                        {isFeatureEnabled('csi-owa-topic-dropdown') && (
                            <ItemHeaderIcons
                                viewState={props.itemReadingPaneViewState}
                                itemId={props.itemId}
                                item={props.item}
                            />
                        )}
                    </div>
                    {cardOutsideScrollRegion}
                </>
            )}
            <div
                tabIndex={-1}
                className={classNames(styles.scrollRegion, 'customScrollBar')}
                ref={setScrollRegionRef}
                data-is-scrollable={true}>
                {props.isItemAttachment && (
                    <SubjectHeader
                        subject={subject}
                        categories={categories}
                        className={itemReadingPaneStyles.subject}
                        viewState={itemReadingPaneViewState}
                    />
                )}
                {cardInScrollRegion}
                {renderInlineCompose(inlineComposeViewState)}
                {!isExtendedCardCoveringContent && (
                    <div className={getZoomStyle?.()}>
                        <ItemReadingPaneContent
                            loadingState={loadingState}
                            contentCreator={createContainer}
                        />
                    </div>
                )}
                <div className={styles.scrollRegionBottomBuffer} />
            </div>
            {composeDock}
        </div>
    );
});

function getOutsideExtendedCardWrapper(
    extendedCardViewState: ExtendedCardViewState,
    child: JSX.Element
): JSX.Element {
    return (
        <div
            className={itemReadingPaneClassNames(
                itemReadingPaneStyles.outsideCardWrapperContainer,
                {
                    isCollapsed: !extendedCardViewState.coverOriginalContent,
                }
            )}>
            {child}
        </div>
    );
}
