import type * as React from 'react';
import type { KeydownConfig } from 'owa-hotkeys';
import { getCommands } from 'owa-mail-hotkeys/lib/utils/MailModuleHotKeys';
import { isAnySxSDisplayedInMainWindow } from 'owa-sxs-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getSelectedPublicFolderId, isPublicFolderSelected } from 'owa-publicfolder-utils';
import checkAndCreateNewMessage from 'owa-mail-message-actions/lib/actions/checkAndCreateNewMessage';
import { getSelectedGroupId } from 'owa-group-utils';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import selectFolder from 'owa-mail-folder-forest-actions/lib/actions/selectFolder';
import { lazyCreateNewNote } from 'owa-notes-store';
import { shouldShowListView } from 'owa-mail-layout';
import type { SearchBoxContainerHandle } from 'owa-search';
import { getSelectedTableView, SelectionDirection } from 'owa-mail-list-store';
import { lazyOnNavigateAwayViaUpDown } from 'owa-mail-mark-read-actions';
import { selectRowInDirection } from 'owa-mail-actions/lib/mailListSelectionActions';
import MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import { lazySetupUndoHotKeys } from 'owa-mail-hotkeys';
import { lazyOnKeyboardUpDown } from 'owa-mail-actions';
import { focusNextRegion, focusPreviousRegion } from 'owa-accessibility-landmarks';

export async function setupMailModuleKeys(
    searchRef: React.RefObject<SearchBoxContainerHandle>
): Promise<KeydownConfig[]> {
    const commands = getCommands();
    const hotKeys = [
        ...(await lazySetupUndoHotKeys.importAndExecute()),
        { command: commands.openNextItem, handler: selectNextRowShortcut },
        { command: commands.openPrevItem, handler: selectPreviousRowShortcut },
        { command: commands.newMail, handler: newMessage },
    ];

    hotKeys.push(
        { command: commands.gotoInbox, handler: gotoInbox },
        { command: commands.gotoDrafts, handler: gotoDrafts },
        { command: commands.gotoSent, handler: gotoSentItems },
        { command: commands.gotoSearch, handler: getGotoSearch(searchRef) },
        {
            command: 'ctrl+f6',
            handler: focusNextRegion,
            options: {
                allowHotkeyOnTextFields: true,
                preventDefault: true,
                stopPropagation: true,
            },
        },
        {
            command: 'ctrl+shift+f6',
            handler: focusPreviousRegion,
            options: {
                allowHotkeyOnTextFields: true,
                preventDefault: true,
                stopPropagation: true,
            },
        }
    );

    return hotKeys;
}

function selectNextRowShortcut() {
    selectNextPreviousInternal(SelectionDirection.Next);
}

function selectPreviousRowShortcut() {
    selectNextPreviousInternal(SelectionDirection.Previous);
}

function selectNextPreviousInternal(selectionDirection: SelectionDirection) {
    const tableView = getSelectedTableView();
    const selectedRows = tableView.selectedRowKeys;

    // Select the next or previous item in immersive mode
    if (!shouldShowListView() && selectedRows.size > 0) {
        lazyOnNavigateAwayViaUpDown.importAndExecute([...selectedRows.keys()][0], tableView);
        selectRowInDirection(
            tableView,
            selectionDirection,
            MailListItemSelectionSource.CommandBarArrows
        );
    } else {
        lazyOnKeyboardUpDown.importAndExecute(
            selectionDirection,
            tableView,
            MailListItemSelectionSource.KeyboardUpDown,
            true /* shouldSelect */
        );
    }
}

// VSO Bug 18257: preventDefault needs to be false
// in order to let the keypress go to the password box of the PDF viewer in Chrome
function newMessage() {
    // do nothing if SxS is showing
    if (!isAnySxSDisplayedInMainWindow()) {
        if (isPublicFolderSelected()) {
            checkAndCreateNewMessage('Keyboard', getSelectedPublicFolderId());
        } else if (isStickyNotesFolder()) {
            lazyCreateNewNote.importAndExecute('NotesFolder');
        } else {
            checkAndCreateNewMessage('Keyboard', getSelectedGroupId());
        }
    }
}

function gotoInbox() {
    goToFolderKeyCommand('inbox');
}

function gotoDrafts() {
    goToFolderKeyCommand('drafts');
}

function gotoSentItems() {
    goToFolderKeyCommand('sentitems');
}

function goToFolderKeyCommand(folderName: string) {
    selectFolder(folderNameToId(folderName), 'primaryFolderTree', 'Keyboard' /* actionSource */);
}

const getGotoSearch = (searchRef: React.RefObject<SearchBoxContainerHandle>) =>
    function gotoSearch() {
        searchRef.current?.setFocus();
    };

function isStickyNotesFolder(): boolean {
    const selectedTable = getSelectedTableView();
    return (
        selectedTable &&
        isFeatureEnabled('notes-folder-view') &&
        selectedTable.tableQuery.folderId === folderNameToId('notes')
    );
}
