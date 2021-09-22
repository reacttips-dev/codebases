import * as trace from 'owa-trace';
import { DatapointStatus, lazyLogSigsDatapoint, PerformanceDatapoint } from 'owa-analytics';
import setAttachmentOriginalUrl from 'owa-attachment-model-store/lib/actions/setAttachmentOriginalUrl';
import getAttachment from 'owa-attachment-model-store/lib/selectors/getAttachment';
import getAttachmentFileType from 'owa-attachment-model-store/lib/utils/getAttachmentFileType';
import {
    saveAttachmentsToCloud,
    SaveToCloudStatus,
    trackSaveAttachmentsToCloud,
} from 'owa-attachment-savetocloud';
import { lazyRemediateAuth } from 'owa-auth-redemption';
import type { ClientAttachmentId } from 'owa-client-ids';
import { isFeatureEnabled } from 'owa-feature-flags';
import getImmutableEntryId from 'owa-immutable-id/lib/getImmutableEntryId';
import AttachmentResultCode from 'owa-service/lib/contract/AttachmentResultCode';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type SaveToCloudNotificationPayload from 'owa-service/lib/contract/SaveToCloudNotificationPayload';
import { action } from 'satcheljs/lib/legacy';
import ActionMessageId from '../schema/ActionMessageId';
import ActionType from '../schema/ActionType';
import type AttachmentFullViewState from '../schema/AttachmentFullViewState';
import { setSaveToCloudStatusHelper } from '../utils/setSaveToCloudStatusHelper';
import addCompletedAction from './addCompletedAction';
import { getIsViewingInProviderSupported } from './initialization/createAttachmentFullViewStrategy';
import setOngoingActionAndActionMessage from './setOngoingActionAndActionMessage';
import updateIsViewingInProviderSupported from './updateIsViewingInProviderSupported';

export default action('saveToCloud')(function saveToCloud(
    attachment: AttachmentFullViewState,
    completeHandler: (succeeded: boolean) => void,
    entryPoint: string,
    parentItemId: ItemId,
    senderEmail: string,
    sxsId: string,
    shouldSkipRemediateAuth: boolean = true
) {
    const [notificationHandler, serviceCallFailureCallback] = getHandlerAndCallback(
        attachment,
        completeHandler,
        entryPoint,
        parentItemId,
        false, // isNewTab
        senderEmail,
        sxsId,
        shouldSkipRemediateAuth,
        () => {
            saveToCloud(
                attachment,
                completeHandler,
                entryPoint,
                parentItemId,
                senderEmail,
                sxsId,
                true
            );
        }
    );

    saveAttachmentsToCloud(
        attachment.attachmentId,
        null,
        sxsId,
        notificationHandler,
        serviceCallFailureCallback
    );
});

/**
 * This is for when we are saving to cloud in a new tab. We still want to track the progress
 * in the existing tab, but we do not want to save the same file twice.
 * This function handles all of the UI and status updates associated with saving to cloud, while listening
 * to a subscription that is open in a different tab.
 */
export function trackSaveToCloud(
    attachment: AttachmentFullViewState,
    completeHandler: (succeeded: boolean) => void,
    entryPoint: string,
    parentItemId: ItemId,
    subscriptionId: string,
    senderEmail: string,
    sxsId: string
) {
    const [notificationHandler, serviceCallFailureCallback] = getHandlerAndCallback(
        attachment,
        completeHandler,
        entryPoint,
        parentItemId,
        true, // isNewTab
        senderEmail,
        sxsId,
        true /* shouldSkipRemediateAuth */,
        null /* retryFunction */
    );

    trackSaveAttachmentsToCloud(
        attachment.attachmentId,
        notificationHandler,
        serviceCallFailureCallback,
        subscriptionId,
        sxsId
    );
}

