import { getCancellationId } from '../orchestrators/convertCloudyToClassic';
import setOngoingActionAndActionMessage from '../actions/setOngoingActionAndActionMessage';
import datapoints from '../datapoints';
import ActionMessageId from '../schema/ActionMessageId';
import ActionType from '../schema/ActionType';
import type AttachmentFullViewState from '../schema/AttachmentFullViewState';
import cancelConvertCloudyToClassicAttachment from '../services/cancelConvertCloudyToClassicAttachment';
import { orchestrator, action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';

const cancelConvertCloudyToClassic = action(
    'cancel_ConvertCloudyToClassic',
    (attachmentViewState: AttachmentFullViewState) =>
        addDatapointConfig(datapoints.CancelConvertCloudyToClassic, {
            attachmentViewState: attachmentViewState,
        })
);

export default cancelConvertCloudyToClassic;

orchestrator(cancelConvertCloudyToClassic, actionMessage => {
    const cancellationId: string = getCancellationId(
        actionMessage.attachmentViewState.attachmentId.Id
    );
    if (cancellationId) {
        setOngoingActionAndActionMessage(
            actionMessage.attachmentViewState,
            ActionType.ConvertCloudyToClassic,
            ActionMessageId.Canceling
        );
        cancelConvertCloudyToClassicAttachment(cancellationId);
    } else {
        throw new Error('Failed to find the cancellationId of ConvertCloudyToClassic');
    }
});
