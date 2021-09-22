import cancelSend from './cancelSend';
import closeCompose from './closeCompose';
import conversationSendStateChanged from './conversationSendStateChanged';
import moveComposeToTab from './moveComposeToTab';
import onSendMessageSucceeded from './onSendMessageSucceeded';
import setAsyncSendState from './setAsyncSendState';
import setIsSending from './setIsSending';
import setPreferAsyncSend from './setPreferAsyncSend';
import setUIEnabledState from './setUIEnabledState';
import { resetComposeItemId } from './smimeActions';
import trySaveMessage, { isSaving, waitForActiveSaving } from './trySaveMessage';
import datapoints, { MailComposeSendDp } from '../datapoints';
import { moreDetailsNotificationLabel } from '../strings.locstring.json';
import checkSendAsAddressAndAddToMru from '../utils/checkSendAsAddressAndAddToMru';
import focusToFirstUnresolvedRecipientWell from '../utils/focusToFirstUnresolvedRecipientWell';
import { getAllRecipients } from '../utils/getAllRecipientsAsEmailAddressStrings';
import getFriendlySubject from '../utils/getFriendlySubject';
import getMailTipsViewStateMap from '../utils/getMailTipsViewStateMap';
import getRecipientsFromWellViewState from '../utils/getRecipientsFromWellViewState';
import { handleSendErrorResponse } from '../utils/handleSendErrorResponse';
import { sendAndSaveInfobarIdsToRemove } from '../utils/InfoBarMessageId';
import { logAttachmentDatapoints } from '../utils/logAttachmentDatapoints';
import popoutCompose from '../utils/popoutCompose';
import safelyGetSmartReplyExtractionId from '../utils/safelyGetSmartReplyExtractionId';
import safelyGetStampedLanguage from '../utils/safelyGetStampedLanguage';
import { UNDO_SEND_ERROR_MESSAGE } from '../utils/sendConstants';
import { CustomError, handleSuccessResponse, sendMessage } from '../utils/sendSaveUtils';
import shouldUseAsyncSend from '../utils/shouldUseAsyncSend';
import validateSend from '../utils/validateSend';
import { isViewStateDirty } from '../utils/viewStateUtils';
import { shouldForceOnSendCompliantBehavior } from 'owa-addins-core';
import endSession from 'owa-controls-findpeople-feedback-manager/lib/actions/endSession';
import { addMilliseconds, now } from 'owa-datetime';
import setShouldUpdateContentOnDispose from 'owa-editor/lib/actions/setShouldUpdateContentOnDispose';
import type { ErrorType } from 'owa-errors';
import { isFeatureEnabled } from 'owa-feature-flags';
import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';
import removeInfoBarMessage from 'owa-info-bar/lib/actions/removeInfoBarMessage';
import loc, { format } from 'owa-localize';
import onComposeLifecycleEvent from 'owa-mail-compose-store/lib/actions/onComposeLifecycleEvent';
import { getDelayedItemStore, lazyRemoveMailItemWithData } from 'owa-mail-delaysend-store';
import showNotificationOnSend from 'owa-mail-delaysend-store/lib/utils/showNotificationOnSend';
import logDeferredSend from 'owa-mail-scheduled-send/lib/metrics/logDeferredSend';
import { logSendActionMailTipsDatapoint } from 'owa-mail-tips/lib/datapoints';
import type ItemInfoResponseMessage from 'owa-service/lib/contract/ItemInfoResponseMessage';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import getSmimeAdminSettings from 'owa-session-store/lib/utils/getSmimeAdminSettings';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import setCurrentBccRecipient from 'owa-smime/lib/actions/setCurrentBccRecipient';
import setSmimeBccForkingMode from 'owa-smime/lib/actions/setSmimeBccForkingMode';
import SmimeBccForkingMode from 'owa-smime-types/lib/schema/SmimeBccForkingMode';
import SmimeBccForkingSetting from 'owa-smime/lib/store/schema/SmimeBccForkingSetting';
import { getActiveSxSId, isSxSDisplayed } from 'owa-sxs-store';
import * as trace from 'owa-trace';
import isPopout from 'owa-popout-v2/lib/utils/isPopout';
import isGroupComposeViewState, {
    isGroupScenario,
} from 'owa-mail-compose-store/lib/utils/isGroupComposeViewState';
import { lazyLogToSIGSOnMessageSent } from 'owa-mail-smart-pill-features';
import {
    ComposeViewState,
    AsyncSendState,
    UIEnabledState,
    ComposeLifecycleEvent,
    PostOpenTaskType,
} from 'owa-mail-compose-store';
import {
    infobarMessageSMIMEBccForkingFailedForRecipients,
    failToSendMessageError,
} from './trySendMessage.locstring.json';
import {
    DatapointStatus,
    PerformanceDatapoint,
    logUsage,
    returnTopExecutingActionDatapoint,
    wrapFunctionForDatapoint,
} from 'owa-analytics';
import {
    lazyAddNotification,
    ensureNotificationHandlerRegistered,
    NotificationActionType,
    NotificationViewState,
} from 'owa-header-toast-notification';
import { createPostOpenTask } from '../utils/createPostOpenTasks';

