import AttachmentMenuAction from '../schema/AttachmentMenuAction';
import { assertNever } from 'owa-assert';
import { AttachmentOpenAction } from 'owa-attachment-data';

export default function convertMenuOptionToOpenAction(
    menuAction: AttachmentMenuAction
): AttachmentOpenAction | null {
    switch (menuAction) {
        case AttachmentMenuAction.Download:
            return AttachmentOpenAction.Download;
        case AttachmentMenuAction.OpenInNewTab:
            return AttachmentOpenAction.OpenInNewTab;
        case AttachmentMenuAction.Preview:
            return AttachmentOpenAction.Preview;
        case AttachmentMenuAction.ImportCalendarEventAttachment:
        case AttachmentMenuAction.ChangePermissions:
        case AttachmentMenuAction.CopyLink:
        case AttachmentMenuAction.SaveToCloud:
        case AttachmentMenuAction.ViewInProvider:
        case AttachmentMenuAction.ConvertClassicToCloudy:
        case AttachmentMenuAction.ConvertCloudyToClassic:
        case AttachmentMenuAction.MoveAttachmentToInline:
        case AttachmentMenuAction.RefreshLink:
        case AttachmentMenuAction.IgnoreExpiration:
            return null;
        default:
            return assertNever(menuAction);
    }
}
