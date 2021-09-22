import { lazyCheckPendingAttachmentOperation } from 'owa-attachment-model-store';
import AttachmentOperationType from 'owa-service/lib/contract/AttachmentOperationType';
import type SaveToCloudNotificationPayload from 'owa-service/lib/contract/SaveToCloudNotificationPayload';
import type CheckPendingAttachmentOperationResponse from 'owa-service/lib/contract/CheckPendingAttachmentOperationResponse';
import { PerformanceDatapoint } from 'owa-analytics';
import { DatapointStatus } from 'owa-analytics/lib/types/DatapointEnums';
import type { ClientAttachmentId, ClientItemId } from 'owa-client-ids';

export interface OperationData {
    timer: NodeJS.Timer;
    counter: number;
    datapoint: PerformanceDatapoint;
}

const staticOperationsDictionary: { [operationId: string]: OperationData } = {};
const sendActionIntervalInMs = 5000;
const numberOfTries = 12;

export function startSaveToCloudProgressManager(
    attachmentId: ClientAttachmentId,
    itemId: ClientItemId,
    operationId: string,
    responseHandler: (payloads: SaveToCloudNotificationPayload[]) => void,
    timeoutHandler: () => void
) {
    const datapoint = new PerformanceDatapoint('SaveToCloudProgressManager');
    const recurringTimer: NodeJS.Timer = setInterval(() => {
        sendAction(
            operationId,
            attachmentId,
            itemId,
            responseHandler,
            timeoutHandler,
            numberOfTries,
            staticOperationsDictionary
        );
    }, sendActionIntervalInMs);

    staticOperationsDictionary[operationId] = {
        timer: recurringTimer,
        counter: 0,
        datapoint: datapoint,
    };
}

export function cancelSaveToCloudProgressManager(
    operationId: string,
    operationsDictionary: { [operationId: string]: OperationData } = null
) {
    if (!operationsDictionary) {
        operationsDictionary = staticOperationsDictionary;
    }

    const operation = operationsDictionary[operationId];

    if (!operation) {
        return;
    }

    clearInterval(operation.timer);

    const datapoint = operation.datapoint;
    datapoint.addCustomData({ operationId, counter: operation.counter });
    datapoint.end();

    delete operationsDictionary[operationId];
}

// Exported only for testing purposes! Should not be used outside this file!
export async function sendAction(
    operationId: string,
    attachmentId: ClientAttachmentId,
    itemId: ClientItemId,
    responseHandler: (payloads: SaveToCloudNotificationPayload[]) => void,
    timeoutHandler: () => void,
    maxNumberOfTries: number,
    operationsDictionary: { [operationId: string]: OperationData }
) {
    const operationData = operationsDictionary[operationId];
    if (!operationData) {
        return;
    }

    operationData.counter++;

    if (operationData.counter > maxNumberOfTries) {
        // After an arbitrary number of checks we will assume it failed. It is way more time than our 99 percentile time for this operation.
        cancelSaveToCloudProgressManager(operationId, operationsDictionary);

        operationData.datapoint.addCustomData({
            operationId,
            counter: operationData.counter,
        });
        operationData.datapoint.endWithError(DatapointStatus.Timeout);

        if (timeoutHandler) {
            timeoutHandler();
        }
        return;
    }

    (await lazyCheckPendingAttachmentOperation.import())(
        attachmentId,
        itemId,
        operationId,
        AttachmentOperationType.SaveToCloud,
        (response: CheckPendingAttachmentOperationResponse) => {
            if (responseHandler) {
                responseHandler(response.NotificationPayloads);
            }
        }
    );
}