// If true is used, then the default error type is used
const errorCodeToTypeMap: { [code: string]: ErrorType | true } = {
    ErrorAccountSuspendShowTierUpgrade: 'configuration',
    ErrorAttachmentSizeLimitExceeded: true,
    ErrorExceededMaxRecipientLimit: true,
    ErrorExceededMaxRecipientLimitShowTierUpgrade: true,
    ErrorExceededMessageLimit: 'throttle',
    ErrorExceededMessageLimitShowTierUpgrade: 'throttle',
    ErrorInvalidRecipients: true,
    ErrorOrganizationAccessBlocked: 'configuration',
    ErrorMessageSubmissionBlocked: 'configuration',
    ErrorMessageThrottled: 'throttle',
    ErrorNonExistentMailbox: 'configuration',
    ErrorSendAsDenied: 'accessDenied',
    ErrorSubmissionQuotaExceeded: 'throttle',
    ErrorMessageTransientError: 'transient',
};

function asyncSend(
    viewState: ComposeViewState,
    startSendDatapoint: () => void,
    e2eDatapoint: PerformanceDatapoint,
    targetWindow: Window
): Promise<ItemInfoResponseMessage> {
    const delaySendIntervalSeconds = getUserConfiguration().UserOptions?.MailSendUndoInterval
        ? getUserConfiguration().UserOptions.MailSendUndoInterval
        : 0;

    const sxsId = getActiveSxSId(targetWindow);
    // Start to send here before other code to avoid any client side error interrupt sending
    const sendMessagePromise: Promise<ItemInfoResponseMessage> =
        delaySendIntervalSeconds > 0 && !isSxSDisplayed(sxsId)
            ? handleDelayedSendMessage(
                  viewState,
                  startSendDatapoint,
                  delaySendIntervalSeconds * 1000,
                  sxsId
              )
            : handleSendMessage(viewState, startSendDatapoint);

    setIsSending(viewState, true /*isSending*/);

    e2eDatapoint.markUserPerceivedTime(true);

    return sendMessagePromise;
}

