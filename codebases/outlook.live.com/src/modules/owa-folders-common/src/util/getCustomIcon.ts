import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { ControlIcons } from 'owa-control-icons';
import MailInboxRegular from 'owa-fluent-icons-svg/lib/icons/MailInboxRegular';
import DraftsRegular from 'owa-fluent-icons-svg/lib/icons/DraftsRegular';
import FolderRegular from 'owa-fluent-icons-svg/lib/icons/FolderRegular';
import SendRegular from 'owa-fluent-icons-svg/lib/icons/SendRegular';
import DeleteRegular from 'owa-fluent-icons-svg/lib/icons/DeleteRegular';
import ArchiveRegular from 'owa-fluent-icons-svg/lib/icons/ArchiveRegular';
import FolderProhibitedRegular from 'owa-fluent-icons-svg/lib/icons/FolderProhibitedRegular';
import NoteRegular from 'owa-fluent-icons-svg/lib/icons/NoteRegular';
import ClockRegular from 'owa-fluent-icons-svg/lib/icons/ClockRegular';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getIsViewModeSelected } from 'owa-command-ribbon-store/lib/selectors/getIsViewModeSelected';
import { CommandingViewMode } from 'owa-outlook-service-option-store/lib/store/schema/options/CommandingOptions';

/**
 * Get custom icon for special folders like inbox, drafts, sent, deleted, etc.
 * @param showNonSpecialFolderIcon Whether to show generic folder icon
 */
function getCustomIcon(folderId: string, showNonSpecialFolderIcon: boolean): string {
    const useFluentIcons =
        isFeatureEnabled('mon-densities') ||
        (isFeatureEnabled('mon-ribbon') &&
            getIsViewModeSelected(CommandingViewMode.CommandBar) == false);

    switch (folderId) {
        case folderNameToId('inbox'):
            return useFluentIcons ? MailInboxRegular : ControlIcons.Inbox;

        case folderNameToId('sentitems'):
            return useFluentIcons ? SendRegular : ControlIcons.Send;

        case folderNameToId('drafts'):
            return useFluentIcons ? DraftsRegular : ControlIcons.Edit;

        case folderNameToId('deleteditems'):
            return useFluentIcons ? DeleteRegular : ControlIcons.Delete;

        case folderNameToId('archive'):
            return useFluentIcons ? ArchiveRegular : ControlIcons.Archive;

        case folderNameToId('junkemail'):
            return useFluentIcons ? FolderProhibitedRegular : ControlIcons.Blocked;

        case folderNameToId('scheduled'):
            return useFluentIcons ? ClockRegular : ControlIcons.Clock;

        case folderNameToId('notes'):
            return useFluentIcons ? NoteRegular : ControlIcons.QuickNote;

        default:
            break;
    }

    if (showNonSpecialFolderIcon) {
        return useFluentIcons ? FolderRegular : ControlIcons.FabricFolder;
    } else {
        return null;
    }
}

export default getCustomIcon;
