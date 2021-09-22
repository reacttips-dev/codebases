import { selectAllMessagesCommand } from 'owa-locstrings/lib/strings/selectallmessagescommand.locstring.json';
import {
    writeEmailHeaderText,
    emailListHeaderText,
    readEmailHeaderText,
    goToHeaderText,
    emailActionsHeaderText,
    goToQuickSwitcher as goToQuickSwitcher_1,
    newEmailCommand,
    sendEmailCommand,
    replyEmailCommand,
    replyAllEmailCommand,
    forwardEmailCommand,
    saveDraftCommand,
    discardDraftCommand,
    goToInboxCommand,
    goToDraftsCommand,
    goToSentCommand,
    searchEmailCommand,
    undoCommand,
    clearAllMessagesCommand,
    homeCommand,
    deleteEmailCommand,
    openEmailCommand,
    openEmailInNewWindowCommand,
    closeEmailCommand,
    openNextItemCommand,
    openPreviousItemCommand,
    focusNextItemPartCommand,
    focusPreviousItemPartCommand,
    expandCollapseConversationCommand,
    expandConversationCommand,
    collapseConversationCommand,
    softDeleteCommand,
    newFolderCommand,
    markReadCommand,
    markUnreadCommand,
    flagEmailCommand,
    archiveCommand,
    markJunkCommand,
    categorize as categorize_1,
    insertHyperlinkCommand,
    showKeyboardShortcutsCommand,
    endCommand,
    toggleSelectMessageCommand,
} from './MailModuleHotKeys.locstring.json';
import { moveToFolder as moveToFolder_1 } from 'owa-locstrings/lib/strings/movetofolder.locstring.json';
import { ignore } from 'owa-locstrings/lib/strings/ignore.locstring.json';
import { snooze } from 'owa-locstrings/lib/strings/snooze.locstring.json';
import loc from 'owa-localize';
import type { CommandCategory } from 'owa-hotkeys-map';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isMac } from 'owa-user-agent/lib/userAgent';
import { getAppModuleCommands } from 'owa-appmodule-hotkeys';

const writeEmailCategoryKey = 'writeEmail';
const emailListCategoryKey = 'emailList';
const readEmailCategoryKey = 'readEmail';
const goToCategoryKey = 'goTo';
const emailActionsCategoryKey = 'emailActions';

export function getCommandCategories(): CommandCategory[] {
    return [
        {
            category: writeEmailCategoryKey,
            displayName: loc(writeEmailHeaderText),
        },
        {
            category: emailListCategoryKey,
            displayName: loc(emailListHeaderText),
        },
        {
            category: readEmailCategoryKey,
            displayName: loc(readEmailHeaderText),
        },
        {
            category: goToCategoryKey,
            displayName: loc(goToHeaderText),
        },
        {
            category: emailActionsCategoryKey,
            displayName: loc(emailActionsHeaderText),
        },
    ];
}

type HotkeyBinding = {
    category: string;
    description: string;
    hotmail: string | string[];
    yahoo: string | string[];
    gmail: string | string[];
    owa: string | string[];
};