async function smimeSyncSend(viewState: ComposeViewState): Promise<ItemInfoResponseMessage> {
    let responseMessage: ItemInfoResponseMessage;
    const { smimeViewState } = viewState;
    const bccEncryptedEmailForking = getSmimeAdminSettings().BccEncryptedEmailForking;
    const bccRecipients = getRecipientsFromWellViewState(viewState.bccRecipientWell);
    const bccFailedRecipients = [];

    try {
        if (
            viewState.toRecipientWell.recipients.length > 0 ||
            viewState.ccRecipientWell.recipients.length > 0
        ) {
            // Send the first fork with TO and CC recipients.
            setSmimeBccForkingMode(smimeViewState, SmimeBccForkingMode.IncludeOnlyToAndCc);
            responseMessage = await sendMessage(viewState);
            resetComposeItemId(viewState);
        }

        if (bccEncryptedEmailForking == SmimeBccForkingSetting.SeparateCopyToEachBcc) {
            // BccEncryptedEmailForking = 0 -> Separate copy to each BCC recipients.
            let currentBccRecipient = 0;
            setSmimeBccForkingMode(
                smimeViewState,
                SmimeBccForkingMode.IncludeSingleBccInEachMessage
            );
            while (currentBccRecipient < bccRecipients.length) {
                setCurrentBccRecipient(smimeViewState, currentBccRecipient);
                if (!responseMessage) {
                    // Send the first fork to first BCC recipient, when TO and CC recipients are not present.
                    responseMessage = await sendMessage(viewState);
                } else {
                    // Send subsequent BCC forks to each BCC recipient.
                    await sendMessage(viewState).catch(() => {
                        bccFailedRecipients.push(bccRecipients[currentBccRecipient]);
                    });
                }
                viewState.itemId && resetComposeItemId(viewState);
                currentBccRecipient++;
            }
        } else if (bccEncryptedEmailForking == SmimeBccForkingSetting.SingleCopyToAllBcc) {
            // BccEncryptedEmailForking = 1 -> Single copy to all BCC recipients
            setSmimeBccForkingMode(
                smimeViewState,
                SmimeBccForkingMode.IncludeAllBccInSingleMessage
            );
            if (!responseMessage) {
                // Send the first fork to all BCC recipients, when TO and CC recipients are not present.
                responseMessage = await sendMessage(viewState);
            } else {
                // Send subsequent BCC fork to all BCC recipients.
                await sendMessage(viewState).catch(() => {
                    bccFailedRecipients.push(...bccRecipients);
                });
            }
        }

        if (bccFailedRecipients.length > 0) {
            const infobarMessage = format(
                loc(infobarMessageSMIMEBccForkingFailedForRecipients),
                bccFailedRecipients.map(recipient => recipient.Name).join(', ')
            );
            addInfoBarMessage(viewState, 'smimeBccForkingFailedError', [infobarMessage]);
            logUsage('errorSmimeBccForkingFailed', [bccFailedRecipients.length], { isCore: true });
            throw new Error('smimeBccForkingFailedError') as CustomError;
        }
    } catch (e) {
        return Promise.reject(e);
    }

    logUsage('successSmimeBccForking', [bccRecipients.length, bccEncryptedEmailForking], {
        isCore: true,
    });
    return Promise.resolve(responseMessage);
}

function shouldForkMessage(viewState: ComposeViewState): boolean {
    const bccEncryptedEmailForking = getSmimeAdminSettings()?.BccEncryptedEmailForking;
    return (
        viewState.smimeViewState?.shouldEncryptMessageAsSmime &&
        viewState.bccRecipientWell &&
        viewState.bccRecipientWell.recipients.length > 0 &&
        bccEncryptedEmailForking != SmimeBccForkingSetting.SingleCopyToAllRecipients
    );
}

async function syncSend(
    viewState: ComposeViewState,
    startSendDatapoint: () => void
): Promise<ItemInfoResponseMessage> {
    startSendDatapoint();
    setIsSending(viewState, true /*isSending*/);

    try {
        const responseMessage = shouldForkMessage(viewState)
            ? await smimeSyncSend(viewState)
            : await sendMessage(viewState);
        endSession(viewState.toRecipientWell.findPeopleFeedbackManager, 'Send');
        closeCompose(viewState, 'Send');
        handleComposeSendStateChange(viewState, true /* isSendPending */);
        return responseMessage;
    } catch (error) {
        throw error;
    }
}

