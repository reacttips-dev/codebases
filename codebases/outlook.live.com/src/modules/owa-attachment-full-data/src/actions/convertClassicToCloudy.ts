import * as trace from 'owa-trace';
import setOngoingActionAndActionMessage from './setOngoingActionAndActionMessage';
import ActionMessageId from '../schema/ActionMessageId';
import ActionType from '../schema/ActionType';
import type AttachmentFullViewState from '../schema/AttachmentFullViewState';
import convertClassicToCloudyAttachment from '../services/convertClassicToCloudyAttachment';
import { DatapointStatus, PerformanceDatapoint } from 'owa-analytics';
import getAttachment from 'owa-attachment-model-store/lib/selectors/getAttachment';
import { subscribeNotificationAndGetChannelId } from 'owa-attachment-web-notification';
import { lazyRemediateAuth } from 'owa-auth-redemption';
import type { ClientAttachmentId } from 'owa-client-ids';
import { isFeatureEnabled } from 'owa-feature-flags';
import { lazyUnsubscribe } from 'owa-notification';
import type AttachmentInfoResponseMessage from 'owa-service/lib/contract/AttachmentInfoResponseMessage';
import AttachmentResultCode from 'owa-service/lib/contract/AttachmentResultCode';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type ConvertLocalToRefAttachmentNotificationPayload from 'owa-service/lib/contract/ConvertLocalToRefAttachmentNotificationPayload';
import type ItemId from 'owa-service/lib/contract/ItemId';
import { action } from 'satcheljs/lib/legacy';

const convertClassicToCloudyCancellationMap: { [attachmentId: string]: string } = {};
export default action('convertClassicToCloudy')(function convertClassicToCloudy(
    attachment: AttachmentFullViewState,
    parentItemId: ItemId,
    completeHandler: (succeeded: boolean, attachmentType: AttachmentType) => void,
    shouldSkipRemediateAuth: boolean = true
) {
    const datapoint: PerformanceDatapoint = new PerformanceDatapoint(
        'AttachmentConvertClassicToCloudy'
    );

    convertClassicToCloudyPreProcess(attachment);
    const notificationHandler = (
        payload: ConvertLocalToRefAttachmentNotificationPayload
    ): boolean => {
        convertClassicToCloudyPostProcess(attachment, payload.ResultCode);
        logConvertClassicToCloudyDatapoint(
            datapoint,
            attachment.attachmentId,
            payload.ResultCode,
            payload.Exception
        );
        if (
            payload.ResultCode === AttachmentResultCode.Success &&
            payload.Response &&
            payload.Response.ResponseMessages &&
            payload.Response.ResponseMessages.Items &&
            payload.Response.ResponseMessages.Items.length > 0 &&
            payload.Response.ResponseMessages.Items[0].ResponseCode === 'NoError'
        ) {
            const responseMessage: AttachmentInfoResponseMessage =
                payload.Response.ResponseMessages.Items[0];
            completeHandler(true, responseMessage.Attachments[0]);
        } else {
            if (
                isFeatureEnabled('doc-authcontextStage2') &&
                payload.ResultCode === AttachmentResultCode.AuthContextRequired &&
                !shouldSkipRemediateAuth
            ) {
                const authenticateHeader: string = payload.ClaimsChallenge;
                if (!!authenticateHeader) {
                    (async () => {
                        let error: boolean = false;
                        try {
                            const remediateAuth = await lazyRemediateAuth.import();
                            await remediateAuth(authenticateHeader);
                        } catch (e) {
                            error = true;
                        }

                        if (!error) {
                            trace.trace.info('Retry convertClassicToCloud after remediateAuth');
                            convertClassicToCloudy(
                                attachment,
                                parentItemId,
                                completeHandler,
                                true /* shouldSkipRemediateAuth */
                            );
                        } else {
                            trace.trace.info('convertClassicToCloud remediateAuth failed');
                            completeHandler(false, null);
                        }
                    })();
                } else {
                    completeHandler(false, null);
                }
            } else {
                completeHandler(false, null);
            }
        }

        return true;
    };
    const serviceCallFailureCallback = (error: string): void => {
        convertClassicToCloudyPostProcess(attachment, AttachmentResultCode.GenericFailure);
        completeHandler(false, null);
        logConvertClassicToCloudyDatapoint(
            datapoint,
            attachment.attachmentId,
            AttachmentResultCode.GenericFailure,
            error
        );
    };

    return invokeConvertClassicToCloudyService(
        attachment.attachmentId,
        parentItemId,
        notificationHandler,
        serviceCallFailureCallback
    );
});

export function getCancellationId(attachmentId: string): string {
    return convertClassicToCloudyCancellationMap[attachmentId];
}

async function invokeConvertClassicToCloudyService(
    attachmentId: ClientAttachmentId,
    parentItemId: ItemId,
    notificationHandler: (notification: ConvertLocalToRefAttachmentNotificationPayload) => boolean,
    serviceCallFailureCallback: (error: string) => void
) {
    const [
        subscriptionId,
        subscription,
        handleAttachmentNofication,
        channelId,
    ] = await subscribeNotificationAndGetChannelId(notificationHandler);
    convertClassicToCloudyCancellationMap[attachmentId.Id] = subscriptionId;
    try {
        await convertClassicToCloudyAttachment(
            attachmentId.Id,
            parentItemId,
            subscriptionId,
            channelId,
            subscriptionId // subscriptionId is guid so we reuse it as cancellationId
        );
    } catch (error) {
        serviceCallFailureCallback(error.message);
        lazyUnsubscribe.importAndExecute(subscription, handleAttachmentNofication);
    }
}

export function convertClassicToCloudyPreProcess(attachment: AttachmentFullViewState) {
    setOngoingActionAndActionMessage(
        attachment,
        ActionType.ConvertClassicToCloudy,
        ActionMessageId.ConvertClassicToCloudyInProgress
    );
}

export function convertClassicToCloudyPostProcess(
    attachment: AttachmentFullViewState,
    resultCode: AttachmentResultCode
) {
    switch (resultCode) {
        case AttachmentResultCode.Success:
            break;
        case AttachmentResultCode.Cancelled:
            setOngoingActionAndActionMessage(attachment, ActionType.None, ActionMessageId.None);
            break;
        default:
            setOngoingActionAndActionMessage(
                attachment,
                ActionType.None,
                ActionMessageId.ConvertClassicToCloudyFailedWithIcon
            );
            break;
    }
    delete convertClassicToCloudyCancellationMap[attachment.attachmentId.Id];
}

function logConvertClassicToCloudyDatapoint(
    datapoint: PerformanceDatapoint,
    attachmentId: ClientAttachmentId,
    resultCode: AttachmentResultCode,
    exception: string
) {
    const attachmentModel = getAttachment(attachmentId);
    datapoint.addCosmosOnlyData(
        JSON.stringify({
            size: attachmentModel.model.Size,
        })
    );
    datapoint.addCustomData([resultCode]);
    if (
        resultCode === AttachmentResultCode.Success ||
        resultCode === AttachmentResultCode.Cancelled
    ) {
        datapoint.end();
    } else {
        datapoint.endWithError(DatapointStatus.ServerError, new Error(exception));
    }
}
