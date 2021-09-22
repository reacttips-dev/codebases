import { GlobalReplyBar } from './GlobalReplyBar';
import ItemHeader from './ItemHeader';
import LoadFullBodyButton from './LoadFullBodyButton';
import MailMessageBodyWithAmp from './MailMessageBodyWithAmp';
import QuotedBody from './QuotedBody';
import QuotedBodyWithDiffing from './QuotedBodyWithDiffing';
import initializeOmeMessageState from '../utils/initializeOmeMessageState';
import renderSmartPillBlock from '../utils/renderSmartPillBlock';
import { observer } from 'mobx-react-lite';
import { SelectionType } from 'owa-addins-core';
import type { ClientItemId } from 'owa-client-ids';
import { WideContentHost } from 'owa-controls-content-handler';
import { isFeatureEnabled } from 'owa-feature-flags';
import * as GetItemManager from 'owa-get-item-manager';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { useKeydownHandler } from 'owa-hotkeys';
import { updateAddinOnItemNavigation } from 'owa-mail-addins';
import { lazyForwardMessage, lazyReplyToMessage } from 'owa-mail-compose-actions';
import findInlineComposeViewState from 'owa-mail-compose-actions/lib/utils/findInlineComposeViewState';
import { getCommands } from 'owa-mail-hotkeys/lib/utils/MailModuleHotKeys';
import { TranslationFeedbackRibbon } from 'owa-mail-inline-translation';
import getSelectedTableViewId from 'owa-mail-list-store/lib/utils/getSelectedTableViewId';
import { lazyMarkItemAsReadFromReadingPane } from 'owa-mail-mark-read-actions';
import toggleSelectItemPart from 'owa-mail-reading-pane-store/lib/actions/toggleSelectItemPart';
import initItemLocale from 'owa-mail-reading-pane-store/lib/actions/translation/initItemLocale';
import type ItemPartViewState from 'owa-mail-reading-pane-store/lib/store/schema/ItemPartViewState';
import getDisplayedMessageBody from 'owa-mail-reading-pane-store/lib/utils/getDisplayedMessageBody';
import type { ClientItem } from 'owa-mail-store';
import type IRMRestrictions from 'owa-mail-store/lib/store/schema/IRMRestrictions';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import type BodyContentType from 'owa-service/lib/contract/BodyContentType';
import type DiffingInformation from 'owa-service/lib/contract/DiffingInformation';
import type FlagStatus from 'owa-service/lib/contract/FlagStatus';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { getDensityModeString } from 'owa-fabric-theme';
import isSMIMEItem from 'owa-smime/lib/utils/isSMIMEItem';
import * as React from 'react';
import {
    getSelectedTableView,
    shouldSuppressServerMarkReadOnReplyOrForward,
} from 'owa-mail-list-store';
import {
    lazyMarkItemJunkNotJunkFromReadingPane,
    lazySetItemsFlagStateFromItemIds,
} from 'owa-mail-triage-action';
import { emailMessageLabel } from './ExpandedItemPart.locstring.json';
import { lazyOverrideCustomZoomToDefault } from 'owa-custom-zoom';
import loc from 'owa-localize';
import styles from './ConversationReadingPane.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface ExpandedItemPartProps {
    item: ClientItem;
    viewState: ItemPartViewState;
    refCallback: (instance: HTMLDivElement) => any;
    showQuotedBody: boolean;
    isQuotedTextChanged: boolean;
    quotedTextState?: string;
    diffingInformation?: DiffingInformation;
    quotedBodyExpandedCallback: (quotedBodyOffsetTop: number) => void;
    isNodePending: boolean;
    onLazyMount: () => void;
    irmRestrictions: IRMRestrictions;
    instrumentationContext: InstrumentationContext;
    isLatestNonDraft: boolean;
    isFocused: boolean;
    isFirstItemInConversation: boolean;
    isSingleItemConversation: boolean;
    calendarItemId: ClientItemId;
    isSingleLineListView?: boolean;
}