function handleSendMessage(
    viewState: ComposeViewState,
    startSendDatapoint: () => void
): Promise<ItemInfoResponseMessage> {
    startSendDatapoint();
    logAttachmentDatapoints(viewState);

    setAsyncSendState(viewState, AsyncSendState.Sending);
    handleComposeSendStateChange(viewState, true /*isSendPending*/);
    // Set to preferAsyncSend to false in case the send failed, then the retry will use sync send
    setPreferAsyncSend(viewState, false /* preferAsyncSend */);

    return sendMessage(viewState)
        .then(responseMessage => {
            // Handle the response here to avoid false alerm of sending failure caused by client side error
            setAsyncSendState(viewState, AsyncSendState.Sent);
            return Promise.resolve(responseMessage);
        })
        .catch((error: CustomError) => {
            // Only show the send failure notification when we really got server side sending error
            handleFailedOrCanceledAsyncSend(viewState, error);
            error.showErrorToUser = true;
            return Promise.reject(error);
        });
}

function handleDelayedSendMessage(
    viewState: ComposeViewState,
    startSendDatapoint: () => void,
    delaySendIntervalMilliseconds: number,
    sxsId: string
): Promise<ItemInfoResponseMessage> {
    setAsyncSendState(viewState, AsyncSendState.Delay);
    handleComposeSendStateChange(viewState, true /* isSendPending */);

    return new Promise<ItemInfoResponseMessage>((resolve, reject) => {
        // Start delay timer and show Undo send notification bar
        const delaySendTimer = window.setTimeout(async function () {
            lazyRemoveMailItemWithData.importAndExecute(viewState);
            try {
                resolve(await handleSendMessage(viewState, startSendDatapoint));
            } catch (error) {
                reject(error);
            }
        }, delaySendIntervalMilliseconds);
        showNotificationOnSend(delaySendIntervalMilliseconds);

        // Update the delayedSendStore and prep for cancel send
        getDelayedItemStore().delayedMailItems.push({
            timeoutId: delaySendTimer,
            timeToSend: addMilliseconds(now(), delaySendIntervalMilliseconds),
            data: viewState,
            afterCancel: data => {
                cancelSend(data, sxsId);
                handleFailedOrCanceledAsyncSend(viewState);
                reject(new Error(UNDO_SEND_ERROR_MESSAGE));
            },
        });

        // Save draft
        if (!isGroupScenario(viewState) && !isSaving(viewState) && isViewStateDirty(viewState)) {
            trySaveMessage(viewState, true /*isAutoSave*/);
        }
    });
}

function onAsyncSendNotificationClick(notification: NotificationViewState) {
    const viewState = notification.actionContext as ComposeViewState;
    moveComposeToTab(viewState, true /* isShown */, true /* makeActive */);
}

function addErrorNotification(viewState: ComposeViewState) {
    const subject = getFriendlySubject(viewState.subject);

    ensureNotificationHandlerRegistered(
        NotificationActionType.AsyncSendFailed,
        onAsyncSendNotificationClick
    );

    const notification = {
        actionType: NotificationActionType.AsyncSendFailed,
        title: loc(failToSendMessageError),
        description: subject,
        actionLink: loc(moreDetailsNotificationLabel),
        cancelLink: null,
        actionContext: viewState,
    };

    lazyAddNotification.importAndExecute(notification as NotificationViewState);
}

function handleFailedOrCanceledAsyncSend(viewState: ComposeViewState, error?: CustomError) {
    handleComposeSendStateChange(viewState, false /* isSendPending */);

    // Only do this in Sending state because Sending means the viewState is still pending,
    // while it will be Timeout state after a period, in that case the viewState is floating rather than pending/
    // We don't need to show error notification for floating compose because the form itself is already visible
    if (viewState.asyncSendState == AsyncSendState.Sending) {
        // Don't notify for send failure if the reason for the failure is hip challenge related.
        if (!error || error.message !== 'ErrorMessageSubmissionBlocked' || !isConsumer()) {
            addErrorNotification(viewState);
        }
    }

    if (viewState.asyncSendState != AsyncSendState.None) {
        setAsyncSendState(viewState, AsyncSendState.Error);
    }

    setIsSending(viewState, false /*isSending*/);
}

