import { observer } from 'mobx-react';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import {
    getReadHostItemIndex,
    lazyWhenItemHasContextualAddinKeywords,
    lazyRunContextualEvaluationAndUpdate,
} from 'owa-addins-core';
import { DatapointStatus, PerformanceDatapoint, logUsage } from 'owa-analytics';
import { handleOnCopy } from 'owa-content-colors';
import { LINK_HANDLER_NAME, LinkHandler } from 'owa-content-handler/lib/handlers/linkHandler';
import { getIsDarkTheme } from 'owa-fabric-theme';
import { isFeatureEnabled } from 'owa-feature-flags';
import { readItemSupportsAddins } from 'owa-mail-addins';
import getSelectedTableView from 'owa-mail-list-store/lib/utils/getSelectedTableView';
import type ActionableMessageCardInItemViewState from 'owa-mail-reading-pane-store/lib/store/schema/ActionableMessageCardInItemViewState';
import readingPaneStore from 'owa-mail-reading-pane-store/lib/store/Store';
import type { ClientItem } from 'owa-mail-store';
import createUserMarkupCreationHandler from 'owa-mouseup-handler/lib/handlers/userMarkupCreationHandler';
import type Message from 'owa-service/lib/contract/Message';
import { getPaletteAsRawColors } from 'owa-theme';
import { lazyGetItemUserMarkupData } from 'owa-user-highlighting';
import {
    lazyCreateTopicContentHandler,
    lazyManualTopicContentHandler,
    TOPIC_CONTENT_HANDLER_NAME,
    MANUAL_TOPIC_CONTENT_HANDLER_NAME,
} from 'owa-topic-annotations-content-handler';
import { lazyGetTopicsSdkAsync } from 'owa-topic-common/lib/lazyFunctions';
import { trace } from 'owa-trace';
import * as React from 'react';
import {
    ActionableMessageMailWrapper,
    ActionableMessageLoggingHandler,
    lazyDoesActionableMessageEnabled,
} from 'owa-actionable-message-mail';
import doesItemContainActionableMessage from 'owa-mail-actionable-message-actions/lib/utils/doesItemContainActionableMessage';
import {
    MailToHandler,
    MAIL_TO_HANDLER_NAME,
} from 'owa-content-handler/lib/handlers/mailToHandler';
import imageSxSHandler, {
    IMAGESXS_HANDLER_NAME,
} from 'owa-content-handler/lib/handlers/imageSxSHandler';
import {
    ContextualAddinContentHandler,
    CONTEXTUAL_ADDINS_HANDLER_NAME,
} from 'owa-addins-content-handler';
import {
    cleanupImageCopyHandler,
    handleImageCopy,
} from 'owa-inline-image-loader/lib/utils/ImageCopyHandler';
import createSharingAcceptHandler, {
    SHARING_ACCEPT_HANDLER_NAME,
} from 'owa-content-handler/lib/handlers/sharingAcceptHandler';
import storeLinkHandler, {
    STORE_LINK_HANDLER_NAME,
} from 'owa-addins-marketplace-routing/lib/storeLinkHandler';
import createUserMarkupReadingHandler, {
    USER_MARKUP_READING_HANDLER_NAME,
} from 'owa-content-handler/lib/handlers/userMarkupReadingHandler';
import { DarkModeHandler, DARK_MODE_HANDLER_NAME } from 'owa-controls-content-handler-dark-mode';
import {
    MessageBody,
    getHitHighlightingHandler,
    HIT_HIGHLIGHTING_HANDLER_NAME,
    isConfettiEnabled,
    getConfettiHandler,
    CONFETTI_HANDLER_NAME,
    InlineImageHandler,
    INLINE_IMAGE_HANDLER_NAME,
} from 'owa-controls-content-handler';
import type { ContentHandler } from 'owa-controls-content-handler-base';
import anchorHrefHandler, {
    ANCHOR_HREF_HANDLER_NAME,
} from 'owa-content-handler/lib/handlers/anchorHrefHandler';
import externalImageCountHandler, {
    EXTERNAL_IMAGE_COUNT_HANDLER_NAME,
} from 'owa-content-handler/lib/handlers/externalImageCountHandler';
import DebugConstants from '../utils/DebugConstants';
import { FluidOwaSource } from 'owa-fluid-validations';
import {
    MessageExtensionCardHandler,
    MESSAGE_EXTENSION_CARD_HANDLER_NAME,
} from 'owa-content-handler/lib/handlers/MessageExtensionCardHandler';
import { isSearchMessageExtensionEnabled } from 'owa-message-extension-config';
import { getUserConfiguration } from 'owa-session-store';

