import * as React from 'react';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import type Item from 'owa-service/lib/contract/Item';
import { getUserMailboxInfo } from 'owa-client-ids';
import { WIDE_CONTENT_HANDLER_NAME } from 'owa-controls-content-handler-wide';
import type MouseUpHandler from 'owa-controls-mouseup-handler/lib/store/schema/MouseUpHandler';
import { getUserConfiguration, isPremiumConsumer } from 'owa-session-store';
import { lazySubscribeToResizeEvent, lazyUnsubscribeFromResizeEvent } from 'owa-resize-event';
import { isFluidEnabledForSource, FluidOwaSource } from 'owa-fluid-validations';
import { Spinner } from '@fluentui/react/lib/Spinner';
import { InlineImageHandler, INLINE_IMAGE_HANDLER_NAME } from '../handlers/inlineImageHandler';
import externalImageHandler, {
    EXTERNAL_IMAGE_HANDLER_NAME,
} from '../handlers/externalImageHandler';
import HtmlContent from '../components/HtmlContent';
import type { ContentHandler } from 'owa-controls-content-handler-base';
import {
    FragmentIdentifierHandler,
    FRAGMENT_IDENTIFIER_HANDLER_NAME,
} from '../handlers/fragmentIdentifierHandler';
import linkPreviewHandler, { LINK_PREVIEW_HANDLER_NAME } from '../handlers/linkPreviewHandler';
import patchEmojiFontsHandler, {
    PATCH_EMOJI_FONTS_HANDLER_NAME,
    shouldPatchEmojiFonts,
} from '../handlers/patchEmojiFontsHandler';
import mentionHandler, { MENTION_HANDLER_NAME } from '../handlers/mentionHandler';
import createWideContentHandler from '../handlers/wideContentHandler/createWideContentHandler';
import safeLinkHandler, { SAFELINK_HANDLER_NAME } from '../handlers/safeLinkHandler';
import getOneDriveLinkHandler, {
    ONEDRIVE_LINK_HANDLER_NAME,
} from '../handlers/oneDriveLinkHandler';
import createFluidHandler, { FLUID_HANDLER_NAME } from '../handlers/fluidHandler';

const CONTEXT_MESSAGEBODY = 'MesageBody';

import styles from './MessageBody.scss';
import classNames from 'classnames';

export interface MessageBodyProps {
    messageBody: string;
    copyAllowed: boolean;
    printAllowed: boolean;
    isLoading: boolean;
    onCopy?: (evt: React.ClipboardEvent<EventTarget>) => void;
    className?: string;
    item?: Item;
    externalContentHandlerDictionary?: {
        [key: string]: ContentHandler;
    } /* handlers in externalContentHandlerDictionary will override any handlers with the same key inside of internalContentHandlerDictionary */;
    externalContentHandlerKeys?: string[];
    externalIsUndoModeDictionary?: { [key: string]: boolean };
    externalMouseUpHandlerList?: MouseUpHandler[];
    overrideFluidHandler?: boolean;
    fluidSource?: FluidOwaSource;
}

export interface MessageBodyState {
    contentHandlerKeys: string[];
    internalIsUndoModeDictionary: { [key: string]: boolean };
    externalIsUndoModeDictionary: { [key: string]: boolean };
}

export default class MessageBody extends React.Component<MessageBodyProps, MessageBodyState> {
    private contentHandlerDictionary = {};
    private readonly mouseUpHandlerList = [];
    private htmlContentRef: HtmlContent;
    private resizeTimer: any;

    constructor(props: MessageBodyProps) {
        super(props);

        // Create the initial isUndoModeDictionary for internal handlers
        let initialInternalIsUndoModeDictionary: { [key: string]: boolean } = {};
        initialInternalIsUndoModeDictionary[WIDE_CONTENT_HANDLER_NAME] = false;

        this.state = this.mergeContentHandlers(props, initialInternalIsUndoModeDictionary);
        this.initMouseUpHandlers();
    }