function endCtq(datapoint: PerformanceDatapoint, viewState: ComposeViewState, error?: CustomError) {
    if (datapoint) {
        window.requestAnimationFrame(() => {
            // Add extraction ID for smart reply, so we can generate meaningful experiment data.
            // Also log the number of keystrokes.
            const keyStrokeCount: number = viewState.keyStrokeCount;
            datapoint.addCosmosOnlyData(
                JSON.stringify({
                    smartReplyExtractionId: safelyGetSmartReplyExtractionId(
                        viewState,
                        'smartReply' /* type */
                    ),
                    smartDocExtractionId: safelyGetSmartReplyExtractionId(
                        viewState,
                        'smartDoc' /* type */
                    ),
                    keyStrokeCount: keyStrokeCount,
                })
            );

            const isMailComposeSendDp: boolean = datapoint.eventName == MailComposeSendDp;

            if (error) {
                datapoint.addCustomData(
                    isMailComposeSendDp
                        ? [error.showErrorToUser, error.isAsyncSend]
                        : {
                              showErrorToUser: error.showErrorToUser,
                              isAsyncSend: error.isAsyncSend,
                              composeTraceId: viewState.logTraceId,
                              operation: viewState.operation,
                          }
                );
                const errorType = error && errorCodeToTypeMap[error.message];
                datapoint.endWithError(
                    errorType
                        ? typeof errorType == 'string'
                            ? DatapointStatus.ServerExpectedError
                            : DatapointStatus.UserError
                        : DatapointStatus.ServerError,
                    error,
                    undefined, // use default value
                    errorType && typeof errorType == 'string' ? errorType : undefined
                );
            } else {
                if (isMailComposeSendDp) {
                    datapoint.addCustomData({
                        operation: viewState.operation,
                        messageLanguage: safelyGetStampedLanguage(viewState),
                    });
                }

                datapoint.end();
            }
        });
    }
}

function handleComposeSendStateChange(viewState: ComposeViewState, isSendPending: boolean) {
    // In conversation view when send state is changed due to send or deferred send,
    // trigger conversationSendStateChanged action.
    viewState?.conversationId && conversationSendStateChanged(viewState, isSendPending);
}

