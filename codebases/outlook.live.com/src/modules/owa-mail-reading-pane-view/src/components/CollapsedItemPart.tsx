import CollapsedPreview from './CollapsedPreview';
import CollapsedSender from './CollapsedSender';
import CollapsedSenderImage from './CollapsedSenderImage';
import SentReceivedSavedTime from './SentReceivedSavedTime';
import shouldShowMeetingFeed from '../utils/shouldShowMeetingFeed';
import { observer } from 'mobx-react-lite';
import { Charms, CharmSize } from 'owa-mail-reading-pane-infobar-view';
import type ItemPartViewState from 'owa-mail-reading-pane-store/lib/store/schema/ItemPartViewState';
import type { ClientItem, ClientMessage } from 'owa-mail-store';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import * as React from 'react';
import { ReactionsContainer } from 'owa-mail-reactions-view';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getDensityModeString } from 'owa-fabric-theme';
import { lazyOverrideCustomZoomToDefault } from 'owa-custom-zoom';

import styles from './ConversationReadingPane.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface CollapsedItemPartProps {
    item: ClientItem;
    instrumentationContext: InstrumentationContext;
    viewState: ItemPartViewState;
    isNodePending: boolean;
    printAllowed: boolean;
    refCallback: (instance: HTMLDivElement) => any;
    isFocused: boolean;
    toggleExpandCollapse: () => void;
}

const CollapsedItemPart = observer(function CollapsedItemPart(props: CollapsedItemPartProps) {
    // VSO 1132: handle non-message case later.
    const message: ClientMessage = props.item as ClientMessage;
    const isNodePending = props.isNodePending;
    const isDraft = message.IsDraft;
    const isDeferredSend = !!message.DeferredSendTime;
    const treatAsDraft = isDraft && !isNodePending;
    const previewTime = treatAsDraft ? message.LastModifiedTime : message.DateTimeReceived;
    const useDeletedItemStyle = props.viewState.isDeleted && !shouldShowMeetingFeed(props.item);
    const hasDensityNext = isFeatureEnabled('mon-densities');
    const overrideCustomZoomToDefault = lazyOverrideCustomZoomToDefault.tryImportForRender();
    const collapsedItemPartStyle = classNames(
        styles.collapsedItemPart,
        overrideCustomZoomToDefault?.(),
        !hasDensityNext && styles.originalHeight,
        {
            deletedItemStrikeThrough: useDeletedItemStyle,
            isFocused: props.isFocused,
        }
    );
    const headerContainerStyle = classNames(
        hasDensityNext && getDensityModeString(),
        styles.headerRightContainer,
        'allowTextSelection'
    );
    const previewStyle = classNames(hasDensityNext && getDensityModeString(), styles.preview);

    const onClickCallback = React.useCallback(() => {
        props.toggleExpandCollapse();
    }, [props.toggleExpandCollapse]);

    return (
        <div
            className={collapsedItemPartStyle}
            onClick={onClickCallback}
            ref={props.refCallback}
            tabIndex={-1}>
            <CollapsedSenderImage
                message={message}
                isDraft={isDraft}
                isNodePending={isNodePending}
            />
            <div className={headerContainerStyle}>
                {!treatAsDraft && (
                    <div className={styles.collapsedItemPartStatusBar}>
                        <ReactionsContainer
                            conversationId={{
                                ...message.ConversationId,
                                mailboxInfo: message.MailboxInfo,
                            }}
                            itemId={{
                                ...message.ItemId,
                                mailboxInfo: message.MailboxInfo,
                            }}
                            item={props.item}
                            instrumentationContext={props.instrumentationContext}
                            isInCollapsedRP={true}
                        />
                        <Charms
                            message={message}
                            viewState={props.viewState}
                            instrumentationContext={props.instrumentationContext}
                            charmSize={CharmSize.size14}
                        />
                    </div>
                )}
                <CollapsedSender
                    message={message}
                    treatAsDraft={treatAsDraft}
                    isNodePending={isNodePending}
                />
                <div className={previewStyle}>
                    <SentReceivedSavedTime
                        className={styles.previewTime}
                        time={previewTime}
                        treatAsDraft={treatAsDraft}
                        isDeferredSend={isDeferredSend}
                    />
                    <CollapsedPreview
                        item={props.item}
                        isNodePending={props.isNodePending}
                        printAllowed={props.printAllowed}
                    />
                </div>
            </div>
        </div>
    );
});

export default CollapsedItemPart;