export function getCommands() {
    const optionalCommands: {
        goToQuickSwitcher?: HotkeyBinding;
    } = {};

    if (isFeatureEnabled('cmp-quickSwitcher')) {
        optionalCommands.goToQuickSwitcher = {
            category: goToCategoryKey,
            description: loc(goToQuickSwitcher_1),
            hotmail: 'ctrl+shift+k',
            yahoo: 'ctrl+shift+k',
            gmail: 'ctrl+shift+k',
            owa: 'ctrl+shift+k',
        };
    }

    return {
        ...getAppModuleCommands(),
        newMail: {
            category: writeEmailCategoryKey,
            description: loc(newEmailCommand),
            hotmail: ['n'],
            yahoo: 'n',
            gmail: 'c',
            owa: ['n'],
        },
        sendMail: {
            category: writeEmailCategoryKey,
            description: loc(sendEmailCommand),
            hotmail: isMac() ? ['ctrl+enter'] : ['ctrl+enter', 'alt+s'],
            yahoo: 'alt+s',
            gmail: 'ctrl+enter',
            owa: isMac() ? ['ctrl+enter'] : ['ctrl+enter', 'alt+s'],
        },
        reply: {
            category: writeEmailCategoryKey,
            description: loc(replyEmailCommand),
            hotmail: 'r',
            yahoo: 'r',
            gmail: 'r',
            owa: ['r', 'ctrl+r'],
        },
        replyAll: {
            category: writeEmailCategoryKey,
            description: loc(replyAllEmailCommand),
            hotmail: ['a', 'shift+r'],
            yahoo: 'a',
            gmail: 'a',
            owa: ['shift+r', 'ctrl+shift+r'],
        },
        forward: {
            category: writeEmailCategoryKey,
            description: loc(forwardEmailCommand),
            hotmail: 'shift+f',
            yahoo: 'f',
            gmail: 'f',
            owa: ['shift+f', 'ctrl+shift+f'],
        },
        saveDraft: {
            category: writeEmailCategoryKey,
            description: loc(saveDraftCommand),
            hotmail: 'ctrl+s',
            yahoo: 'ctrl+s',
            gmail: 'ctrl+s',
            owa: 'ctrl+s',
        },
        discardDraft: {
            category: writeEmailCategoryKey,
            description: loc(discardDraftCommand),
            hotmail: 'esc',
            owa: 'esc',
        },
        gotoInbox: {
            category: goToCategoryKey,
            description: loc(goToInboxCommand),
            hotmail: 'g i', // 'g' then 'i'
            yahoo: 'm',
            gmail: 'g i',
            owa: 'g i',
        },
        gotoDrafts: {
            category: goToCategoryKey,
            description: loc(goToDraftsCommand),
            hotmail: 'g d', // 'g' then 'd'
            gmail: 'g d',
            owa: 'g d',
        },
        gotoSent: {
            category: goToCategoryKey,
            description: loc(goToSentCommand),
            hotmail: 'g s', // 'g' then 's'
            gmail: 'g t',
            owa: 'g s',
        },
        gotoSearch: {
            category: goToCategoryKey,
            description: loc(searchEmailCommand),
            hotmail: '/',
            yahoo: 's',
            gmail: '/',
            owa: 'alt+q',
        },
        undoAction: {
            category: emailActionsCategoryKey,
            description: loc(undoCommand),
            hotmail: 'ctrl+z',
            yahoo: 'ctrl+z',
            gmail: 'ctrl+z',
            owa: 'ctrl+z',
        },
        selectUnselectMessage: {
            category: emailListCategoryKey,
            description: loc(toggleSelectMessageCommand),
            hotmail: 'ctrl+space',
            yahoo: 'ctrl+space',
            gmail: ['x', 'ctrl+x'],
            owa: 'ctrl+space',
        },
        selectAll: {
            category: emailListCategoryKey,
            description: loc(selectAllMessagesCommand),
            hotmail: 'ctrl+a',
            yahoo: 'ctrl+a',
            gmail: 'ctrl+a',
            owa: 'ctrl+a',
        },
        deselectAll: {
            category: emailListCategoryKey,
            description: loc(clearAllMessagesCommand),
            hotmail: 'esc',
            yahoo: 'esc',
            gmail: 'esc',
            owa: 'esc',
        },
        home: {
            category: emailListCategoryKey,
            description: loc(homeCommand),
            hotmail: ['home', 'ctrl+home'],
            yahoo: ['home', 'ctrl+home'],
            gmail: ['home', 'ctrl+home'],
            owa: ['home', 'ctrl+home'],
        },
        end: {
            category: emailListCategoryKey,
            description: loc(endCommand),
            hotmail: ['end', 'ctrl+end'],
            yahoo: ['end', 'ctrl+end'],
            gmail: ['end', 'ctrl+end'],
            owa: ['end', 'ctrl+end'],
        },
        deleteMail: {
            category: emailActionsCategoryKey,
            description: loc(deleteEmailCommand),
            hotmail: 'del',
            yahoo: 'del',
            gmail: '#',
            owa: 'del',
        },
        openMail: {
            category: readEmailCategoryKey,
            description: loc(openEmailCommand),
            hotmail: ['o', 'enter'],
            gmail: ['o', 'enter'],
            owa: ['o', 'enter'],
        },
        openMailInPopout: {
            category: readEmailCategoryKey,
            description: loc(openEmailInNewWindowCommand),
            hotmail: 'shift+enter',
            gmail: 'shift+enter',
            owa: 'shift+enter',
            yahoo: 'shift+enter',
        },
        closeMail: {
            category: readEmailCategoryKey,
            description: loc(closeEmailCommand),
            hotmail: 'esc',
            yahoo: 'esc',
            gmail: 'u',
            owa: 'esc',
        },
        openNextItem: {
            category: readEmailCategoryKey,
            description: loc(openNextItemCommand),
            hotmail: 'ctrl+.',
            yahoo: 'ctrl+.',
            gmail: 'j',
            owa: 'ctrl+.',
        },
        openPrevItem: {
            category: readEmailCategoryKey,
            description: loc(openPreviousItemCommand),
            hotmail: 'ctrl+,',
            yahoo: 'ctrl+,',
            gmail: 'k',
            owa: 'ctrl+,',
        },
        focusNextItemPart: {
            category: readEmailCategoryKey,
            description: loc(focusNextItemPartCommand),
            hotmail: '.',
            gmail: 'n',
            owa: '.',
        },
        focusPrevItemPart: {
            category: readEmailCategoryKey,
            description: loc(focusPreviousItemPartCommand),
            hotmail: ',',
            gmail: 'p',
            owa: ',',
        },
        expandCollapseAll: {
            category: readEmailCategoryKey,
            description: loc(expandCollapseConversationCommand),
            hotmail: 'x',
            owa: 'x',
        },
        expandAll: {
            category: readEmailCategoryKey,
            description: loc(expandConversationCommand),
            gmail: ';',
        },
        collapseAll: {
            category: readEmailCategoryKey,
            description: loc(collapseConversationCommand),
            gmail: ':',
        },
        softDeleteMail: {
            category: emailActionsCategoryKey,
            description: loc(softDeleteCommand),
            hotmail: 'shift+del',
            yahoo: 'shift+del',
            gmail: 'shift+del',
            owa: 'shift+del',
        },
        newFolder: {
            category: emailActionsCategoryKey,
            description: loc(newFolderCommand),
            hotmail: 'shift+e',
            yahoo: 'ctrl+shift+e',
            owa: 'shift+e',
        },
        markAsRead: {
            category: emailActionsCategoryKey,
            description: loc(markReadCommand),
            hotmail: 'q',
            yahoo: 'k',
            gmail: 'shift+i',
            // On mac, ctrl+q is translated into cmd+q,
            // and that closes the window at the OS level.
            //
            // Only bind the "desktop-flavor" shortcut ctrl+q on windows.
            owa: isMac() ? 'q' : ['q', 'ctrl+q'],
        },
        markAsUnread: {
            category: emailActionsCategoryKey,
            description: loc(markUnreadCommand),
            hotmail: 'u',
            yahoo: 'shift+k',
            gmail: 'shift+u',
            owa: ['u', 'ctrl+u'],
        },
        toggleFlag: {
            category: emailActionsCategoryKey,
            description: loc(flagEmailCommand),
            hotmail: 'ins',
            yahoo: 'l',
            gmail: 's',
            owa: 'ins',
        },
        archiveMail: {
            category: emailActionsCategoryKey,
            description: loc(archiveCommand),
            hotmail: 'e',
            gmail: 'e',
            owa: 'e',
        },
        markAsJunk: {
            category: emailActionsCategoryKey,
            description: loc(markJunkCommand),
            hotmail: 'j',
            gmail: 'shift+1',
            owa: 'j',
        },
        moveToFolder: {
            category: emailActionsCategoryKey,
            description: loc(moveToFolder_1),
            hotmail: 'v',
            gmail: 'v',
            owa: 'v',
        },
        categorize: {
            category: emailActionsCategoryKey,
            description: loc(categorize_1),
            hotmail: 'c',
            gmail: 'l',
            owa: 'c',
        },
        ignore: {
            category: emailActionsCategoryKey,
            description: loc(ignore),
            hotmail: 'ctrl+del',
            owa: 'ctrl+del',
        },
        snooze: {
            category: emailActionsCategoryKey,
            description: loc(snooze),
            hotmail: 'b',
            gmail: 'b',
            owa: 'b',
        },
        // This hotkey is display only.
        // The actual keyboard shortcut handling logic is in RibbonPlugin, and does not
        // use a @keyboardShortcut decorator
        insertHyperlink: {
            category: writeEmailCategoryKey,
            description: loc(insertHyperlinkCommand),
            hotmail: 'ctrl+k',
            gmail: 'ctrl+k',
            owa: 'ctrl+k',
        },
        keyboardShortcuts: {
            category: goToCategoryKey,
            description: loc(showKeyboardShortcutsCommand),
            hotmail: '?',
            gmail: '?',
            owa: '?',
            yahoo: '?',
        },
        ...optionalCommands,
    };
}