export default wrapFunctionForDatapoint(
    datapoints.MailComposeSendE2E,
    async function trySendMessage(
        viewState: ComposeViewState,
        targetWindow?: Window,
        bypassClientSideValidation?: boolean
    ) {
        if (viewState.isSending) {
            // Avoid duplicated sending
            return Promise.resolve();
        }
        setUIEnabledState(viewState, UIEnabledState.SendButtonDisabled);
        try {
            if (
                isFeatureEnabled('addin-popoutComposeAndSend') &&
                shouldForceOnSendCompliantBehavior()
            ) {
                setUIEnabledState(viewState, UIEnabledState.AllDisabled);
                if (!isPopout(targetWindow)) {
                    viewState.postOpenTasks.push(
                        createPostOpenTask(PostOpenTaskType.Send, {
                            bypassClientSideValidation: false,
                        })
                    );
                    popoutCompose(viewState);
                    return Promise.resolve();
                }
            }

            const mailComposeSendE2EDataPoint = returnTopExecutingActionDatapoint();
            const useAsyncSend = shouldUseAsyncSend(viewState);

            removeInfoBarMessage(viewState, sendAndSaveInfobarIdsToRemove);

            const errorCode =
                !bypassClientSideValidation &&
                (await validateSend(viewState, targetWindow, mailComposeSendE2EDataPoint));

            if (!errorCode) {
                if (!viewState.itemId) {
                    // Wait for active saving if item id hasn't been assigned
                    // This is to avoid duplicated draft is created
                    await waitForActiveSaving(viewState);
                }

                const currentUpdateContentOnDispose = viewState.shouldUpdateContentOnDispose;
                setShouldUpdateContentOnDispose(viewState, false /*shouldUpdateContentOnDispose*/);

                onComposeLifecycleEvent(viewState, ComposeLifecycleEvent.MessageBeingSent);

                // Track the real sending failure, client side validation failure is excluded
                let sendDatapoint: PerformanceDatapoint = null;

                const startSendDatapoint = () => {
                    sendDatapoint = new PerformanceDatapoint(
                        isGroupScenario(viewState) ? 'GroupMailComposeSend' : MailComposeSendDp
                    );
                };

                const sendFunction = useAsyncSend ? asyncSend : syncSend;

                let responseMessage: ItemInfoResponseMessage = null;
                try {
                    responseMessage = await sendFunction(
                        viewState,
                        startSendDatapoint,
                        mailComposeSendE2EDataPoint,
                        targetWindow
                    );

                    if (isGroupScenario(viewState)) {
                        sendDatapoint.addCustomData({
                            composeTraceId: viewState.logTraceId,
                            operation: viewState.operation,
                        });
                    }

                    // Check if the From address should be added to the MRU and, if so, add it (VSO 34513)
                    checkSendAsAddressAndAddToMru(viewState.fromViewState);
                } catch (error) {
                    if (currentUpdateContentOnDispose) {
                        setShouldUpdateContentOnDispose(
                            viewState,
                            true /* reset to the value before sending */
                        );
                    }

                    error.isAsyncSend = useAsyncSend;
                    setIsSending(viewState, false /*isSending*/);
                    endCtq(sendDatapoint, viewState, error);
                    handleSendErrorResponse(error, viewState, true /*isSend*/, targetWindow);
                    return Promise.reject(error);
                }

                // Log to SIGS.
                lazyLogToSIGSOnMessageSent.importAndExecute(
                    viewState.referenceItemId?.Id,
                    viewState.content,
                    viewState.smartPillViewState?.smartReplyComposeSIGSData
                );

                // Log datapoints based on properties of message.
                if (viewState.protectionViewState?.IRMData) {
                    logUsage('MailComposeSendWithIRMData');
                }
                if (viewState.isReadReceiptRequested) {
                    logUsage('MailComposeSendRequestReadReceipt');
                }
                if (viewState.isDeliveryReceiptRequested) {
                    logUsage('MailComposeSendRequestDeliveryReceipt');
                }
                if (viewState.sensitivity) {
                    logUsage('MailComposeSendWithMessageSensitivity');
                }

                if (viewState.deferredSendTime) {
                    logDeferredSend(viewState.deferredSendTime);
                }

                logSendActionMailTipsDatapoint(
                    getMailTipsViewStateMap(viewState.ccRecipientWell, getAllRecipients(viewState))
                );
                setIsSending(viewState, false /*isSending*/);
                endCtq(sendDatapoint, viewState);
                const handledSuccessfully = handleSuccessResponse(responseMessage, viewState);
                onSendMessageSucceeded(
                    viewState.operation,
                    viewState.referenceItemId,
                    viewState.composeId,
                    viewState.conversationId,
                    isGroupComposeViewState(viewState),
                    viewState.protectionViewState.clpViewState
                );

                if (handledSuccessfully) {
                    return Promise.resolve();
                } else {
                    mailComposeSendE2EDataPoint.endWithError(
                        DatapointStatus.ServerError,
                        new Error('Malformed response shape')
                    );
                    // Returning as a regular resolve here, as I'm not sure of the side effects.
                    return Promise.resolve();
                }
            } else {
                setIsSending(viewState, false /*isSending*/);
                try {
                    // Validation errors are the only type of error thrown
                    if (errorCode === 'InvalidRecipients') {
                        focusToFirstUnresolvedRecipientWell(viewState);
                    }
                } catch (e) {
                    trace.errorThatWillCauseAlert('Error in send failure handler', e);
                }
                mailComposeSendE2EDataPoint.endWithError(
                    DatapointStatus.UserError,
                    new Error(errorCode)
                );
                return Promise.reject(new Error(errorCode));
            }
        } finally {
            // Re-enable the Send button, so user can try sending again in case of failure
            // This includes the case where Send has been canceled by the user (i.e. undo send)
            setUIEnabledState(viewState, UIEnabledState.Enabled);
        }
    }
);