    private mergeContentHandlers(
        props: MessageBodyProps,
        internalIsUndoModeDictionary: { [key: string]: boolean }
    ): MessageBodyState {
        let {
            item,
            externalContentHandlerDictionary,
            externalContentHandlerKeys,
            externalIsUndoModeDictionary,
            overrideFluidHandler,
            fluidSource,
        } = props;

        let internalContentHandlerDictionary = {
            [FRAGMENT_IDENTIFIER_HANDLER_NAME]: new FragmentIdentifierHandler(),
            [MENTION_HANDLER_NAME]: mentionHandler,
        };
        let internalContentHandlerKeys = [FRAGMENT_IDENTIFIER_HANDLER_NAME, MENTION_HANDLER_NAME];

        // Add conditional handlers and their keys
        if (shouldPatchEmojiFonts(this.props.messageBody)) {
            internalContentHandlerDictionary[
                PATCH_EMOJI_FONTS_HANDLER_NAME
            ] = patchEmojiFontsHandler;
            internalContentHandlerKeys.push(PATCH_EMOJI_FONTS_HANDLER_NAME);
        }

        const userConfiguration = getUserConfiguration();
        if (
            userConfiguration.LinkPreviewEnabled &&
            userConfiguration.UserOptions.LinkPreviewEnabled
        ) {
            internalContentHandlerDictionary[LINK_PREVIEW_HANDLER_NAME] = linkPreviewHandler;
            internalContentHandlerKeys.push(LINK_PREVIEW_HANDLER_NAME);
        }

        if (
            fluidSource !== undefined &&
            (overrideFluidHandler || isFluidEnabledForSource(fluidSource))
        ) {
            internalContentHandlerDictionary[FLUID_HANDLER_NAME] = createFluidHandler(fluidSource);
            internalContentHandlerKeys.push(FLUID_HANDLER_NAME);
        }
        // Enable safelinks handler for both consumer premium users and enterprise users
        if (isPremiumConsumer() || !isConsumer()) {
            internalContentHandlerDictionary[SAFELINK_HANDLER_NAME] = safeLinkHandler;
            internalContentHandlerKeys.push(SAFELINK_HANDLER_NAME);
        }

        internalContentHandlerDictionary[WIDE_CONTENT_HANDLER_NAME] = createWideContentHandler();
        internalContentHandlerKeys.push(WIDE_CONTENT_HANDLER_NAME);

        // If the item has blocked images do not create the inline image handler
        if (!item?.HasBlockedImages) {
            internalContentHandlerDictionary[EXTERNAL_IMAGE_HANDLER_NAME] = externalImageHandler;
            internalContentHandlerKeys.push(EXTERNAL_IMAGE_HANDLER_NAME);

            internalContentHandlerDictionary[INLINE_IMAGE_HANDLER_NAME] = new InlineImageHandler(
                CONTEXT_MESSAGEBODY,
                false /* usePlaceHolder */
            );
            internalContentHandlerKeys.push(INLINE_IMAGE_HANDLER_NAME);
        }

        internalContentHandlerDictionary[ONEDRIVE_LINK_HANDLER_NAME] = getOneDriveLinkHandler(
            item
                ? {
                      ...item.ItemId,
                      mailboxInfo: getUserMailboxInfo(),
                  }
                : null
        );
        internalContentHandlerKeys.push(ONEDRIVE_LINK_HANDLER_NAME);

        // Add internalContentHandlerDictionary first so duplicated keys get the values from externalContentHandlerDictionaries
        this.contentHandlerDictionary = {
            ...internalContentHandlerDictionary,
            ...externalContentHandlerDictionary,
        };

        // Merge contentHandlerKeys and then remove duplicates
        let contentHandlerKeys = [
            ...internalContentHandlerKeys,
            ...(externalContentHandlerKeys || []),
        ];
        contentHandlerKeys = contentHandlerKeys.filter(
            (handler, index) => contentHandlerKeys.indexOf(handler) === index
        );

        return {
            contentHandlerKeys: contentHandlerKeys,
            internalIsUndoModeDictionary: internalIsUndoModeDictionary,
            externalIsUndoModeDictionary: { ...externalIsUndoModeDictionary }, // Create new object to ensure re-render
        };
    }

