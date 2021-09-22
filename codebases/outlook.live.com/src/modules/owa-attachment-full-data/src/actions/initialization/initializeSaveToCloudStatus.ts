import { isStringNullOrWhiteSpace } from 'owa-localize';
import ActionMessageId from '../../schema/ActionMessageId';
import ActionType from '../../schema/ActionType';
import type AttachmentFullViewState from '../../schema/AttachmentFullViewState';
import addCompletedAction from '../addCompletedAction';
import setOngoingActionAndActionMessage from '../setOngoingActionAndActionMessage';
import type { AttachmentModel } from 'owa-attachment-model-store';

export default function initializeSaveToCloudStatus(
    viewState: AttachmentFullViewState,
    attachment: AttachmentModel,
    isSaveToCloudSupported: boolean
) {
    if (
        isSaveToCloudSupported &&
        !isStringNullOrWhiteSpace(attachment.model.AttachmentOriginalUrl)
    ) {
        addCompletedAction(viewState, ActionType.SaveToCloud);
        setOngoingActionAndActionMessage(
            viewState,
            ActionType.None,
            ActionMessageId.SaveToCloudCompleted
        );
    }
}
