import AttachmentMenuAction from '../schema/AttachmentMenuAction';
import { assertNever } from 'owa-assert';
import { AttachmentOpenAction } from 'owa-attachment-data';

export default function convertOpenActionToMenuOption(
    openAction: AttachmentOpenAction
): AttachmentMenuAction | null {
    switch (openAction) {
        case AttachmentOpenAction.Download:
            return AttachmentMenuAction.Download;
        case AttachmentOpenAction.OpenInNewTab:
            return AttachmentMenuAction.OpenInNewTab;
        case AttachmentOpenAction.Preview:
            return AttachmentMenuAction.Preview;
        case AttachmentOpenAction.NoAction:
            return null;
        default:
            return assertNever(openAction);
    }
}
