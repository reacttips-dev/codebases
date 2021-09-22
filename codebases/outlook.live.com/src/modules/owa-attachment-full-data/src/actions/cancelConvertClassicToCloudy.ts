import { getCancellationId } from './convertClassicToCloudy';
import setOngoingActionAndActionMessage from './setOngoingActionAndActionMessage';
import ActionMessageId from '../schema/ActionMessageId';
import ActionType from '../schema/ActionType';
import type AttachmentFullViewState from '../schema/AttachmentFullViewState';
import cancelConvertClassicToCloudyAttachment from '../services/cancelConvertClassicToCloudyAttachment';
import { wrapFunctionForDatapoint } from 'owa-analytics';

export default wrapFunctionForDatapoint(
    {
        name: 'CancelConvertClassicToCloudy',
    },
    function cancelConvertClassicToCloudy(attachmentViewState: AttachmentFullViewState) {
        const cancellationId: string = getCancellationId(attachmentViewState.attachmentId.Id);
        if (cancellationId) {
            setOngoingActionAndActionMessage(
                attachmentViewState,
                ActionType.ConvertClassicToCloudy,
                ActionMessageId.Canceling
            );
            cancelConvertClassicToCloudyAttachment(cancellationId);
        } else {
            throw new Error('Failed to find the cancellationId of ConvertClassicToCloudy');
        }
    }
);