// Load context, this normally indicates surface of the loading, i.e. RP, Draft, Compose
const CONTEXT_READINGPANE = 'RP';

import styles from './MailMessageBody.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface MailMessageBodyProps {
    messageBody: string;
    copyAllowed: boolean;
    printAllowed: boolean;
    isLoading: boolean;
    undoDarkMode: boolean;
    className?: string;
    item?: ClientItem;
    actionableMessageCardInItemViewState: ActionableMessageCardInItemViewState;
}

export interface MailMessageBodyState {
    contentHandlerKeys: string[];
    isUndoModeDictionary: { [key: string]: boolean };
}

@observer
export default class MailMessageBody extends React.Component<
    MailMessageBodyProps,
    MailMessageBodyState
> {
    private readonly contentHandlerDictionary = {};
    private readonly actionableMessageLoggingHandler = new ActionableMessageLoggingHandler();
    private readonly mouseUpHandlerList = [];
    // Using the ActionableMessage enabled property under feature flag to validate its solidity
    private actionableMessageEnabled: boolean = false;
    private messageBodyWithCardPerfDatapoint: PerformanceDatapoint;
    private ismounted: boolean = false;
    private isQuotedTextEvaluated: boolean = false;

    constructor(props: MailMessageBodyProps) {
        super(props);

        this.initContentHandlers();
        this.initMouseUpHandlers();
        this.loadDoesActionableMessageEnabled();
    }

    private loadDoesActionableMessageEnabled = () => {
        lazyDoesActionableMessageEnabled.import().then(doesActionableMessageEnabled => {
            this.actionableMessageEnabled = doesActionableMessageEnabled();
        });
    };

    private addContextualAddinHandler = (keywords: string[]) => {
        if (!keywords || keywords.length == 0) {
            return;
        }

        const contentHandlerKeys = this.state.contentHandlerKeys;
        this.contentHandlerDictionary[
            CONTEXTUAL_ADDINS_HANDLER_NAME
        ] = new ContextualAddinContentHandler(keywords, this.props.item);
        contentHandlerKeys.push(CONTEXTUAL_ADDINS_HANDLER_NAME);

        // Only use setState if the component is mounted.
        this.ismounted && this.setState({ contentHandlerKeys: [...contentHandlerKeys] });
    };

    private checkContextualAddinKeywordsReady = () => {
        lazyWhenItemHasContextualAddinKeywords.import().then(whenItemHasContextualAddinKeywords => {
            whenItemHasContextualAddinKeywords(
                getReadHostItemIndex(this.props.item.ItemId.Id),
                this.addContextualAddinHandler
            );
        });
    };

    private initContentHandlers() {
        const { item } = this.props;

        // LinkHandler has to be before MailToHandler since they handle click events on hrefs
        // but MailToHandler prevent default on the event so LinkHandler never has a chance to handle
        // the event.
        this.contentHandlerDictionary[LINK_HANDLER_NAME] = new LinkHandler(item);
        this.contentHandlerDictionary[MAIL_TO_HANDLER_NAME] = new MailToHandler(item);
        this.contentHandlerDictionary[SHARING_ACCEPT_HANDLER_NAME] = createSharingAcceptHandler(
            item
        );
        this.contentHandlerDictionary[DARK_MODE_HANDLER_NAME] = new DarkModeHandler(
            () => getPaletteAsRawColors().white
        );

        const initialIsUndoModeDictionary: { [key: string]: boolean } = {};
        this.state = {
            contentHandlerKeys: [
                LINK_HANDLER_NAME,
                MAIL_TO_HANDLER_NAME,
                SHARING_ACCEPT_HANDLER_NAME,
            ],
            isUndoModeDictionary: initialIsUndoModeDictionary,
        };

        if (item && readItemSupportsAddins(item)) {
            const quotedText = item.QuotedTextList?.length > 0 ? item.QuotedTextList[0] : null;
            if (!this.isQuotedTextEvaluated && quotedText) {
                // call this function to include keywords in quoted body for contextual evaluation
                lazyRunContextualEvaluationAndUpdate
                    .import()
                    .then(runContextualEvaluationAndUpdate => {
                        runContextualEvaluationAndUpdate(
                            item,
                            getReadHostItemIndex(item.ItemId.Id)
                        ).then(() => {
                            this.isQuotedTextEvaluated = true;
                            this.checkContextualAddinKeywordsReady();
                        });
                    });
            } else {
                this.checkContextualAddinKeywordsReady();
            }
        }

        // Adding handler for hydrating message extension cards
        if (isSearchMessageExtensionEnabled()) {
            this.addContentHandler(
                MESSAGE_EXTENSION_CARD_HANDLER_NAME,
                new MessageExtensionCardHandler(item),
                /* isLazy */ true
            );
        }

        // If the item has blocked images do not create the inline image handler
        if (!item?.HasBlockedImages) {
            this.addContentHandler(
                INLINE_IMAGE_HANDLER_NAME,
                new InlineImageHandler(CONTEXT_READINGPANE, true /* usePlaceHolder */)
            );
        }

        // image sxs
        this.addContentHandler(IMAGESXS_HANDLER_NAME, imageSxSHandler);

        const tableView = getSelectedTableView();
        // tableView could be null when RP is opened from photohub
        if (tableView?.highlightTerms) {
            this.addContentHandler(
                HIT_HIGHLIGHTING_HANDLER_NAME,
                getHitHighlightingHandler(tableView.highlightTerms)
            );
        }

        this.addContentHandler(STORE_LINK_HANDLER_NAME, storeLinkHandler);

        if (isConfettiEnabled() && item) {
            const message = item as Message;
            this.addContentHandler(
                CONFETTI_HANDLER_NAME,
                getConfettiHandler(message.UniqueBody, !message.IsRead /* fireOnCreate */)
            );
        }

        this.addContentHandler(ANCHOR_HREF_HANDLER_NAME, anchorHrefHandler);
        this.addContentHandler(EXTERNAL_IMAGE_COUNT_HANDLER_NAME, externalImageCountHandler);
    }

    private initLazyContentHandlers(previousItemId?: string) {
        const { item, messageBody } = this.props;
        const makeId = (contentHandlerId: string, itemId: string) =>
            `${contentHandlerId}_${itemId}`;

        if (isFeatureEnabled('rp-userMarkup') && !this.isGroupItem()) {
            lazyGetItemUserMarkupData.import().then(getItemUserMarkupData => {
                getItemUserMarkupData(item).then(itemUserMarkupData => {
                    createUserMarkupReadingHandler(item, itemUserMarkupData).then(
                        userMarkupReadingHandler => {
                            this.replaceContentHandler(
                                makeId(USER_MARKUP_READING_HANDLER_NAME, item.ItemId.Id),
                                userMarkupReadingHandler,
                                /* isLazy */ true,
                                !!previousItemId
                                    ? makeId(USER_MARKUP_READING_HANDLER_NAME, previousItemId)
                                    : undefined
                            );
                        }
                    );
                });
            });
        }

        if (
            isFeatureEnabled('csi-owa-topic-card') &&
            getUserConfiguration().UserOptions.IsTopicHighlightsEnabled !== false // nulls value defaults to true
        ) {
            lazyGetTopicsSdkAsync
                .importAndExecute()
                .then(topicsSdk => {
                    if (topicsSdk.isTopicsEnabled()) {
                        lazyCreateTopicContentHandler.import().then(createTopicContentHandler => {
                            createTopicContentHandler(item, messageBody, topicsSdk)
                                .then(topicContentHandler => {
                                    // Content handler may be undefined for empty messages
                                    if (topicContentHandler) {
                                        this.replaceContentHandler(
                                            makeId(TOPIC_CONTENT_HANDLER_NAME, item.ItemId.Id),
                                            topicContentHandler,
                                            /* isLazy */ true,
                                            !!previousItemId
                                                ? makeId(TOPIC_CONTENT_HANDLER_NAME, previousItemId)
                                                : undefined
                                        );
                                    }
                                })
                                // If the topic content handler fails to be created (e.g. API errors) don't show errors in the UI.
                                // Logging the error in QoS is handling inside createTopicContentHandler
                                .catch(() => {});
                        });
                    }
                })
                .catch(() => {}); // If Topics SDK fails to load just silently fail. It may include network calls.
        }
        if (isFeatureEnabled('csi-owa-topic-manual')) {
            lazyManualTopicContentHandler
                .import()
                .then(ManualTopicContentHandler => {
                    const manualTopicContentHandler = new ManualTopicContentHandler();
                    this.addContentHandler(
                        MANUAL_TOPIC_CONTENT_HANDLER_NAME,
                        manualTopicContentHandler
                    );
                })
                .catch(() => {});
        }
    }

    private addContentHandler(id: string, handler: ContentHandler, isLazy: boolean = false) {
        this.contentHandlerDictionary[id] = handler;
        this.state.contentHandlerKeys.push(id);

        if (isLazy) {
            // Only use setState if the component is mounted.
            this.ismounted &&
                this.setState({
                    contentHandlerKeys: [...this.state.contentHandlerKeys],
                });
        }
    }

    /**
     * Replaces an existing content handler with a new one.
     * If the previous one doesn't exist, it adds the new content handler.
     *
     * @remarks
     * This is needed when the component updates with a new item. In non-conversation mode the component is re-used and
     * it just re-renders with the new props. As the content handlers may be created specifically for an item, they need
     * to be created again.
     *
     * In its current usage, the content handler id follow the schems "<ContentHandlerId>_<ItemId>" to make them unique
     * for each item.
     *
     * Once the previous content handler is removed, the code managing content handlers will execute undo on it.
     */
    private replaceContentHandler(
        id: string,
        handler: ContentHandler,
        isLazy: boolean = false,
        previousId?: string
    ) {
        let contentHandlerKeys;
        if (!!previousId) {
            this.contentHandlerDictionary[previousId] = undefined;
            contentHandlerKeys = this.state.contentHandlerKeys.filter(key => key !== previousId);
        } else {
            contentHandlerKeys = this.state.contentHandlerKeys;
        }

        this.contentHandlerDictionary[id] = handler;
        contentHandlerKeys.push(id);

        if (isLazy) {
            // Only use setState if the component is mounted.
            this.ismounted &&
                this.setState({
                    contentHandlerKeys,
                });
        }
    }

    private initMouseUpHandlers() {
        if (!this.isGroupItem()) {
            this.mouseUpHandlerList.push(createUserMarkupCreationHandler(this.props.item));
        }
    }

    private renderActionableMessageCard(): JSX.Element[] {
        this.actionableMessageLoggingHandler.log(DebugConstants.RenderActionableMessageCard);
        trace.info('[ActionableMessageDebug] MailMessageBody: renderActionableMessageCard - Start');

        const { item, undoDarkMode } = this.props;

        /**
         * Checks does the item contains the Actionable MessageCard data and
         * also checks whether rp-actionableMessages flag is enabled or not
         */
        const hasCardData = doesItemContainActionableMessage(item);
        const hasActionableMessageData: boolean =
            hasCardData && !!this.props.actionableMessageCardInItemViewState;

        if (!hasActionableMessageData || !this.actionableMessageEnabled) {
            this.actionableMessageLoggingHandler.log(
                `${DebugConstants.ReturnNullElement}:${hasActionableMessageData ? 1 : 0}:${
                    hasCardData ? 1 : 0
                }`
            );
            trace.info(
                '[ActionableMessageDebug] MailMessageBody: renderActionableMessageCard - Does not have data or settings not enabled'
            );
            return null;
        }

        const elements: JSX.Element[] = [];
        /**
         * Show the spinner only when we would render the card
         *
         * showCardLoading property is to represent whether to show the card loading spinner
         */
        if (this.props.actionableMessageCardInItemViewState.showCardLoading) {
            trace.info(
                '[ActionableMessageDebug] MailMessageBody: renderActionableMessageCard - Adding Spinner element'
            );
            elements.push(
                <Spinner
                    key="loadingSpinner"
                    className={styles.adaptiveCardLoadingSpinner}
                    size={SpinnerSize.medium}
                />
            );

            if (!this.messageBodyWithCardPerfDatapoint) {
                this.messageBodyWithCardPerfDatapoint = new PerformanceDatapoint(
                    'RPMessageBodyWithCardData'
                );
            }
        } else {
            if (this.messageBodyWithCardPerfDatapoint) {
                this.messageBodyWithCardPerfDatapoint.end();
                this.messageBodyWithCardPerfDatapoint = null;
            }
        }

        const actionableMessageElement = (
            <ActionableMessageMailWrapper
                key={'headerCard'}
                item={item}
                viewState={this.props.actionableMessageCardInItemViewState}
                isDarkMode={getIsDarkTheme()}
                darkModeContentHandler={
                    getIsDarkTheme() && this.contentHandlerDictionary[DARK_MODE_HANDLER_NAME]
                }
                actionableMessageLoggingHandler={this.actionableMessageLoggingHandler}
                undoDarkMode={undoDarkMode}
            />
        );
        if (actionableMessageElement) {
            this.actionableMessageLoggingHandler.log(DebugConstants.ReturnAMElement);
            trace.info(
                '[ActionableMessageDebug] MailMessageBody: renderActionableMessageCard - Has Card element to render'
            );
            elements.push(actionableMessageElement);
        }
        return elements;
    }

    private shouldShowMessageBodyWithActionableMessageCard(): boolean {
        /**
         * showBodyWithMessageCard represents whether the Message body should be rendered along with the Actionable MessageCard
         */
        const shouldShow =
            this.props.actionableMessageCardInItemViewState &&
            this.props.actionableMessageCardInItemViewState.showBodyWithMessageCard;

        trace.info(
            '[ActionableMessageDebug] MailMessageBody: shouldShowMessageBodyWithActionableMessageCard - ' +
                shouldShow
        );
        return shouldShow;
    }

    private shouldRenderMessageBody = (elements: JSX.Element[]): boolean => {
        const shouldRender =
            elements.length === 0 || this.shouldShowMessageBodyWithActionableMessageCard();
        trace.info(
            '[ActionableMessageDebug] MailMessageBody: shouldRenderMessageBody - ' + shouldRender
        );

        return shouldRender;
    };

    private renderMessageBody(): JSX.Element {
        const {
            messageBody,
            copyAllowed,
            printAllowed,
            isLoading,
            className,
            item,
            undoDarkMode,
        } = this.props;

        this.actionableMessageLoggingHandler.log(DebugConstants.RenderMessageBody);
        trace.info('[ActionableMessageDebug] MailMessageBody: renderMessageBody');

        return (
            <MessageBody
                key="messageBody"
                messageBody={messageBody}
                copyAllowed={copyAllowed}
                printAllowed={printAllowed}
                isLoading={isLoading}
                onCopy={onCopy}
                className={classNames(className, styles.mailMessageBody)}
                item={item}
                externalContentHandlerDictionary={this.contentHandlerDictionary}
                externalContentHandlerKeys={this.state.contentHandlerKeys.concat(
                    getIsDarkTheme() ? [DARK_MODE_HANDLER_NAME] : [] // Add here to trigger re-render on user toggle.
                )}
                externalIsUndoModeDictionary={{
                    ...this.state.isUndoModeDictionary,
                    [DARK_MODE_HANDLER_NAME]: undoDarkMode,
                }}
                externalMouseUpHandlerList={this.mouseUpHandlerList}
                overrideFluidHandler={readingPaneStore.isFluidEnabledOverride}
                fluidSource={FluidOwaSource.MailReadingPane}
            />
        );
    }

    componentDidMount() {
        this.ismounted = true;

        // Init lazy content handlers after component mounts to ensure
        // getItem call has already been made
        this.initLazyContentHandlers();
        trace.info('[ActionableMessageDebug] MailMessageBody: componentDidMount');
    }

    componentDidUpdate(prevProps: MailMessageBodyProps) {
        if (prevProps.item?.ItemId.Id !== this.props.item?.ItemId.Id) {
            this.initLazyContentHandlers(prevProps.item?.ItemId.Id);
            trace.info('[ActionableMessageDebug] MailMessageBody: componentDidUpdate');
        }
    }

    componentWillUnmount() {
        this.ismounted = false;
        trace.info('[ActionableMessageDebug] MailMessageBody: componentWillUnmount');
        cleanupImageCopyHandler();

        this.actionableMessageLoggingHandler.log(
            `${DebugConstants.ItemId}:${this.props.item?.ItemId?.Id}`
        );
        if (this.actionableMessageLoggingHandler.shouldPostLogs()) {
            //Log the debug data only when the feature flag is enabled
            if (isFeatureEnabled('rp-actionableMessagesDebug')) {
                logUsage(
                    'ActionableMessagesDebug',
                    this.actionableMessageLoggingHandler.getUsageLogs(),
                    { excludeFromKusto: true }
                );
            }
        }
        this.actionableMessageLoggingHandler.cleanUp();

        if (this.messageBodyWithCardPerfDatapoint) {
            this.messageBodyWithCardPerfDatapoint.endWithError(DatapointStatus.RequestNotComplete);
        }
    }

    render() {
        this.actionableMessageLoggingHandler.log(DebugConstants.Render);
        trace.info('[ActionableMessageDebug] MailMessageBody: Render');

        const elements: JSX.Element[] = [];

        const cardElements: JSX.Element[] = this.renderActionableMessageCard();

        if (cardElements) {
            elements.push(...cardElements);
        }

        if (this.shouldRenderMessageBody(elements)) {
            elements.push(this.renderMessageBody());
        }

        return elements;
    }

    private isGroupItem() {
        return (
            this.props.item &&
            this.props.item.MailboxInfo &&
            this.props.item.MailboxInfo.type == 'GroupMailbox'
        );
    }
}

function onCopy(evt: React.ClipboardEvent<EventTarget>) {
    handleImageCopy(evt.currentTarget as HTMLDivElement);
    handleOnCopy(evt);
}
