import setActionCompletePercent from '../actions/setActionCompletePercent';
import setOngoingActionAndActionMessage from '../actions/setOngoingActionAndActionMessage';
import ActionMessageId from '../schema/ActionMessageId';
import ActionType from '../schema/ActionType';
import type AttachmentFullViewState from '../schema/AttachmentFullViewState';
import type { ConvertCloudyToClassicSource } from '../schema/ConvertCloudyToClassicSource';
import convertCloudyToClassicAttachment from '../services/convertCloudyToClassicAttachment';
import getSaveToCloudEstimatedCompleteTimeInMS from '../utils/actionCompleteTimeEstimators';
import startFakeProgressIndicator, {
    stopFakeProgressIndicator,
} from '../utils/FakeProgressIndicator';
import { DatapointStatus, PerformanceDatapoint } from 'owa-analytics';
import getAttachment from 'owa-attachment-model-store/lib/selectors/getAttachment';
import { subscribeNotificationAndGetChannelId } from 'owa-attachment-web-notification';
import { lazyUnsubscribe } from 'owa-notification';
import type AttachmentPermissionLevel from 'owa-service/lib/contract/AttachmentPermissionLevel';
import AttachmentResultCode from 'owa-service/lib/contract/AttachmentResultCode';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import type ConvertRefToLocalAttachmentNotificationPayload from 'owa-service/lib/contract/ConvertRefToLocalAttachmentNotificationPayload';
import fileAttachment from 'owa-service/lib/factory/fileAttachment';
import { action, orchestrator } from 'satcheljs';
import type { ClientAttachmentId } from 'owa-client-ids';

const convertCloudyToClassicCancellationMap: { [attachmentId: string]: string } = {};

const convertCloudyToClassicAction = action(
    'convertCloudyToClassic',
    (
        attachment: AttachmentFullViewState,
        parentItemId: string,
        fullPathLocation: string,
        permissionLevel: AttachmentPermissionLevel,
        replaceAttachmentHandler: (
            attachmentViewState: AttachmentFullViewState,
            attachmentType: AttachmentType,
            isReadOnly: boolean,
            uploadCompleted: boolean
        ) => void,
        source: ConvertCloudyToClassicSource
    ) => ({
        attachment,
        parentItemId,
        fullPathLocation,
        permissionLevel,
        replaceAttachmentHandler,
        source,
    })
);

export default convertCloudyToClassicAction;

orchestrator(convertCloudyToClassicAction, actionMessage => {
    const attachment = actionMessage.attachment;

    convertCloudyToClassic(
        attachment,
        actionMessage.parentItemId,
        actionMessage.fullPathLocation,
        actionMessage.permissionLevel,
        (succeeded: boolean, attachmentType: AttachmentType) => {
            if (succeeded) {
                actionMessage.replaceAttachmentHandler(attachment, attachmentType, false, true);
            } else {
                stopFakeProgressIndicator(attachment.attachmentId, succeeded);
            }
        },
        actionMessage.source
    );
    startFakeProgressIndicator(
        getSaveToCloudEstimatedCompleteTimeInMS(attachment.attachmentId),
        0.1,
        (completePercent: number) => {
            setActionCompletePercent(attachment, completePercent);
        },
        attachment.attachmentId
    );
});

export function getCancellationId(attachmentId: string): string {
    return convertCloudyToClassicCancellationMap[attachmentId];
}

async function convertCloudyToClassic(
    attachment: AttachmentFullViewState,
    parentItemId: string,
    fullPathLocation: string,
    permissionLevel: AttachmentPermissionLevel,
    completeHandler: (succeeded: boolean, attachmentType: AttachmentType) => void,
    source: ConvertCloudyToClassicSource
): Promise<void> {
    const datapoint: PerformanceDatapoint = new PerformanceDatapoint(
        'AttachmentConvertCloudyToClassic'
    );

    convertCloudyToClassicPreProcess(attachment);
    const notificationHandler = (
        payload: ConvertRefToLocalAttachmentNotificationPayload
    ): boolean => {
        convertCloudyToClassicPostProcess(attachment, payload.ResultCode);
        logConvertCloudyToClassicDatapoint(
            datapoint,
            attachment.attachmentId,
            payload.ResultCode,
            payload.Exception,
            source
        );
        if (payload.ResultCode === AttachmentResultCode.Success) {
            const attachment = fileAttachment({
                Name: payload.Item.Name,
                Size: payload.Item.Size,
                AttachmentId: payload.NewAttachmentId,
            });
            completeHandler(true, attachment);
        } else {
            completeHandler(false, null);
        }
        return true;
    };
    const serviceCallFailureCallback = (error: string): void => {
        convertCloudyToClassicPostProcess(attachment, AttachmentResultCode.GenericFailure);
        completeHandler(false, null);
        logConvertCloudyToClassicDatapoint(
            datapoint,
            attachment.attachmentId,
            AttachmentResultCode.GenericFailure,
            error,
            source
        );
    };

    await invokeConvertCloudyToClassicService(
        attachment.attachmentId,
        parentItemId,
        fullPathLocation,
        permissionLevel,
        notificationHandler,
        serviceCallFailureCallback
    );
}

async function invokeConvertCloudyToClassicService(
    attachmentId: ClientAttachmentId,
    parentItemId: string,
    fullPathLocation: string,
    permissionLevel: AttachmentPermissionLevel,
    notificationHandler: (notification: ConvertRefToLocalAttachmentNotificationPayload) => boolean,
    serviceCallFailureCallback: (error: string) => void
): Promise<void> {
    const [
        subscriptionId,
        subscription,
        handleAttachmentNofication,
        channelId,
    ] = await subscribeNotificationAndGetChannelId(notificationHandler);
    convertCloudyToClassicCancellationMap[attachmentId.Id] = subscriptionId;
    try {
        await convertCloudyToClassicAttachment(
            attachmentId.Id,
            parentItemId,
            subscriptionId,
            channelId,
            subscriptionId, // subscriptionId is guid so we reuse it as cancellationId
            fullPathLocation,
            permissionLevel
        );
    } catch (error) {
        serviceCallFailureCallback(error.message);
        lazyUnsubscribe.importAndExecute(subscription, handleAttachmentNofication);
    }
}

export function convertCloudyToClassicPreProcess(attachment: AttachmentFullViewState) {
    setOngoingActionAndActionMessage(
        attachment,
        ActionType.ConvertCloudyToClassic,
        ActionMessageId.ConvertCloudyToClassicInProgress
    );
}

export function convertCloudyToClassicPostProcess(
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
                ActionMessageId.ConvertCloudyToClassicFailedWithIcon
            );
            break;
    }
    delete convertCloudyToClassicCancellationMap[attachment.attachmentId.Id];
}

function logConvertCloudyToClassicDatapoint(
    datapoint: PerformanceDatapoint,
    attachmentId: ClientAttachmentId,
    resultCode: AttachmentResultCode,
    exception: string,
    source: ConvertCloudyToClassicSource
) {
    const attachmentModel = getAttachment(attachmentId);
    datapoint.addCosmosOnlyData(
        JSON.stringify({
            size: attachmentModel.model.Size,
            attachmentId: attachmentModel.model.AttachmentId?.Id,
        })
    );
    datapoint.addCustomData([resultCode, source]);
    if (
        resultCode === AttachmentResultCode.Success ||
        resultCode === AttachmentResultCode.Cancelled
    ) {
        datapoint.end();
    } else {
        datapoint.endWithError(DatapointStatus.ServerError, new Error(exception));
    }
}