function useGetItemManager({ isNodePending, viewState, item }: ExpandedItemPartProps) {
    React.useEffect((): void | (() => void) => {
        // Don't trigger GetItemManager for local lie node
        if (!isNodePending) {
            GetItemManager.lazyGetAdditionalPropertiesFromServer
                .import()
                .then(getAdditionalPropertiesFromServer => {
                    getAdditionalPropertiesFromServer(
                        viewState.itemId,
                        ReactListViewType.Conversation
                    );

                    // Initialize item locale for inline translation
                    initItemLocale(item, viewState);
                    // Initialize OmeMessageState for revocation
                    initializeOmeMessageState(item, viewState);
                });

            return () => {
                GetItemManager.lazyCleanUpByItemId
                    .import()
                    .then(cleanUpByItemId => cleanUpByItemId(viewState.itemId));
            };
        }
    }, []);
}

export default observer(function ExpandedItemPart(props: ExpandedItemPartProps) {
    const containerRef = React.useRef<HTMLDivElement>();

    useGetItemManager(props);

    const markItemAsReadUnread = React.useCallback(
        (isReadValue: boolean) => {
            lazyMarkItemAsReadFromReadingPane.importAndExecute(
                props.item.ItemId.Id,
                getSelectedTableView(),
                isReadValue,
                [props.instrumentationContext],
                'Keyboard'
            );
        },
        [props.item, props.instrumentationContext]
    );

    const getConversationId = React.useCallback(() => {
        return props.viewState.isConversationItemPart && props.item.ConversationId
            ? props.item.ConversationId.Id
            : null;
    }, [props.viewState, props.item]);

    const isGroupItem = React.useCallback(() => {
        return props.item.MailboxInfo && props.item.MailboxInfo.type === 'GroupMailbox';
    }, [props.item]);

    const onItemPartClicked = React.useCallback(() => {
        if (!props.isFocused) {
            toggleSelectItemPart(
                getConversationId(),
                props.viewState,
                false /*toggleExpandedCollapsed*/
            );
        }
    }, [props.isFocused, props.viewState]);

    const shouldAddinUpdateOnSelectedItemCollapse = React.useCallback(() => {
        return (
            props.isFocused &&
            props.viewState.isExpanded &&
            !findInlineComposeViewState(getConversationId()) &&
            !isGroupItem()
        );
    }, [props.isFocused, props.viewState, getConversationId, isGroupItem]);

    const onToggleExpandCollapseSelect = React.useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            event.stopPropagation();

            const selection = window.getSelection();
            if (selection && selection.toString()) {
                return;
            }

            if (shouldAddinUpdateOnSelectedItemCollapse()) {
                updateAddinOnItemNavigation(SelectionType.Empty);
            }

            toggleSelectItemPart(
                getConversationId(),
                props.viewState,
                true /*toggleExpandedCollapsed*/
            );
        },
        [shouldAddinUpdateOnSelectedItemCollapse, props.viewState]
    );

    /**
     * Hot keys
     */
    const replyAll = React.useCallback(() => {
        if (!isSMIMEItem(props.item) && props.irmRestrictions.ReplyAllAllowed) {
            const conversationId = getConversationId();
            lazyReplyToMessage.importAndExecute({
                referenceItemOrId: props.item,
                mailboxInfo: props.item.MailboxInfo,
                isReplyAll: true,
                useFullCompose: false,
                actionSource: 'Keyboard',
                instrumentationContexts: [props.instrumentationContext],
                conversationId: conversationId,
                suppressServerMarkReadOnReplyOrForward: shouldSuppressServerMarkReadOnReplyOrForward(
                    getSelectedTableView()
                ),
            });
        }
    }, [props.item, props.irmRestrictions, getConversationId, props.instrumentationContext]);
    useKeydownHandler(containerRef, getCommands().replyAll, replyAll);

    const reply = React.useCallback(() => {
        if (!isGroupItem() && !isSMIMEItem(props.item) && props.irmRestrictions.ReplyAllowed) {
            const conversationId = getConversationId();
            lazyReplyToMessage.importAndExecute({
                referenceItemOrId: props.item,
                mailboxInfo: props.item.MailboxInfo,
                isReplyAll: false,
                useFullCompose: false,
                actionSource: 'Keyboard',
                instrumentationContexts: [props.instrumentationContext],
                conversationId: conversationId,
                suppressServerMarkReadOnReplyOrForward: shouldSuppressServerMarkReadOnReplyOrForward(
                    getSelectedTableView()
                ),
            });
        }
    }, [
        getConversationId,
        isGroupItem,
        props.instrumentationContext,
        props.irmRestrictions,
        props.item,
    ]);
    useKeydownHandler(containerRef, getCommands().reply, reply);

    const forward = React.useCallback(() => {
        if (!isSMIMEItem(props.item) && props.irmRestrictions.ForwardAllowed) {
            lazyForwardMessage.importAndExecute(
                props.item,
                props.item.MailboxInfo,
                'Keyboard',
                [props.instrumentationContext],
                shouldSuppressServerMarkReadOnReplyOrForward(getSelectedTableView())
            );
        }
    }, [props.item, props.irmRestrictions, props.instrumentationContext]);
    useKeydownHandler(containerRef, getCommands().forward, forward);

    const markAsJunk = React.useCallback(() => {
        // mark as junk is disabled for groups
        if (isGroupItem()) {
            return;
        }

        lazyMarkItemJunkNotJunkFromReadingPane.importAndExecute(
            props.item.ItemId.Id,
            getSelectedTableView(),
            'Keyboard',
            [props.instrumentationContext],
            null /*targetWindow - ExpandedItemPart in ConvRP will not be in projection so will always use main window*/
        );
    }, [isGroupItem, props.item, props.instrumentationContext]);
    useKeydownHandler(containerRef, getCommands().markAsJunk, markAsJunk);

    const markAsRead = React.useCallback(() => {
        markItemAsReadUnread(true);
    }, [markItemAsReadUnread]);
    useKeydownHandler(containerRef, getCommands().markAsRead, markAsRead);

    const markAsUnread = React.useCallback(() => {
        markItemAsReadUnread(false);
    }, [markItemAsReadUnread]);
    useKeydownHandler(containerRef, getCommands().markAsUnread, markAsUnread);

    const toggleFlag = React.useCallback(() => {
        // Toggle flag is disabled for groups
        if (isGroupItem()) {
            return;
        }

        let flagStatusValueToSet: FlagStatus;
        if (props.item.Flag.FlagStatus != 'Flagged') {
            flagStatusValueToSet = 'Flagged';
        } else {
            flagStatusValueToSet = 'NotFlagged';
        }

        lazySetItemsFlagStateFromItemIds.importAndExecute(
            [props.item.ItemId.Id],
            [props.instrumentationContext],
            { FlagStatus: flagStatusValueToSet },
            getSelectedTableViewId(),
            'Keyboard'
        );
    }, [isGroupItem, props.item, props.instrumentationContext]);
    useKeydownHandler(containerRef, getCommands().toggleFlag, toggleFlag);

    const {
        item,
        isNodePending,
        irmRestrictions,
        viewState,
        isLatestNonDraft,
        showQuotedBody,
        isFocused,
    } = props;
    const overrideCustomZoomToDefault = lazyOverrideCustomZoomToDefault.tryImportForRender();
    const expandedItemPartClassName = classNames(
        styles.expandedItemPart,
        overrideCustomZoomToDefault?.(),
        {
            isFocused: isFocused,
            undoDarkModeFocusedBorder: isFocused && viewState.undoDarkMode,
            pendingNodeExpandedItemPart: isNodePending,
        }
    );
    const translatedBody: BodyContentType =
        isFeatureEnabled('rp-inlineTranslation') &&
        item.TranslationData &&
        item.TranslationData.isShowingTranslation
            ? { Value: item.TranslationData.translationText }
            : null;

    const isNative = isHostAppFeatureEnabled('nativeResolvers');
    const isNativeQuotedBodyExpanded = isNative && viewState.quotedBodyViewState.isExpanded;
    let isFullBodyExpanded = false;
    let displayedMessageBody = getDisplayedMessageBody(
        item.RightsManagementLicenseData,
        translatedBody || item.UniqueBody
    );

    // VSO: 118154 When in Stacked RP, Monarch should fully expand the first item in a conversation
    if (!translatedBody && isNative && props.isFirstItemInConversation && item.HasQuotedText) {
        displayedMessageBody = item.Body.Value;
        isFullBodyExpanded = true;
    }

    const hasDensityNext = isFeatureEnabled('mon-densities');
    const messageBodyClassNames = classNames(
        styles.messageBody,
        hasDensityNext && getDensityModeString()
    );

    const renderQuotedBody = (): JSX.Element => {
        return (
            <>
                {isFeatureEnabled('rp-bodyDiffing') && (
                    <QuotedBodyWithDiffing
                        item={props.item}
                        viewState={props.viewState.quotedBodyViewState}
                        isQuotedTextChanged={props.isQuotedTextChanged}
                        quotedTextState={props.quotedTextState}
                        isExpandedCallback={
                            isNativeQuotedBodyExpanded ? props.quotedBodyExpandedCallback : null
                        }
                        copyAllowed={props.irmRestrictions.CopyAllowed}
                        printAllowed={props.irmRestrictions.PrintAllowed}
                        undoDarkMode={props.viewState.undoDarkMode}
                        diffingInformation={props.diffingInformation}
                        hasTrimmedQuotedText={props.showQuotedBody}
                        isNative={isNative}
                    />
                )}

                {!isFeatureEnabled('rp-bodyDiffing') && showQuotedBody && (
                    <QuotedBody
                        item={props.item}
                        viewState={viewState.quotedBodyViewState}
                        isQuotedTextChanged={props.isQuotedTextChanged}
                        quotedTextState={props.quotedTextState}
                        isExpandedCallback={
                            isNativeQuotedBodyExpanded ? props.quotedBodyExpandedCallback : null
                        }
                        copyAllowed={props.irmRestrictions.CopyAllowed}
                        printAllowed={props.irmRestrictions.PrintAllowed}
                        undoDarkMode={props.viewState.undoDarkMode}
                        isNative={isNative}
                    />
                )}
            </>
        );
    };

    return (
        <WideContentHost ref={containerRef}>
            <div
                tabIndex={-1}
                aria-label={loc(emailMessageLabel)}
                className={expandedItemPartClassName}
                ref={props.refCallback}
                onClick={onItemPartClicked}>
                <ItemHeader
                    item={item}
                    viewState={viewState}
                    shouldIncludeFullInfo={isFocused}
                    instrumentationContext={props.instrumentationContext}
                    onExpandCollapse={onToggleExpandCollapseSelect}
                    isNodePending={isNodePending}
                    onLazyMount={props.onLazyMount}
                    isLatestNonDraft={isLatestNonDraft}
                    isCurrentItemLoaded={true}
                    isSingleLineListView={props.isSingleLineListView}
                />

                <MailMessageBodyWithAmp
                    className={messageBodyClassNames}
                    messageBody={isNativeQuotedBodyExpanded ? '' : displayedMessageBody}
                    item={item}
                    copyAllowed={irmRestrictions.CopyAllowed}
                    printAllowed={irmRestrictions.PrintAllowed}
                    isLoading={viewState.loadingState.isLoading}
                    undoDarkMode={viewState.undoDarkMode}
                    actionableMessageCardInItemViewState={
                        viewState.actionableMessageCardInItemViewState
                    }
                    ampViewState={viewState.ampViewState}
                    measureReadTime={props.isSingleItemConversation}
                />

                {item.UniqueBody?.IsTruncated && <LoadFullBodyButton viewState={viewState} />}
                {!isFullBodyExpanded && renderQuotedBody()}
                {isLatestNonDraft && renderSmartPillBlock(props.item, props.viewState)}
                {isFeatureEnabled('rp-inlineTranslation-feedbackRibbon') &&
                    item.TranslationData &&
                    item.TranslationData.shouldGetFeedback && (
                        <TranslationFeedbackRibbon
                            messageContent={props.item.UniqueBody.Value}
                            translationData={props.item.TranslationData}
                        />
                    )}
                {isLatestNonDraft && !findInlineComposeViewState(item.ConversationId.Id) && (
                    <GlobalReplyBar
                        conversationId={{
                            ...item.ConversationId,
                            mailboxInfo: item.MailboxInfo,
                        }}
                        item={item}
                        instrumentationContext={props.instrumentationContext}
                        densityMode={hasDensityNext && getDensityModeString()}
                    />
                )}
            </div>
        </WideContentHost>
    );
});