function getHandlerAndCallback(
    attachment: AttachmentFullViewState,
    completeHandler: (succeeded: boolean) => void,
    entryPoint: string,
    parentItemId: ItemId,
    isNewTab: boolean,
    senderEmail: string,
    sxsId: string,
    shouldSkipRemediateAuth: boolean,
    retryFunction: () => void
): [
    (payload: SaveToCloudNotificationPayload) => boolean,
    (
        error: string,
        resultCode: AttachmentResultCode,
        datapointStatus: DatapointStatus,
        sxsId: string
    ) => void
] {
    const datapoint: PerformanceDatapoint = new PerformanceDatapoint('AttachmentSaveToCloud');
    setSaveToCloudStatusHelper.run(SaveToCloudStatus.saving, attachment.attachmentId, sxsId);
    saveToCloudPreProcess(attachment, isNewTab);

    const notificationHandler = (payload: SaveToCloudNotificationPayload): boolean => {
        const succeeded = payload.ResultCode === AttachmentResultCode.Success;

        if (
            isFeatureEnabled('doc-authcontextStage2') &&
            payload.ResultCode === AttachmentResultCode.AuthContextRequired &&
            !shouldSkipRemediateAuth &&
            retryFunction
        ) {
            const authenticateHeader: string = payload.ClaimsChallenge;

            if (!!authenticateHeader) {
                logSaveToCloudDatapoint(
                    datapoint,
                    attachment.attachmentId,
                    payload.ResultCode,
                    DatapointStatus.ServerError,
                    payload.Exception,
                    entryPoint,
                    parentItemId,
                    senderEmail
                );

                (async () => {
                    let error: boolean = false;
                    try {
                        const remediateAuth = await lazyRemediateAuth.import();
                        await remediateAuth(authenticateHeader);
                    } catch (e) {
                        error = true;
                    }

                    if (!error) {
                        trace.trace.info('saveToCloud retry after remediateAuth');
                        retryFunction();
                    } else {
                        trace.trace.info('saveToCloud remediateAuth failed');
                        saveToCloudPostProcess(
                            attachment,
                            succeeded,
                            succeeded ? payload.Item.Location : null,
                            sxsId
                        );

                        completeHandler(succeeded);
                    }
                })();

                return true; // operationComplete
            }
        }

        saveToCloudPostProcess(
            attachment,
            succeeded,
            succeeded ? payload.Item.Location : null,
            sxsId
        );

        completeHandler(succeeded);

        logSaveToCloudDatapoint(
            datapoint,
            attachment.attachmentId,
            payload.ResultCode,
            DatapointStatus.ServerError,
            payload.Exception,
            entryPoint,
            parentItemId,
            senderEmail
        );

        return true;
    };

    const serviceCallFailureCallback = (
        error: string,
        resultCode: AttachmentResultCode,
        datapointStatus: DatapointStatus,
        sxsId: string // pass if SxS is supported and can be supported with multiple views
    ): void => {
        saveToCloudPostProcess(attachment, false, null, sxsId);
        completeHandler(false);
        logSaveToCloudDatapoint(
            datapoint,
            attachment.attachmentId,
            resultCode,
            datapointStatus,
            error,
            entryPoint,
            parentItemId,
            senderEmail
        );
    };

    return [notificationHandler, serviceCallFailureCallback];
}

function logSaveToCloudDatapoint(
    datapoint: PerformanceDatapoint,
    attachmentId: ClientAttachmentId,
    resultCode: AttachmentResultCode,
    datapointErrorStatus: DatapointStatus,
    exception: string,
    entryPoint: string,
    parentItemId: ItemId,
    senderEmail: string
) {
    const attachmentModel = getAttachment(attachmentId);
    datapoint.addCustomData({
        entryPoint: entryPoint,
        result: resultCode,
    });

    const fileType = getAttachmentFileType(attachmentModel);
    datapoint.addCosmosOnlyData(
        JSON.stringify({
            size: attachmentModel.model.Size,
            fileType,
        })
    );

    if (resultCode === AttachmentResultCode.Success) {
        datapoint.end();
    } else {
        datapoint.endWithError(datapointErrorStatus, new Error(exception));
    }

    // Use then instead of async-await to reduce script size
    getImmutableEntryId(parentItemId?.Id).then(immutableEntryId => {
        lazyLogSigsDatapoint.importAndExecute('SavedAttachment', {
            itemId: immutableEntryId,
            customProperties: {
                FileId: attachmentId.Id,
                FileType: fileType,
                Destination: 'Cloud',
                Sender: senderEmail,
            },
        });
    });
}

export function saveToCloudPreProcess(
    attachment: AttachmentFullViewState,
    isNewTab: boolean = false
) {
    const actionMessage = isNewTab
        ? ActionMessageId.OpenInNewTabInProgress
        : ActionMessageId.SaveToCloudInProgress;
    setOngoingActionAndActionMessage(attachment, ActionType.SaveToCloud, actionMessage);
}

export function saveToCloudPostProcess(
    attachment: AttachmentFullViewState,
    succeeded: boolean,
    location: string,
    sxsId: string // pass if SxS is supported and can be supported with multiple views
) {
    if (succeeded) {
        addCompletedAction(attachment, ActionType.SaveToCloud);
        setAttachmentOriginalUrl(attachment.attachmentId, location);
        setSaveToCloudStatusHelper.run(SaveToCloudStatus.succeeded, attachment.attachmentId, sxsId);
        const isViewingInProviderSupported = getIsViewingInProviderSupported(
            false /* isCloudy */,
            false /* isLink */,
            location
        );
        updateIsViewingInProviderSupported(attachment, isViewingInProviderSupported);
    } else {
        setSaveToCloudStatusHelper.run(SaveToCloudStatus.failed, attachment.attachmentId, sxsId);
    }
    setOngoingActionAndActionMessage(
        attachment,
        ActionType.None,
        succeeded
            ? ActionMessageId.SaveToCloudCompletedWithIcon
            : ActionMessageId.SaveToCloudFailedWithIcon
    );
}
