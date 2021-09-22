import { assertNever } from 'owa-assert';
import ActionType from 'owa-attachment-full-data/lib/schema/ActionType';
import {
    AttachmentFullViewState,
    AttachmentWellViewState,
    InlineAttachmentStatus,
} from 'owa-attachment-well-data';
import loc from 'owa-localize';
import {
    attachmentRemovalInProgress,
    attachmentConversionInProgress,
    attachmentSaveInProgress,
    attachmentRefreshInProgress,
    attachmentCreationInProgress,
    inlineImageInProgress,
    attachmentInProgressGeneric,
    attachmentPermissionChangeInProgress,
} from './getPendingAttachmentString.locstring.json';

enum PendingAction {
    attaching,
    attachingInline,
    deleting,
    converting,
    saving,
    permissionChange,
    refreshing,
}

export function getPendingAttachmentString(
    attachmentWellViewState: AttachmentWellViewState,
    hasWaitingAttachment: boolean
): string | null {
    // This is for upgrade compose, where attachments are not yet loaded.
    // No other actions should be in progress, since the initial load is still happening.
    if (hasWaitingAttachment) {
        return loc(attachmentCreationInProgress);
    }

    const attachments: AttachmentFullViewState[] = attachmentWellViewState.docViewAttachments.concat(
        attachmentWellViewState.imageViewAttachments
    );
    const pendingActions = attachments.map(attachment =>
        getPendingAction(attachment.ongoingAction)
    );

    // Filter out null, and duplicate values
    function getUniqueValues(value, index, self) {
        return value !== null && self.indexOf(value) === index;
    }
    const filteredPendingActions = pendingActions.filter(getUniqueValues);

    if (hasPendingInlineAttachment(attachmentWellViewState)) {
        filteredPendingActions.push(PendingAction.attachingInline);
    }

    if (filteredPendingActions.length === 0) {
        return null;
    }

    if (filteredPendingActions.length > 1) {
        return loc(attachmentInProgressGeneric);
    }

    return getActionString(filteredPendingActions[0]);
}

function hasPendingInlineAttachment(attachmentWellViewState: AttachmentWellViewState): boolean {
    return attachmentWellViewState.inlineAttachments.some(
        attachment => attachment.status === InlineAttachmentStatus.Initialized
    );
}

function getActionString(pendingAction: PendingAction): string {
    switch (pendingAction) {
        case PendingAction.attaching:
            return loc(attachmentCreationInProgress);
        case PendingAction.attachingInline:
            return loc(inlineImageInProgress);
        case PendingAction.deleting:
            return loc(attachmentRemovalInProgress);
        case PendingAction.converting:
            return loc(attachmentConversionInProgress);
        case PendingAction.saving:
            return loc(attachmentSaveInProgress);
        case PendingAction.permissionChange:
            return loc(attachmentPermissionChangeInProgress);
        case PendingAction.refreshing:
            return loc(attachmentRefreshInProgress);
        default:
            return assertNever(pendingAction);
    }
}

function getPendingAction(action: ActionType): PendingAction | null {
    switch (action) {
        case ActionType.Attach:
            return PendingAction.attaching;
        case ActionType.Delete:
            return PendingAction.deleting;
        case ActionType.ChangePermission:
            return PendingAction.permissionChange;
        case ActionType.SaveToCloud:
            return PendingAction.saving;
        case ActionType.ConvertClassicToCloudy:
        case ActionType.ConvertCloudyToClassic:
            return PendingAction.converting;
        case ActionType.Refresh:
            return PendingAction.refreshing;
        // Add to calendar still works after send.
        case ActionType.AddToCalendar:
        case ActionType.None:
            return null;
        default:
            return assertNever(action);
    }
}
