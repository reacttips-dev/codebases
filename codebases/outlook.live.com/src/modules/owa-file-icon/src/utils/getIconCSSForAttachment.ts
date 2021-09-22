import getIconForFile, { FileIcon, getFileIconFromSprite } from './getIconForFile';
import getCDNIconUrl from './getCDNIconUrl';

let blockedFileIcon: FileIcon;
function getBlockedFileIcon(): FileIcon {
    blockedFileIcon = blockedFileIcon || {
        extraSmall: getFileIconFromSprite('generic').extraSmall,
        small: getFileIconFromSprite('generic').small,
        medium: getFileIconFromSprite('blockedfile').medium,
        large: getFileIconFromSprite('generic').large,
        cdn: getCDNIconUrl('generic_16x16'),
    };

    return blockedFileIcon;
}

/**
 * Get icon CSS for attachment
 */
export function getIconCSSForAttachment(
    fileName: string,
    contentType: string,
    isBlocked: boolean,
    isFolder: boolean,
    embeddedItemClass: string
): FileIcon {
    if (isBlocked) {
        return getBlockedFileIcon();
    }

    switch (embeddedItemClass) {
        case 'IPM.Note': // Email
        case 'IPM.Note.SMIME': // Smime Item Attachment
        case 'IPM.Note.SMIME.MultipartSigned': // Smime Clear Signed Item Attachment
        case 'IPM.Schedule.Meeting.Request': // Email with calendar invite
        case 'IPM.Schedule.Meeting.Canceled': // Email with calendar invite canceled
            return getFileIconFromSprite('email');
        case 'IPM.Schedule': // Calendar Item
        case 'IPM.Appointment': // Calendar Item
        case 'IPM.OLE.CLASS.{00061055-0000-0000-C000-000000000046}': // Meeting recurrence exception
            return getFileIconFromSprite('calendar');
        default:
            break;
    }

    // isFolder is undefined for reference attachments
    // folders are treated differently for attachments compared to the rest of the product, so they
    // are handled here instead of in getIconForFile.
    if (!!isFolder) {
        return getFileIconFromSprite('sharedfolder');
    }

    const fileIcon = getIconForFile(fileName, false /*isFolder */, contentType);

    // Show generic file icons if we could not map the file to any type
    return fileIcon || getFileIconFromSprite('generic');
}
