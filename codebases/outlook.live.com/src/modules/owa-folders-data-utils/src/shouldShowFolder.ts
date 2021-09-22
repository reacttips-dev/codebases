import { getUserConfiguration } from 'owa-session-store';
import { isFeatureEnabled } from 'owa-feature-flags';

// Any changes you make here, make sure to add them to similar logic in getFolderStorageInformation
/**
 * Determines if folder can be shown to the user depending on the userconfig settings
 * @param distinguishedFolderIdName folder name
 */
export function shouldShowFolder(distinguishedFolderIdName: string): boolean {
    const segmentationSettings = getUserConfiguration().SegmentationSettings;
    const isShadowMailbox = getUserConfiguration().SessionSettings?.IsShadowMailbox;

    if (distinguishedFolderIdName === 'junkemail') {
        // Skip adding Junk Email folder if it's disabled by admin
        return !!segmentationSettings?.JunkEMail;
    }

    // Skip adding Notes folder if it's disabled by admin or if running against
    // Cloud Cache mailbox.  In CC we don't sync data from Google Keep, so users
    // shouldn't be able to create notes.
    if (distinguishedFolderIdName === 'notes') {
        return (
            !!segmentationSettings?.StickyNotes &&
            isFeatureEnabled('cal-stickyNotesFolder') &&
            !isShadowMailbox
        );
    }

    return true;
}
