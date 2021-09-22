import classnamesBind from 'classnames/bind';
import { observer } from 'mobx-react-lite';
import { AttachmentWellView } from 'owa-attachment-well-view';
import { formatUserTime, formatWeekDayShortUserDate, userDate } from 'owa-datetime';
import { getDensityModeString, getIsDarkTheme } from 'owa-fabric-theme';
import { isFeatureEnabled } from 'owa-feature-flags';
import loc, { format } from 'owa-localize';
import { sending } from 'owa-locstrings/lib/strings/sending.locstring.json';
import {
    lazyFetchLinkedInProfileInfo,
    ViewProfileBoldButton,
    ViewProfileButton,
} from 'owa-mail-linkedin-profile';
import { MessageApprovalHeader } from 'owa-mail-message-approval';
import { ReactionsContainer } from 'owa-mail-reactions-view';
import { ItemHeaderInfoBar } from 'owa-mail-reading-pane-infobar-view';
import { ItemActionsMenu } from 'owa-mail-reading-pane-item-actions-view';
import { isDRItem, isNDRItem } from 'owa-mail-reading-pane-item-actions/lib/utils/checkItemType';
import type ItemViewState from 'owa-mail-reading-pane-store/lib/store/schema/ItemViewState';
import isLinkedInViewProfileEnabled from 'owa-mail-reading-pane-store/lib/utils/isLinkedInViewProfileEnabled';
import { SenderImageWrapper, SenderPersonaWrapper } from 'owa-mail-sender-persona-view';
import type { ClientItem, ClientMessage } from 'owa-mail-store';
import isSenderSelf from 'owa-mail-store/lib/selectors/isSenderSelf';
import isMessageListSeparate from 'owa-mail-store/lib/utils/isMessageListSeparate';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import { isMeetingMessage, MeetingMessageInfo, MeetingMessageSummary } from 'owa-meeting-message';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type MeetingMessage from 'owa-service/lib/contract/MeetingMessage';
import type SharingMessage from 'owa-service/lib/contract/SharingMessage';
import doesFolderIdEqualName from 'owa-session-store/lib/utils/doesFolderIdEqualName';
import { SharingAcceptButton, shouldShowSharingMessageHeader } from 'owa-sharing-accept';
import doesMessageHaveSmimePrefix from 'owa-smime/lib/utils/doesMessageHaveSmimePrefix';
import * as React from 'react';
import {
    shouldShowMeetingCardFeedView,
    shouldShowMeetingSummary,
} from '../utils/shouldShowMeetingSummary';
import EditDraftButton from './EditDraftButton';
import { draftMessageNotSentText, infoScheduledSendOn } from './ItemHeader.locstring.json';
import { lazyOverrideCustomZoomToDefaultInfoBar } from 'owa-custom-zoom';
import styles from './ItemHeader.scss';
import RecipientWell from './RecipientWell';
import SentReceivedSavedTime from './SentReceivedSavedTime';

const classNames = classnamesBind.bind(styles);

const SmimeItemAttachmentActionKeys: string[] = ['Reply', 'ReplyAll', 'Forward', 'Print'];
// Only support S/MIME related infobars for ItemAttachment
const INFOBAR_IDS_ALLOWED_FOR_ITEM_ATTACHMENT = [
    'safetyBar',
    'infoSMIME',
    'infoSmimeDecodeError',
    'infoSmimeSigned',
];

export interface ItemHeaderProps {
    item: ClientItem;
    viewState: ItemViewState;
    shouldIncludeFullInfo: boolean;
    instrumentationContext: InstrumentationContext;
    isCurrentItemLoaded: boolean;
    onExpandCollapse?: (event: React.MouseEvent<HTMLElement>) => void;
    isNodePending?: boolean;
    onLazyMount?: () => void;
    isItemAttachment?: boolean;
    isPopout?: boolean;
    isReadonly?: boolean;
    isLatestNonDraft?: boolean;
    targetWindow?: Window;
    isSingleLineListView?: boolean;
}

