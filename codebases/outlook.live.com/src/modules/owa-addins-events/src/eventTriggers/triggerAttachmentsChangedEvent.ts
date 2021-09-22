import { assertNever } from 'owa-assert';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import { getAdapter } from 'owa-addins-adapters';
import { getComposeHostItemIndex } from 'owa-addins-store';
import { OutlookEventDispId } from '../schema/OutlookEventDispId';
import triggerAllApiEvents from '../triggerAllApiEvents';
import { AttachmentStatusEnum, AttachmentDetails } from 'owa-addins-apis-types';

export function triggerAttachmentsChangedEvent(
    itemId: string,
    attachmentStatus: AttachmentStatusEnum,
    attachmentDetails: AttachmentDetails
) {
    const hostItemIndex = getComposeHostItemIndex(itemId);
    const adapter = getAdapter(hostItemIndex);

    if (
        adapter == null ||
        (adapter.mode !== ExtensibilityModeEnum.AppointmentOrganizer &&
            adapter.mode !== ExtensibilityModeEnum.MessageCompose)
    ) {
        // Do nothing.
        return;
    }

    let attachmentStatusResult: string = null;

    switch (attachmentStatus) {
        case AttachmentStatusEnum.Added:
            attachmentStatusResult = 'added';
            break;
        case AttachmentStatusEnum.Deleted:
            attachmentStatusResult = 'removed';
            break;
        default:
            assertNever(attachmentStatus);
    }

    let result = {
        attachmentStatus: attachmentStatusResult,
        attachmentDetails: attachmentDetails,
    };

    triggerAllApiEvents(hostItemIndex, OutlookEventDispId.ATTACHMENTS_CHANGED_EVENT_DISPID, () => {
        return result;
    });
}