    private initMouseUpHandlers() {
        let { externalMouseUpHandlerList } = this.props;
        if (externalMouseUpHandlerList) {
            externalMouseUpHandlerList.forEach(handler => {
                this.mouseUpHandlerList.push(handler);
            });
        }
    }

    private setHtmlContentRef = (ref: HtmlContent) => {
        this.htmlContentRef = ref;
    };

    private toggleIsUndoModeForKey(keyToToggle: string) {
        const newInternalIsUndoModeDictionary: { [key: string]: boolean } = {};
        Object.keys(this.state.internalIsUndoModeDictionary).forEach(key => {
            const originalVal = this.state.internalIsUndoModeDictionary[key];
            newInternalIsUndoModeDictionary[key] = key != keyToToggle ? originalVal : !originalVal;
        });
        this.setState({
            internalIsUndoModeDictionary: newInternalIsUndoModeDictionary,
        });
    }

    private onResize = () => {
        if (!this.htmlContentRef) {
            return;
        }

        if (!this.resizeTimer) {
            // This will undo wideContentHandler
            this.toggleIsUndoModeForKey(WIDE_CONTENT_HANDLER_NAME);
            const self = this;
            this.resizeTimer = setTimeout(function () {
                // Since onresize is called in batch, we want to reduce the # of times to calculate content scaling.
                // So we redo after 200ms when onresize is most likely finished calling.
                // If not, it will try to undo and redo in timer again.
                self.resizeTimer = null;
                self.toggleIsUndoModeForKey(WIDE_CONTENT_HANDLER_NAME);
            }, 200);
        }
    };

    componentDidMount() {
        lazySubscribeToResizeEvent.importAndExecute(this.onResize);
    }

    //tslint:disable-next-line:react-strict-mode  Tracked by WI 78448
    UNSAFE_componentWillReceiveProps(nextProps: MessageBodyProps) {
        this.setState(
            this.mergeContentHandlers(nextProps, this.state.internalIsUndoModeDictionary)
        );
    }

    componentWillUnmount() {
        lazyUnsubscribeFromResizeEvent.importAndExecute(this.onResize);
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }
    }

    render() {
        let { isLoading, className, printAllowed, messageBody } = this.props;
        // Add a clear:both div after messageBody to avoid table with float:left overflowing parent div
        return (
            <>
                {isLoading ? (
                    <div className={className}>
                        <Spinner className={styles.loadingSpinner} />
                    </div>
                ) : (
                    <div
                        className={classNames(
                            className,
                            'allowTextSelection',
                            printAllowed ? '' : 'noPrint'
                        )}
                        onCopy={this.onCopy}>
                        <HtmlContent
                            ref={this.setHtmlContentRef}
                            html={messageBody}
                            contentHandlerDictionary={this.contentHandlerDictionary}
                            contentHandlerKeys={this.state.contentHandlerKeys}
                            isUndoModeDictionary={{
                                ...this.state.internalIsUndoModeDictionary,
                                ...this.state.externalIsUndoModeDictionary,
                            }}
                            mouseUpHandlerList={this.mouseUpHandlerList}
                        />
                    </div>
                )}
                <div className={styles.clearBoth} />
            </>
        );
    }

    private onCopy = (evt: React.ClipboardEvent<EventTarget>) => {
        if (!this.props.copyAllowed) {
            evt.preventDefault();
            return;
        }
        if (this.props.onCopy) {
            this.props.onCopy(evt);
        }
    };
}