export default observer(function ItemHeader(props: ItemHeaderProps) {
    const {
        item,
        viewState,
        instrumentationContext,
        isNodePending,
        isItemAttachment,
        isPopout,
        isReadonly,
        isLatestNonDraft,
        targetWindow,
        isCurrentItemLoaded,
    } = props;
    const message: ClientMessage = item as ClientMessage; // TODO: handle non-message case later.
    const sender = message.From || message.Sender;
    const viewStateWithAllowedInfoBarIds = {
        ...viewState,
        infoBarIds: isItemAttachment
            ? INFOBAR_IDS_ALLOWED_FOR_ITEM_ATTACHMENT
            : viewState.infoBarIds,
    };
    const hasDensityNext = isFeatureEnabled('mon-densities');
    const densityMode = hasDensityNext ? getDensityModeString() : null;

    // Try to render LinkedIn 'view profile' button if:
    // -- Item has a sender smtp
    // -- Item is not an attachment
    // -- User is on client/server flights AND user is not on v1.1 flight
    // -- User is on client/server flights AND user is on v1.1 flight AND this is the latest non-draft item
    const fetchLinkedInProfile =
        sender?.Mailbox &&
        !isSenderSelf(sender?.Mailbox?.EmailAddress) &&
        !isItemAttachment &&
        isLinkedInViewProfileEnabled();

    React.useEffect(() => {
        if (fetchLinkedInProfile) {
            lazyFetchLinkedInProfileInfo.importAndExecute(
                sender.Mailbox,
                message.AntispamUnauthenticatedSender
            );
        }
    }, [fetchLinkedInProfile]);

    const renderMessageApprovalHeader = (message: ClientMessage): JSX.Element => {
        return (
            message?.ApprovalRequestData?.IsUndecidedApprovalRequest && (
                <MessageApprovalHeader item={item} />
            )
        );
    };
    const overrideCustomZoomToDefaultInfoBar = lazyOverrideCustomZoomToDefaultInfoBar.tryImportForRender();
    const renderInfoBars = (message: ClientMessage, viewState: ItemViewState): JSX.Element => {
        return (
            <ItemHeaderInfoBar
                message={message}
                viewState={viewStateWithAllowedInfoBarIds}
                instrumentationContext={instrumentationContext}
                className={classNames(styles.infoBarMargin, overrideCustomZoomToDefaultInfoBar?.())}
                isItemAttachment={isItemAttachment}
                targetWindow={targetWindow}
                isSingleLineListView={props.isSingleLineListView}
            />
        );
    };
    const renderReactionContainer = (): JSX.Element => {
        return (
            <div className={styles.reactionsContainer}>
                <ReactionsContainer
                    conversationId={{
                        ...item.ConversationId,
                        mailboxInfo: item.MailboxInfo,
                    }}
                    itemId={{
                        ...item.ItemId,
                        mailboxInfo: item.MailboxInfo,
                    }}
                    item={item}
                    instrumentationContext={instrumentationContext}
                />
            </div>
        );
    };

    const renderSurfaceButtons = (treatAsDraft: boolean, isNodePending: boolean): JSX.Element => {
        if (isNodePending) {
            // Surface buttons has style of 40px height and float right,
            // render an invisable div to preserve the 40px height
            return <div className={styles.localLieItemActionPlaceholder} />;
        } else if (treatAsDraft) {
            return (
                <EditDraftButton
                    className={styles.draftButtonContainer}
                    itemId={item.ItemId}
                    instrumentationContext={instrumentationContext}
                    isDeferredSend={!!item.DeferredSendTime}
                    targetWindow={targetWindow}
                />
            );
        } else {
            return (
                <ItemActionsMenu
                    viewState={viewState}
                    item={item}
                    shouldIncludeFullInfo={props.shouldIncludeFullInfo}
                    instrumentationContext={instrumentationContext}
                    isItemAttachment={isItemAttachment}
                    isPopout={isPopout}
                    customizedSubsetActionKeys={
                        doesMessageHaveSmimePrefix(item) ? SmimeItemAttachmentActionKeys : []
                    }
                    targetWindow={props.targetWindow}
                />
            );
        }
    };

    const renderDraftText = (): JSX.Element => {
        if (item.DeferredSendTime) {
            const deferredSendAsDate = userDate(item.DeferredSendTime);
            return (
                <div className={styles.draftStatusContainer}>
                    <span className={styles.draftNotSentTextInfo}>
                        {format(
                            loc(infoScheduledSendOn),
                            formatWeekDayShortUserDate(deferredSendAsDate),
                            formatUserTime(deferredSendAsDate)
                        )}
                    </span>
                </div>
            );
        }
        return (
            <div className={styles.draftStatusContainer}>
                <span className={styles.draftNotSentTextInfo}>{loc(draftMessageNotSentText)}</span>
            </div>
        );
    };

    const renderDraftTime = (): JSX.Element => (
        <SentReceivedSavedTime
            className={styles.draftSavedTimestamp}
            time={item.LastModifiedTime}
            treatAsDraft={true}
        />
    );

    const renderLocalLieTime = (): JSX.Element => {
        return renderSentReceivedSavedTimeOrSendingText(
            item.localLieSentTime,
            !!item.localLieSentTime /* isSending */
        );
    };

    const renderItemTime = (): JSX.Element => {
        const isItemInSentItemsFolder =
            message.ParentFolderId?.Id &&
            doesFolderIdEqualName(message.ParentFolderId.Id, 'sentitems');

        return renderSentReceivedSavedTimeOrSendingText(
            isItemInSentItemsFolder ? item.DateTimeSent : item.DateTimeReceived,
            false /* isSending */
        );
    };

    const showTimestampOnRight: boolean = isFeatureEnabled('mon-rp-timestampToRight');

    const renderSentReceivedSavedTimeOrSendingText = (
        time: string,
        isSending: boolean
    ): JSX.Element => {
        const className = classNames(
            styles.sentReceivedTimestamp,
            showTimestampOnRight && styles.sentReceivedTimestampRight,
            hasDensityNext && styles.sentReceivedTimestampDensity,
            densityMode
        );

        if (isSending) {
            return <div className={className}> {loc(sending)} </div>;
        }

        return <SentReceivedSavedTime className={className} time={time} />;
    };

    const mailboxInfo = item.MailboxInfo;
    const isDraft = item.IsDraft && !isItemAttachment;
    // Hide the surface buttons if
    // - This item is draft item queued for submission (state Delay or Sending)
    // - This item is draft item submitted, but waiting for delivery and not a scheduled send.
    // - This is a readonly reading pane.
    const hideSurfaceButtons =
        item.isDraftQueuedForSubmission ||
        (isDraft && item.IsSubmitted && !item.DeferredSendTime) ||
        isReadonly;
    // treatAsDraft means the item is a draft, but we want to render the UI as if
    // it is not a draft - this is used for local lie and sending in the drafts
    // folder (undo send in particular)
    const treatAsDraft = isDraft && !isNodePending && !item.isDraftQueuedForSubmission;
    const displaySelf = isDraft || isNodePending;
    const isItemDeliveryReport = isNDRItem(message) || isDRItem(message);

    // Only render reactions on the header when in ItemView
    const shouldShowReactions = !hideSurfaceButtons && !isDraft && isFeatureEnabled('rp-reactions');

    const renderRecipientWell = (): JSX.Element => {
        return !treatAsDraft ? (
            <RecipientWell
                toRecipients={getToRecipientsForDisplay(message, isItemDeliveryReport)}
                ccRecipients={message.CcRecipients}
                bccRecipients={message.BccRecipients}
                itemId={message.ItemId?.Id}
                recipientCounts={message.RecipientCounts}
                isDeliveryReport={isItemDeliveryReport}
                isV2RecipientWell={isRecipientWellOnLeftContainer}
            />
        ) : null;
    };

    // RecipientWellLocation
    const isRecipientWellOnLeftContainer = showTimestampOnRight || shouldShowReactions;

    return (
        <>
            <div
                onClick={props.onExpandCollapse}
                className={classNames(
                    isFeatureEnabled('mon-tri-subjectHeader') &&
                        !isFeatureEnabled('rp-embiggen-dev') &&
                        styles.stickyHeader
                )}>
                {!isNodePending && renderInfoBars(message, viewState)}
                {fetchLinkedInProfile && (
                    <ViewProfileBoldButton
                        isDarkMode={getIsDarkTheme() && !viewState.undoDarkMode}
                        isUnauthenticatedSender={message.AntispamUnauthenticatedSender}
                        sender={sender.Mailbox}
                        message={message}
                        viewState={viewStateWithAllowedInfoBarIds}
                        instrumentationContext={instrumentationContext}
                        isLatestNonDraft={isLatestNonDraft}
                    />
                )}
                {isMeetingMessage(item) && shouldShowMeetingSummary(item, isPopout) && (
                    <div className={styles.meetingSummaryContainer}>
                        <MeetingMessageSummary
                            item={item as MeetingMessage}
                            entrySource={'MailReadingPane'}
                        />
                    </div>
                )}
                <SenderImageWrapper
                    message={message}
                    displaySelf={displaySelf}
                    style={classNames(styles.senderImage, densityMode)}
                    isUnauthenticatedSender={message.AntispamUnauthenticatedSender}
                    showPresence={true}
                    displayPersonaHighlightRing={true}
                />
                <div
                    className={classNames(
                        styles.senderTimeActionsContainer,
                        'allowTextSelection',
                        isFeatureEnabled('mon-tri-readingPaneRedlineUXUpdates') &&
                            styles.senderUpperPaddingReduction,
                        densityMode
                    )}>
                    <div className={styles.senderTimeContainer}>
                        <div
                            className={classNames(
                                styles.senderLinkedInWrapper,
                                isFeatureEnabled('rp-linkedInViewProfileV1_1') &&
                                    styles.compactViewProfileButton,
                                densityMode
                            )}>
                            <SenderPersonaWrapper
                                message={message}
                                treatAsDraft={treatAsDraft}
                                isNodePending={isNodePending}
                                displaySelf={displaySelf}
                            />
                            {fetchLinkedInProfile && (
                                <ViewProfileButton
                                    isDarkMode={getIsDarkTheme() && !viewState.undoDarkMode}
                                    isUnauthenticatedSender={message.AntispamUnauthenticatedSender}
                                    sender={sender.Mailbox}
                                    message={message}
                                    viewState={viewStateWithAllowedInfoBarIds}
                                    instrumentationContext={instrumentationContext}
                                    isLatestNonDraft={isLatestNonDraft}
                                />
                            )}
                        </div>
                        {isNodePending
                            ? renderLocalLieTime()
                            : treatAsDraft
                            ? renderDraftText()
                            : !showTimestampOnRight && renderItemTime()}
                        {isRecipientWellOnLeftContainer && renderRecipientWell()}
                    </div>
                    <div className={styles.rightContainer}>
                        {!hideSurfaceButtons && renderSurfaceButtons(treatAsDraft, isNodePending)}
                        {shouldShowReactions && renderReactionContainer()}
                        {!isNodePending &&
                            (treatAsDraft
                                ? renderDraftTime()
                                : showTimestampOnRight && renderItemTime())}
                    </div>
                </div>
                {!isRecipientWellOnLeftContainer && renderRecipientWell()}
            </div>
            <div
                className={classNames(
                    densityMode,
                    styles.subHeaderContainer,
                    shouldShowUnstackedReadingPane() && styles.unstackedReadingPane,
                    hasDensityNext && isMessageListSeparate() && styles.unstackedReadingPane
                    // when ML is showing separate, RP must be separate, so style it as unstacked
                )}>
                {!isReadonly && (
                    <>
                        {renderMessageApprovalHeader(message)}
                        {isCurrentItemLoaded &&
                            isMeetingMessage(item) &&
                            !shouldShowMeetingCardFeedView(item, isPopout) && (
                                <MeetingMessageInfo
                                    item={item as MeetingMessage}
                                    groupId={
                                        mailboxInfo.type === 'GroupMailbox'
                                            ? mailboxInfo.mailboxSmtpAddress
                                            : null
                                    }
                                    viewState={viewState.meetingRequestViewState}
                                    onDidMount={props.onLazyMount}
                                    entrySource={'MailReadingPane'}
                                />
                            )}
                        {shouldShowSharingMessageHeader(item) && (
                            <div className={styles.sharingAcceptButton}>
                                <SharingAcceptButton item={item as SharingMessage} />
                            </div>
                        )}
                    </>
                )}
                {viewState.attachmentWell && (
                    <AttachmentWellView
                        attachmentWellViewState={viewState.attachmentWell}
                        parentItemId={{
                            ...item.ItemId,
                            mailboxInfo: item.MailboxInfo,
                        }}
                        isDraft={isDraft}
                        instrumentationContext={instrumentationContext}
                    />
                )}
            </div>
        </>
    );
});

function getToRecipientsForDisplay(
    message: ClientMessage,
    isItemDeliveryReport: boolean
): EmailAddressWrapper[] {
    if (isItemDeliveryReport) {
        return message.ReceivedRepresenting
            ? [message.ReceivedRepresenting.Mailbox]
            : [message.From?.Mailbox ? message.From.Mailbox : message.Sender.Mailbox];
    } else {
        return message.ToRecipients;
    }
}
