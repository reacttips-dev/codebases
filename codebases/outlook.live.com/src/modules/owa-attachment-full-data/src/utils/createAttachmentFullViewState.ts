import ActionMessageId from '../schema/ActionMessageId';
import ActionType from '../schema/ActionType';
import type AttachmentFullViewState from '../schema/AttachmentFullViewState';
import AttachmentStateType from '../schema/AttachmentStateType';
import { createAttachmentViewState } from 'owa-attachment-data';
import { AttachmentFileType } from 'owa-attachment-file-types';
import type { ClientAttachmentId, ClientItemId } from 'owa-client-ids';

export default function createAttachmentFullViewState(
    attachmentId: ClientAttachmentId,
    isReadOnly: boolean,
    attachCompleted: boolean,
    isCloudy: boolean,
    fileType: AttachmentFileType = AttachmentFileType.Unknown,
    isPlaceholderAttachment: boolean = false,
    parentItemId: ClientItemId = null
): AttachmentFullViewState {
    const attachmentViewState = createAttachmentViewState(
        attachmentId,
        isReadOnly,
        isCloudy,
        isPlaceholderAttachment,
        fileType,
        parentItemId
    );
    const strategy = attachmentViewState.strategy;

    return {
        ...attachmentViewState,
        attachmentType: AttachmentStateType.Attachment,
        strategy: {
            ...strategy,
            isSaveToCloudSupported: false,
            isViewingInProviderSupported: false,
            isOpeningInProviderSupported: false,
            isOpeningByLinkSupported: false,
            isConvertClassicToCloudySupported: false,
            isConvertCloudyToClassicSupported: false,
            isMoveAttachmentToInlineSupported: false,
            showActionsMenu: false,
            supportedMenuActions: [],
        },
        shouldShowContextMenu: false,
        shouldShowImageOverlay: false,
        shouldShowActionsContainer: false,
        ongoingAction: attachCompleted ? ActionType.None : ActionType.Attach,
        completedActions: [],
        actionMessage: ActionMessageId.None,
        actionCompletePercent: attachCompleted ? 1.1 : 0.01, // Ater setting 1.1, the progress bar would be hidden.
    };
}
