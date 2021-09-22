import { shouldShowMenuItem } from '../components/Behaviors';
import { customRestriction } from '../components/behaviors/customRestriction';
import { focusedViewFilterRestriction } from '../components/behaviors/focusedViewFilterRestriction';
import { folderRestriction } from '../components/behaviors/folderRestriction';
import { itemPartSelectionRestrictionType } from '../components/behaviors/itemPartSelectionRestrictionType';
import { listRestrictionType } from '../components/behaviors/listRestrictionType';
import { listViewTypeRestrictionType } from '../components/behaviors/listViewTypeRestrictionType';
import { default as mailboxRestriction } from '../components/behaviors/mailboxRestriction';
import { mailScenarioRestriction } from '../components/behaviors/mailScenarioRestriction';
import { readingPaneRestrictionType } from '../components/behaviors/readingPaneRestrictionType';
import { searchScopeRestriction } from '../components/behaviors/searchScopeRestriction';
import { default as selectionRestriction } from '../components/behaviors/selectionRestriction';
import { sortByRestriction } from '../components/behaviors/sortByRestriction';
import { staticFolderSearchScopeRestriction } from '../components/behaviors/staticFolderSearchScopeRestriction';
import { tableQueryTypeRestriction } from '../components/behaviors/tableQueryTypeRestriction';
import { MenuItemType } from '../components/MenuItemType';
import isJunkEmailEnabledByAdmin from '../selectors/isJunkEmailEnabledByAdmin';
import shouldShowCommandBarHamburgerButton from '../utils/shouldShowCommandBarHamburgerButton';
import isTranslatorEnabled from 'owa-addins-outlook-translate/lib/isTranslatorEnabled';
import { isFeatureEnabled } from 'owa-feature-flags';
import type { ShouldShowBehavior } from 'owa-filterable-menu';
import folderStore, { isFolderInMailboxType, SourceWellKnownFolderType } from 'owa-folders';
import type { Permission } from 'owa-graph-schema';
import getFolderData from 'owa-mail-actions/lib/getFolderData';
import isInboxRuleEnabledByAdmin from 'owa-mail-inbox-rules/lib/selectors/isInboxRuleEnabledByAdmin';
import { isFirstLevelExpanded } from 'owa-mail-list-store/lib/selectors/isConversationExpanded';
import getTableConversationRelation from 'owa-mail-list-store/lib/utils/getTableConversationRelation';
import checkItemReplyForwardDisabled from 'owa-mail-reading-pane-item-actions/lib/utils/checkItemReplyForwardDisabled';
import getFolderIdFromTableView from 'owa-mail-search/lib/utils/getFolderIdFromTableView';
import getItemForMailList from 'owa-mail-store/lib/selectors/getItemForMailList';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import * as undoActions from 'owa-mail-undo';
import { lazyIsMeetNowEnabled } from 'owa-meet-now';
import {
    getStore as getNotesStore,
    lazyHasEmailId as selectedNoteHasEmailId,
} from 'owa-notes-store';
import { SearchScopeKind } from 'owa-search-service/lib/data/schema/SearchScope';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import { getUserConfiguration } from 'owa-session-store';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { isTimePanelWithToDoFeaturesAvailable } from 'owa-time-panel-bootstrap';
import {
    isGroupTableQuery,
    lazyGetRetentionPolicyTagListForGroupTableQuery,
} from 'owa-group-utils';
import {
    getUserPermissionForFolderId as mailStoreGetUserPermissionForFolderId,
    getUserPermissionForFolderIdWithErr as mailStoreGetUserPermissionForFolderIdWithErr,
} from 'owa-mail-store';
import {
    getSelectedTableView,
    isItemPartOperation,
    getSelectedItemParts,
    TableQueryType,
    MailRowDataPropertyGetter,
    MailSortHelper,
    MailFolderTableQuery,
    isFolderPaused,
} from 'owa-mail-list-store';
import {
    shouldShowListView,
    shouldShowFolderPane,
    shouldShowFolderPaneAsOverlay,
} from 'owa-mail-layout';
import {
    SelectionRestrictionType,
    ListRestrictionType,
    ReadingPaneRestrictionType,
    MailboxType,
    ListViewTypeRestrictionType,
    ItemPartSelectionRestrictionType,
} from '../components/Behaviors.types';
import {
    PRIMARY_DELETED_ITEMS_DISTINGUISHED_ID,
    ARCHIVE_DELETED_ITEMS_DISTINGUISHED_ID,
    PRIMARY_DUMPSTER_DISTINGUISHED_ID,
    ARCHIVE_DUMPSTER_DISTINGUISHED_ID,
} from 'owa-folders-constants';
import { getIsViewModeSelected } from 'owa-command-ribbon-store';
import { CommandingViewMode } from 'owa-outlook-service-option-store/lib/store/schema/options/CommandingOptions';
import { isBrowserIE } from 'owa-user-agent/lib/userAgent';
import shouldAllowDelete from '../utils/shouldAllowDelete';
import { isBulkActionRunning } from 'owa-bulk-action-store';
import getMailMenuItemShouldDisable from './getMailMenuItemShouldDisable';
import type Message from 'owa-service/lib/contract/Message';

let shouldShowBehaviorMap: { [id: number]: ShouldShowBehavior };

/**
 * Get a map which maps a mail filterable menu item to its ShouldShowBehavior
 */
export default function getMailMenuItemShouldShowMap() {
    if (!shouldShowBehaviorMap) {
        initializeMap();
    }

    return shouldShowBehaviorMap;
}

/**
 * Initialize the ShouldShowBehaviors for mail menu items
 */
function initializeMap() {
    const inboxFolderId = 'inbox';
    const dumpsterFolderIds: string[] = [
        PRIMARY_DUMPSTER_DISTINGUISHED_ID,
        ARCHIVE_DUMPSTER_DISTINGUISHED_ID,
    ];
    const deletedFolderIds: string[] = [
        PRIMARY_DELETED_ITEMS_DISTINGUISHED_ID,
        ARCHIVE_DELETED_ITEMS_DISTINGUISHED_ID,
    ];
    const sentItemsFolderId = 'sentitems';
    const draftsFolderId = 'drafts';
    const deletedItemsFolderId = 'deleteditems';
    const junkFolderId = 'junkemail';
    const scheduledFolderId = 'scheduled';
    const clutterFolderId = 'clutter';
    const archiveFolderId = 'archive';
    const notesFolderId = 'notes';

    // Folders where pin is not supported
    const restrictedFoldersForPin = [
        draftsFolderId,
        sentItemsFolderId,
        clutterFolderId,
        junkFolderId,
        deletedItemsFolderId,
        archiveFolderId,
        notesFolderId,
        ...dumpsterFolderIds,
    ];

    shouldShowBehaviorMap = {
        // If the item item is explicitly known, never disable
        [MenuItemType.BadItemType]: shouldShowMenuItem([
            customRestriction(() => {
                return true;
            }),
        ]),

        // Show the menu item if list view has single selection
        [MenuItemType.SingleSelection]: shouldShowMenuItem([
            selectionRestriction([SelectionRestrictionType.SingleSelection]),
        ]),

        // Show the menu item if list view has ANY selection
        [MenuItemType.AnySelection]: shouldShowMenuItem([
            selectionRestriction([SelectionRestrictionType.HasAnySelection]),
        ]),

        // Show overflow divider if
        // - in single selection
        // - not in recoverable items view
        [MenuItemType.OverflowDivider]: shouldShowMenuItem([
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection),
            selectionRestriction([SelectionRestrictionType.SingleSelection]),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
        ]),

        // Show reply / reply all / forward in command bar if
        // - not in recoverable items view or drafts or junk folder
        // - there's a single selection
        // - it's not a group
        // - in message view
        [MenuItemType.ReplyReplyAllForwardCommandBar]: shouldShowMenuItem([
            mailboxRestriction([MailboxType.GroupMBX], true),
            folderRestriction(
                [draftsFolderId, junkFolderId, notesFolderId, ...dumpsterFolderIds],
                true
            ),
            listViewTypeRestrictionType(ListViewTypeRestrictionType.Message),
            customRestriction(
                () =>
                    !isMultipleItemPartSelection() &&
                    selectionRestriction([SelectionRestrictionType.SingleSelection])()
            ),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
        ]),

        // Show reply if
        // - not in recoverable items view
        // - there's a single selection
        // - it's not a group
        // - in message view
        // - allowed by IRMRestrictions, S/MIME etc. - checkItemReplyForwardDisabled
        [MenuItemType.Reply]: shouldShowMenuItem([
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            mailboxRestriction([MailboxType.GroupMBX], true),
            customRestriction(
                () =>
                    !isMultipleItemPartSelection() &&
                    selectionRestriction([SelectionRestrictionType.SingleSelection])()
            ),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            listViewTypeRestrictionType(ListViewTypeRestrictionType.Message),
            customRestriction(() => {
                return (
                    listViewTypeRestrictionType(ListViewTypeRestrictionType.Message)() &&
                    checkItemReplyReplyAllForwardRestrictions(false /* isConversationItemPart */)[0]
                    /* first value in returned array is isReplyAllowed */
                );
            }),
        ]),

        // Enable reply with meeting if
        // - not in recoverable items view
        // - there's a single selection
        // - it's not a group
        // Note: IRM does not block 'reply with meeting'
        [MenuItemType.ReplyWithMeeting]: shouldShowMenuItem([
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            mailboxRestriction([MailboxType.GroupMBX], true),
            customRestriction(
                () =>
                    !isMultipleItemPartSelection() &&
                    selectionRestriction([SelectionRestrictionType.SingleSelection])()
            ),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
        ]),

        // Enable ribbon reply if
        // - not in recoverable items view
        // - there's a single selection
        // - it's not a group
        // - allowed by IRMRestrictions, S/MIME etc. - checkItemReplyForwardDisabled
        [MenuItemType.Ribbon_Reply]: shouldShowMenuItem([
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            mailboxRestriction([MailboxType.GroupMBX], true),
            customRestriction(
                () =>
                    !isMultipleItemPartSelection() &&
                    selectionRestriction([SelectionRestrictionType.SingleSelection])()
            ),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(() => {
                return checkItemReplyReplyAllForwardRestrictions(
                    listViewTypeRestrictionType(
                        ListViewTypeRestrictionType.Conversation
                    )() /* isConversationItemPart */
                )[0];
                /* first value in returned array is isReplyAllowed */
            }),
        ]),

        // Show reply all if
        // - not in recoverable items view
        // - there's a single selection
        // - in message view
        // - allowed by IRMRestrictions, S/MIME etc. - checkItemReplyForwardDisabled
        [MenuItemType.ReplyAll]: shouldShowMenuItem([
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(
                () =>
                    !isMultipleItemPartSelection() &&
                    selectionRestriction([SelectionRestrictionType.SingleSelection])()
            ),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            listViewTypeRestrictionType(ListViewTypeRestrictionType.Message),
            customRestriction(() => {
                return (
                    listViewTypeRestrictionType(ListViewTypeRestrictionType.Message)() &&
                    checkItemReplyReplyAllForwardRestrictions(false /* isConversationItemPart */)[1]
                    /* second value in returned array is isReplyAllAllowed */
                );
            }),
        ]),

        // Enable ribbon reply all if
        // - not in recoverable items view
        // - there's a single selection
        // - allowed by IRMRestrictions, S/MIME etc. - checkItemReplyForwardDisabled
        [MenuItemType.Ribbon_ReplyAll]: shouldShowMenuItem([
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(
                () =>
                    !isMultipleItemPartSelection() &&
                    selectionRestriction([SelectionRestrictionType.SingleSelection])()
            ),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(() => {
                return checkItemReplyReplyAllForwardRestrictions(
                    listViewTypeRestrictionType(
                        ListViewTypeRestrictionType.Conversation
                    )() /* isConversationItemPart */
                )[1];
                /* second value in returned array is isReplyAllAllowed */
            }),
        ]),

        // Show forward if
        // - not in recoverable items view
        // - there's a single selection
        // - in message view
        // - allowed by IRMRestrictions, S/MIME etc. - checkItemReplyForwardDisabled
        [MenuItemType.Forward]: shouldShowMenuItem([
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(
                () =>
                    !isMultipleItemPartSelection() &&
                    selectionRestriction([SelectionRestrictionType.SingleSelection])()
            ),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            listViewTypeRestrictionType(ListViewTypeRestrictionType.Message),
            customRestriction(() => {
                return (
                    listViewTypeRestrictionType(ListViewTypeRestrictionType.Message)() &&
                    checkItemReplyReplyAllForwardRestrictions(false /* isConversationItemPart */)[2]
                    /* third value in returned array is isForwardAllowed */
                );
            }),
        ]),

        // Enable ribbon forward if
        // - not in recoverable items view
        // - there's a single selection
        // - allowed by IRMRestrictions, S/MIME etc. - checkItemReplyForwardDisabled
        [MenuItemType.Ribbon_Forward]: shouldShowMenuItem([
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(
                () =>
                    !isMultipleItemPartSelection() &&
                    selectionRestriction([SelectionRestrictionType.SingleSelection])()
            ),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(() => {
                return checkItemReplyReplyAllForwardRestrictions(
                    listViewTypeRestrictionType(
                        ListViewTypeRestrictionType.Conversation
                    )() /* isConversationItemPart */
                )[2];
                /* third value in returned array is isForwardAllowed */
            }),
        ]),

        // Enable ribbon share (to Teams, OneNote, etc.) if
        // - not in recoverable items view
        // - there's a single selection
        // - it's not a group
        // - forward is allowed by IRMRestrictions, S/MIME etc. - checkItemReplyForwardDisabled
        [MenuItemType.Ribbon_Share]: shouldShowMenuItem([
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            mailboxRestriction([MailboxType.GroupMBX], true),
            customRestriction(
                () =>
                    !isMultipleItemPartSelection() &&
                    selectionRestriction([SelectionRestrictionType.SingleSelection])()
            ),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(() => {
                return checkItemReplyReplyAllForwardRestrictions(
                    listViewTypeRestrictionType(
                        ListViewTypeRestrictionType.Conversation
                    )() /* isConversationItemPart */
                )[2];
                /* third value in returned array is isForwardAllowed */
            }),
        ]),

        // Show schedule menu item if
        // - user is in inbox or scheduled
        // - user is not in archive mbx, group mbx, shadow mbx, shared folders scenarios
        // - there's a mail list item selection
        [MenuItemType.Schedule]: shouldShowMenuItem([
            customRestriction(() => {
                const customCondition =
                    mailboxRestriction(
                        [
                            MailboxType.GroupMBX,
                            MailboxType.ArchiveMBX,
                            MailboxType.ShadowMBX,
                            MailboxType.SharedFolderMBX,
                        ],
                        true
                    )() &&
                    selectionRestriction([SelectionRestrictionType.HasRealSelection])() &&
                    (itemPartSelectionRestrictionType(
                        ItemPartSelectionRestrictionType.NoSelection
                    )() ||
                        shouldShowUnstackedReadingPane());

                if (getSelectedTableView().tableQuery.type === TableQueryType.Search) {
                    return (
                        isSingleSelectedRowSnoozable([inboxFolderId, scheduledFolderId]) &&
                        customCondition
                    );
                } else {
                    return (
                        folderRestriction([inboxFolderId, scheduledFolderId])() &&
                        staticFolderSearchScopeRestriction([])() &&
                        customCondition
                    );
                }
            }),
        ]),

        // Show new message in right pane command bar or in mail view
        // - user is not in dumpster folder (or search)
        // - when folder pane is collapsed
        // - when in condensed commandbar view which is a part of 'mon-densities'
        [MenuItemType.NewMessage]: shouldShowMenuItem([
            folderRestriction([...dumpsterFolderIds, notesFolderId], true),
            staticFolderSearchScopeRestriction(dumpsterFolderIds, true),
            customRestriction(() => {
                return (
                    isFeatureEnabled('mon-tri-collapsibleFolderPane') ||
                    isFeatureEnabled('mon-densities') ||
                    !shouldShowFolderPane() ||
                    shouldShowFolderPaneAsOverlay()
                );
            }),
        ]),

        // Show Ribbon's New Message is similar to the Toolbar, except we need to explicitly
        // call for getMailMenuItemShouldDisable() and only show if we aren't disabled.
        [MenuItemType.Ribbon_NewMessage]: shouldShowMenuItem([
            folderRestriction([...dumpsterFolderIds, notesFolderId], true),
            staticFolderSearchScopeRestriction(dumpsterFolderIds, true),
            customRestriction(() => {
                return !getMailMenuItemShouldDisable(MenuItemType.NewMessage);
            }),
        ]),

        // Show hamburger in right pane command bar
        // - when folder pane is collapsed and user is on meta os flight
        [MenuItemType.Hamburger]: shouldShowMenuItem([
            customRestriction(() => {
                return shouldShowCommandBarHamburgerButton();
            }),
        ]),

        // Show new note in right pane command bar
        // - when folder pane is collapsed and we're in the notes folder
        // or if the closer command bar flight is on.
        [MenuItemType.NewNote]: shouldShowMenuItem([
            folderRestriction([notesFolderId]),
            customRestriction(() => {
                return isFeatureEnabled('mon-densities') || !shouldShowFolderPane();
            }),
        ]),

        // Show New Note Hero Button in Ribbon
        // - when we're in the notes folder
        // - and feature 'notes-folder-view' is enabled
        [MenuItemType.Ribbon_NewNote]: shouldShowMenuItem([
            folderRestriction([notesFolderId]),
            customRestriction(() => {
                return isFeatureEnabled('notes-folder-view');
            }),
        ]),

        // Show note actions (delete, change color) in right pane command bar
        // - We're in the notes folder
        // - there is a selected note
        [MenuItemType.NoteActions]: shouldShowMenuItem([
            folderRestriction([notesFolderId]),
            customRestriction(() => {
                return !!getNotesStore().selectedNoteId;
            }),
        ]),

        // Show view email from note in right pane command bar
        // - We're in the notes folder
        // - there is a selected note
        [MenuItemType.ViewEmailFromNote]: shouldShowMenuItem([
            folderRestriction([notesFolderId]),
            customRestriction(() => {
                return (
                    isFeatureEnabled('rp-userMarkup') &&
                    selectedNoteHasEmailId.tryImportForRender()?.('NotesFolder')
                );
            }),
        ]),

        // Show mark as read if
        // - not in recoverable items view
        // - list view has multiple selections
        // - or list view has single selection and selected row is unread
        [MenuItemType.MarkAsRead]: shouldShowMenuItem([
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(() => {
                return (
                    // Show mark as read if
                    // 1) Any of the selected itemparts is unread
                    // 2) List view has single selection AND row is unread AND we are not acting on item parts
                    // 3) At least one selected item part is unread AND we are acting on item parts
                    isAnySelectedItemPartUnread() ||
                    (selectionRestriction([SelectionRestrictionType.SingleSelection])() &&
                        !isSingleSelectedRowRead()) ||
                    selectionRestriction([SelectionRestrictionType.MultipleAnySelection])()
                );
            }),
        ]),

        // Show mark as unread if not in recoverable items and list view has multiple selections
        // or list view has single selection and selected row is read
        [MenuItemType.MarkAsUnread]: shouldShowMenuItem([
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(() => {
                return (
                    // Show mark as unread if
                    // 1) Any of the selected itemparts is read
                    // 2) List view has single selection AND row is fully read (or some of its itemparts are read)
                    // AND we are not acting on item parts
                    // 3) At least one selected item part is read AND we are acting on item parts
                    isAnySelectedItemPartRead() ||
                    (selectionRestriction([SelectionRestrictionType.SingleSelection])() &&
                        !isSingleSelectedRowFullyUnread()) ||
                    selectionRestriction([SelectionRestrictionType.MultipleAnySelection])()
                );
            }),
        ]),

        // Enable the ribbon Read/Unread toggle if:
        // - not in recoverable items view
        // - list view has any selections
        // - Bulk Action is not running for this folder id
        [MenuItemType.Ribbon_ReadUnread]: shouldShowMenuItem([
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            selectionRestriction([SelectionRestrictionType.HasAnySelection]),
            customRestriction(() => {
                return !isBulkActionRunning(getSelectedTableView().serverFolderId);
            }),
        ]),

        // Show meet now in right pane command bar
        // - user is not in dumpster folder (or search)
        // - when folder pane is collapsed
        [MenuItemType.MeetNow]: shouldShowMenuItem([
            folderRestriction(dumpsterFolderIds, true),
            staticFolderSearchScopeRestriction(dumpsterFolderIds, true),
            customRestriction(() => {
                return !!lazyIsMeetNowEnabled.tryImportForRender()?.();
            }),
        ]),

        // Show flag if
        // 1) List view has single selection AND row is un-flagged AND we are not acting on item parts
        // 2) List view has multiple selection
        // 3) At least one selected item part is un-flagged AND we are acting on item parts
        // 4) It is shared folder and user has edit permission for shared folder
        // Hide if
        // 1) Group mbx
        // 2) Notes folder and dumpster folder
        [MenuItemType.Flag]: shouldShowMenuItem([
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            mailboxRestriction([MailboxType.GroupMBX], true),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(() => {
                return (
                    (isAnySelectedItemPartUnflagged() ||
                        (selectionRestriction([SelectionRestrictionType.SingleSelection])() &&
                            !isSingleSelectedRowFlagged()) ||
                        selectionRestriction([SelectionRestrictionType.MultipleRealSelection])()) &&
                    doesUserHaveSharedFolderPermissionFor(MenuItemType.Flag)
                );
            }),
        ]),

        // Show unflag if
        // - not in recoverable items view
        // - list view has multiple selections
        // - or list view has single selection and selected row is flagged
        [MenuItemType.Unflag]: shouldShowMenuItem([
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            mailboxRestriction([MailboxType.GroupMBX], true),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(() => {
                return (
                    // Show unflag if
                    // 1) List view has single selection AND row is flagged AND we are not acting on item parts
                    // 2) At least one selected item part is flagged AND we are acting on item parts
                    // 3) It is a shared folder and user has edit all permission
                    (isAnySelectedItemPartFlagged() ||
                        (selectionRestriction([SelectionRestrictionType.SingleSelection])() &&
                            isSingleSelectedRowFlagged()) ||
                        selectionRestriction([SelectionRestrictionType.MultipleRealSelection])()) &&
                    doesUserHaveSharedFolderPermissionFor(MenuItemType.Unflag)
                );
            }),
        ]),

        // Show Ribbon's FlagUnflag if
        // 1) List view has multiple selection
        // 2) It is shared folder and user has edit permission for shared folder
        // Hide if
        // 1) Group mbx
        // 2) Notes folder and dumpster folder
        [MenuItemType.Ribbon_FlagUnflag]: shouldShowMenuItem([
            selectionRestriction([SelectionRestrictionType.HasAnySelection]),
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            mailboxRestriction([MailboxType.GroupMBX], true),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
        ]),

        // Show categories if
        // - not in recoverable items view
        // - list view has selection
        // - not in groups
        // - user is in a shared folder and has edit all permission
        [MenuItemType.Categories]: shouldShowMenuItem([
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(
                () =>
                    shouldShowUnstackedReadingPane() ||
                    itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection)()
            ),
            mailboxRestriction([MailboxType.GroupMBX, MailboxType.ShadowMBX], true),
            selectionRestriction([SelectionRestrictionType.HasRealSelection]),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(() => {
                return doesUserHaveSharedFolderPermissionFor(MenuItemType.Categories);
            }),
        ]),

        // Show pin menu items
        // - in all folders except the ones in the restriction list
        // - and its not a archive mbx, group mbx
        // - (and list view has single selection and it's unpinned
        //- and when not in search
        // ----- or list view has multiple selections)
        [MenuItemType.Pin]: shouldShowMenuItem([
            folderRestriction(restrictedFoldersForPin, true),
            mailboxRestriction(
                [MailboxType.GroupMBX, MailboxType.ArchiveMBX, MailboxType.SharedFolderMBX],
                true
            ),
            customRestriction(
                () =>
                    shouldShowUnstackedReadingPane() ||
                    itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection)()
            ),
            sortByRestriction([MailSortHelper.getSortBySupportingPin()]),
            searchScopeRestriction(
                [SearchScopeKind.ArchiveMailbox, SearchScopeKind.SharedFolders],
                true
            ),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(() => {
                // Shared condition for search and non-search scenario
                const customCondition =
                    selectionRestriction([SelectionRestrictionType.MultipleRealSelection])() ||
                    (selectionRestriction([SelectionRestrictionType.SingleSelection])() &&
                        !isSingleSelectedRowPinned());

                /**
                 * If selected table is search, combine the custom condition
                 * with check to see if item belongs to a folder where pin
                 * is supported.
                 */
                if (getSelectedTableView().tableQuery.type === TableQueryType.Search) {
                    return customCondition && isSingleSelectedRowPinnable(restrictedFoldersForPin);
                }

                return customCondition;
            }),
        ]),

        // Show unpin menu items
        // - in all folders except the ones in the restriction list
        // - and not in archive mbx or group mbx
        // - and list view has single selection and it's pinned
        // - and when not in search
        // ----- or list view has multiple selections
        [MenuItemType.Unpin]: shouldShowMenuItem([
            folderRestriction(restrictedFoldersForPin, true),
            mailboxRestriction(
                [MailboxType.ArchiveMBX, MailboxType.GroupMBX, MailboxType.SharedFolderMBX],
                true
            ),
            customRestriction(
                () =>
                    shouldShowUnstackedReadingPane() ||
                    itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection)()
            ),
            sortByRestriction([MailSortHelper.getSortBySupportingPin()]),
            searchScopeRestriction(
                [SearchScopeKind.ArchiveMailbox, SearchScopeKind.SharedFolders],
                true
            ),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(() => {
                // Shared condition for search and non-search scenario
                const customCondition =
                    selectionRestriction([SelectionRestrictionType.MultipleRealSelection])() ||
                    (selectionRestriction([SelectionRestrictionType.SingleSelection])() &&
                        isSingleSelectedRowPinned());

                /**
                 * If selected table is search, combine the custom condition
                 * with check to see if item belongs to a folder where pin
                 * is supported.
                 */
                if (getSelectedTableView().tableQuery.type === TableQueryType.Search) {
                    return customCondition && isSingleSelectedRowPinnable(restrictedFoldersForPin);
                }

                return customCondition;
            }),
        ]),

        // Enable ribbon pin/unpin toggle:
        // - in all folders except the ones in the restriction list
        // - and not in archive mbx or group mbx
        // - and when not in search
        [MenuItemType.Ribbon_PinUnpin]: shouldShowMenuItem([
            folderRestriction(restrictedFoldersForPin, true),
            mailboxRestriction(
                [MailboxType.ArchiveMBX, MailboxType.GroupMBX, MailboxType.SharedFolderMBX],
                true
            ),
            customRestriction(
                () =>
                    shouldShowUnstackedReadingPane() ||
                    itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection)()
            ),
            sortByRestriction([MailSortHelper.getSortBySupportingPin()]),
            searchScopeRestriction(
                [SearchScopeKind.ArchiveMailbox, SearchScopeKind.SharedFolders],
                true
            ),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            selectionRestriction([SelectionRestrictionType.HasAnySelection]),
        ]),

        // Show CreateTask menu item if:
        // 1) List view has single selection
        // 2) We are not acting on item parts
        // 4) Time panel flights enabled
        // 5) Not Group mbx
        // 6) Not in Notes folder and dumpster folder
        [MenuItemType.CreateTask]: shouldShowMenuItem([
            selectionRestriction([SelectionRestrictionType.SingleSelection]),
            itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection),
            customRestriction(() => {
                return isTimePanelWithToDoFeaturesAvailable();
            }),
            mailboxRestriction([MailboxType.GroupMBX], true),
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
        ]),

        // Show delete
        // - when list view has selection
        // - If it is shared folder and folder has delete all permission
        [MenuItemType.Delete]: shouldShowMenuItem([
            folderRestriction(['notes'], true),
            selectionRestriction([SelectionRestrictionType.HasAnySelection]),
            customRestriction(() => {
                return shouldAllowDelete(getSelectedTableView());
            }),
        ]),

        // The Ribbon's delete show state is nearly the same as OWA Toolbar,
        // except that we show only if getMailMenuItemShouldDisable() is false.
        [MenuItemType.Ribbon_Delete]: shouldShowMenuItem([shouldShowRibbon_Delete]),

        // Show archive
        // - in folders under msgfolderroot except archive, deleted items, drafts, junk folder, and recoverable items
        // - and when list view has selection
        // - or if list view has selection in search
        [MenuItemType.Archive]: shouldShowMenuItem([
            folderRestriction(
                [
                    archiveFolderId,
                    deletedItemsFolderId,
                    draftsFolderId,
                    junkFolderId,
                    notesFolderId,
                    ...dumpsterFolderIds,
                ],
                true
            ),
            mailboxRestriction(
                [MailboxType.GroupMBX, MailboxType.ArchiveMBX, MailboxType.SharedFolderMBX],
                true
            ),
            tableQueryTypeRestriction([TableQueryType.Folder, TableQueryType.Search]),
            selectionRestriction([SelectionRestrictionType.HasRealSelection]),
            searchScopeRestriction(
                [SearchScopeKind.ArchiveMailbox, SearchScopeKind.SharedFolders],
                true
            ),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
        ]),

        // Show mark as junk
        // - when list view has selection
        // - and in folders under msgfolderroot except sent items, junk email, drafts, clutter, scheduled, and recoverable items
        // - or when list view has selection in search and the search refiner is not junkemail
        [MenuItemType.MarkAsJunk]: shouldShowMenuItem([
            folderRestriction(
                [
                    draftsFolderId,
                    sentItemsFolderId,
                    junkFolderId,
                    clutterFolderId,
                    scheduledFolderId,
                    notesFolderId,
                    ...dumpsterFolderIds,
                ],
                true
            ),
            mailboxRestriction(
                [
                    MailboxType.ArchiveMBX,
                    MailboxType.GroupMBX,
                    MailboxType.ShadowMBX,
                    MailboxType.SharedFolderMBX,
                ],
                true
            ),
            mailScenarioRestriction(['persona', 'category'], true),
            selectionRestriction([SelectionRestrictionType.HasRealSelection]),
            searchScopeRestriction(
                [SearchScopeKind.ArchiveMailbox, SearchScopeKind.SharedFolders],
                true
            ),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(() => {
                return isJunkEmailEnabledByAdmin();
            }),
        ]),

        // The Ribbon combines Junk and Not Junk. We show if either
        // MenuItemType.MarkAsJunk or MenuItemType.JunkEmailSafetyAction would show.
        [MenuItemType.Ribbon_JunkNotJunk]: shouldShowMenuItem([shouldShowRibbon_JunkNotJunk]),

        // Show mark as phishing
        // - when list view has selection
        // - and in folders under msgfolderroot except sent items, drafts, clutter, scheduled, and recoverable items
        [MenuItemType.MarkAsPhishing]: shouldShowMenuItem([
            folderRestriction(
                [
                    draftsFolderId,
                    sentItemsFolderId,
                    clutterFolderId,
                    scheduledFolderId,
                    notesFolderId,
                    ...dumpsterFolderIds,
                ],
                true
            ),
            mailboxRestriction(
                [
                    MailboxType.ArchiveMBX,
                    MailboxType.GroupMBX,
                    MailboxType.ShadowMBX,
                    MailboxType.SharedFolderMBX,
                ],
                true
            ),
            mailScenarioRestriction(['persona', 'category'], true),
            selectionRestriction([SelectionRestrictionType.HasRealSelection]),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
        ]),

        // Show mark as not junk and other junk email safety actions
        // - in junk folder
        // - and when list view has selection
        // - or when list view has selection in search and the search refiner is junkemail
        // (But ALWAYS hide when in a Group/Shadow/Archive Mailbox)
        [MenuItemType.JunkEmailSafetyAction]: shouldShowMenuItem([
            folderRestriction([junkFolderId]),
            mailboxRestriction(
                [
                    MailboxType.ArchiveMBX,
                    MailboxType.GroupMBX,
                    MailboxType.ShadowMBX,
                    MailboxType.SharedFolderMBX,
                ],
                true
            ),
            selectionRestriction([SelectionRestrictionType.HasRealSelection]),
            searchScopeRestriction(
                [SearchScopeKind.ArchiveMailbox, SearchScopeKind.SharedFolders],
                true
            ),
            staticFolderSearchScopeRestriction([junkFolderId]),
            customRestriction(() => {
                return isJunkEmailEnabledByAdmin();
            }),
        ]),

        // Show ignore
        // - when list view has selection
        // - and not in Sent Items, drafts, deleted items, junk, or dumpster
        // (But ALWAYS hide when in a ShadowMailbox, Group mbx, Archive mbx)
        [MenuItemType.Ignore]: shouldShowMenuItem([
            folderRestriction(
                [
                    sentItemsFolderId,
                    draftsFolderId,
                    deletedItemsFolderId,
                    junkFolderId,
                    notesFolderId,
                    ...dumpsterFolderIds,
                ],
                true
            ),
            mailboxRestriction(
                [
                    MailboxType.ArchiveMBX,
                    MailboxType.GroupMBX,
                    MailboxType.ShadowMBX,
                    MailboxType.SharedFolderMBX,
                ],
                true
            ),
            tableQueryTypeRestriction([TableQueryType.Folder, TableQueryType.Search]),
            customRestriction(
                () =>
                    shouldShowUnstackedReadingPane() ||
                    itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection)()
            ),
            searchScopeRestriction(
                [
                    SearchScopeKind.ArchiveMailbox,
                    SearchScopeKind.SharedFolders,
                    SearchScopeKind.Group,
                ],
                true
            ),
            selectionRestriction([SelectionRestrictionType.HasRealSelection]),
            staticFolderSearchScopeRestriction(
                [
                    sentItemsFolderId,
                    draftsFolderId,
                    deletedItemsFolderId,
                    junkFolderId,
                    notesFolderId,
                    ...dumpsterFolderIds,
                ],
                true
            ),
        ]),

        // The Ribbon combines Ignore and Stop Ignore. We show if either
        // MenuItemType.Ignore or MenuItemType.StopIgnore would show.
        [MenuItemType.Ribbon_IgnoreStopIgnore]: shouldShowMenuItem([
            shouldShowRibbon_IgnoreStopIgnore,
        ]),

        // Show report abuse
        // - when list view has single selection
        [MenuItemType.ReportAbuse]: shouldShowMenuItem([
            folderRestriction([notesFolderId], true),
            selectionRestriction([SelectionRestrictionType.SingleSelection]),
            customRestriction(() => {
                return (
                    isFeatureEnabled('tri-reportAbuse') &&
                    ((mailboxRestriction([MailboxType.GroupMBX])() && isConsumer()) ||
                        mailboxRestriction([MailboxType.PrimaryMBX])())
                );
            }),
        ]),

        // Show stop ignoring
        // - when list view has selection
        // - only in deleted items
        // (But ALWAYS hide when in a ShadowMailbox, Group mbx, Archive mbx)
        [MenuItemType.StopIgnoring]: shouldShowMenuItem([
            folderRestriction([deletedItemsFolderId]),
            mailboxRestriction([MailboxType.PrimaryMBX]),
            tableQueryTypeRestriction([TableQueryType.Search], true),
            itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection),
            selectionRestriction([SelectionRestrictionType.HasRealSelection]),
        ]),

        // Show block sender
        // - not in search(because search doesn't return lastSender property)
        // - when list view has selection with a LastSender property on the item
        // - and in folders under msgfolderroot except sent items, junk email, drafts, clutter, scheduled and recoverable items
        // - and when list view has single selection and it has valid smtp address
        [MenuItemType.Block]: shouldShowMenuItem([
            folderRestriction(
                [
                    draftsFolderId,
                    sentItemsFolderId,
                    clutterFolderId,
                    scheduledFolderId,
                    notesFolderId,
                    ...dumpsterFolderIds,
                ],
                true
            ),
            mailboxRestriction([MailboxType.GroupMBX, MailboxType.ShadowMBX], true),
            itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection),
            customRestriction(() => {
                return (
                    (selectionRestriction([SelectionRestrictionType.SingleSelection])() &&
                        doesSingleSelectionHasSmtp()) ||
                    selectionRestriction([SelectionRestrictionType.MultipleRealSelection])()
                );
            }),
        ]),

        // Show sweep
        // - in folders except sent, drafts, deleteditems, junk email, and recoverable items
        // - and the mbx is not archive, group, or shadow
        // - and when user is not in search mode
        // - and when user is not in a category folder
        // - and when list view has
        // ------ multiple selections,
        // ------ OR single selection and it has smtp address
        [MenuItemType.Sweep]: shouldShowMenuItem([
            folderRestriction(
                [
                    sentItemsFolderId,
                    draftsFolderId,
                    deletedItemsFolderId,
                    junkFolderId,
                    notesFolderId,
                    ...dumpsterFolderIds,
                ],
                true
            ),
            mailboxRestriction(
                [
                    MailboxType.ArchiveMBX,
                    MailboxType.GroupMBX,
                    MailboxType.SharedFolderMBX,
                    MailboxType.ShadowMBX,
                ],
                true
            ),
            itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection),
            tableQueryTypeRestriction([TableQueryType.Search], true),
            mailScenarioRestriction(['category'], true),
            customRestriction(() => {
                return (
                    (selectionRestriction([SelectionRestrictionType.SingleSelection])() &&
                        doesSingleSelectionHasSmtp()) ||
                    selectionRestriction([SelectionRestrictionType.MultipleRealSelection])()
                );
            }),
        ]),

        // The Ribbon's sweep show state is nearly the same as OWA Toolbar,
        // except that we show only if getMailMenuItemShouldDisable() is false.
        [MenuItemType.Ribbon_Sweep]: shouldShowMenuItem([shouldShowRibbon_Sweep]),

        // Show empty folder menu item if
        // - list view has items and has no selection
        // - not in groups or shared
        // - if in search or favorite node where selected folder id is null
        // - not in notes folder
        // - OR
        // - when in Inbox and FocusedViewFilter is Other
        [MenuItemType.EmptyFolder]: shouldShowMenuItem([
            [
                folderRestriction([inboxFolderId, notesFolderId], true),
                tableQueryTypeRestriction([TableQueryType.Folder, TableQueryType.Search]),
                mailboxRestriction([MailboxType.GroupMBX, MailboxType.SharedFolderMBX], true),
                listRestrictionType(ListRestrictionType.WithItems),
                selectionRestriction([SelectionRestrictionType.NoSelection]),
                customRestriction((selectedFolderDistinguishedId: string) => {
                    // This custom restriction is only valid for the folder table types
                    // In this particular case we check for the distinguished folder id.
                    const isDumpsterOrNotArchiveShadowMailboxFolder =
                        isMailFolderTableShown() &&
                        selectedFolderDistinguishedId &&
                        (dumpsterFolderIds.indexOf(selectedFolderDistinguishedId) > -1 ||
                            isNotArchiveInShadowMailbox(selectedFolderDistinguishedId));
                    return (
                        isDumpsterOrNotArchiveShadowMailboxFolder ||
                        doesUserHaveSharedFolderPermissionFor(MenuItemType.Delete)
                    );
                }),
            ],
            [
                folderRestriction([inboxFolderId], false),
                focusedViewFilterRestriction([FocusedViewFilter.Other]),
                listRestrictionType(ListRestrictionType.WithItems),
                selectionRestriction([SelectionRestrictionType.NoSelection]),
                mailboxRestriction([MailboxType.GroupMBX], true),
            ],
        ]),

        // Show mark all as read menu item
        // - not in recoverable items view
        // - and list view has unread item
        // - and list view has no selection
        [MenuItemType.MarkAllAsRead]: shouldShowMenuItem([
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            listRestrictionType(ListRestrictionType.WithItems),
            selectionRestriction([SelectionRestrictionType.NoSelection]),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
        ]),

        // Show restore if
        // - list view has selections
        // - and in deleteditems or dumpster folder
        // - and in search when the search scope is deleteditems for dumpster folder
        [MenuItemType.Restore]: shouldShowMenuItem([
            selectionRestriction([SelectionRestrictionType.HasRealSelection]),
            folderRestriction([...deletedFolderIds, ...dumpsterFolderIds]),
            mailboxRestriction([MailboxType.GroupMBX], true),
            itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection),
            staticFolderSearchScopeRestriction([...dumpsterFolderIds, ...deletedFolderIds]),
        ]),

        // Show restore all if
        // - list view has all selected
        // - and in deleteditems or dumpster folder
        // - and in search when the search scope is deleteditems for dumpster folder
        [MenuItemType.RestoreAll]: shouldShowMenuItem([
            selectionRestriction([SelectionRestrictionType.HasAllVirtuallySelected]),
            folderRestriction([...deletedFolderIds, ...dumpsterFolderIds]),
            mailboxRestriction([MailboxType.GroupMBX], true),
            listRestrictionType(ListRestrictionType.WithItems),
            itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection),
            staticFolderSearchScopeRestriction([...dumpsterFolderIds, ...deletedFolderIds]),
            customRestriction(() => {
                return isFeatureEnabled('tri-restoreAll');
            }),
        ]),

        // Show undo if
        // - not in recoverable items view
        // - not in archive mbx, group mbx
        // - In folder list view
        // - When list pane is showing
        // - list view has items OR undo stack is not empty
        [MenuItemType.Undo]: shouldShowMenuItem([
            folderRestriction([...dumpsterFolderIds, notesFolderId], true),
            mailboxRestriction(
                [MailboxType.ArchiveMBX, MailboxType.GroupMBX, MailboxType.SharedFolderMBX],
                true
            ),
            tableQueryTypeRestriction([TableQueryType.Folder]),
            customRestriction(() => {
                return (
                    shouldShowListView() &&
                    (undoActions.hasUndoableAction() ||
                        listRestrictionType(ListRestrictionType.WithItems)())
                );
            }),
        ]),

        // Enable ribbon undo if
        // - not in recoverable items view
        // - not in archive mbx, group mbx
        // - In folder list view
        // - undo stack is not empty
        [MenuItemType.Ribbon_Undo]: shouldShowMenuItem([
            folderRestriction([...dumpsterFolderIds, notesFolderId], true),
            mailboxRestriction(
                [MailboxType.ArchiveMBX, MailboxType.GroupMBX, MailboxType.SharedFolderMBX],
                true
            ),
            tableQueryTypeRestriction([TableQueryType.Folder]),
            customRestriction(() => {
                return undoActions.hasUndoableAction();
            }),
        ]),

        // Show move to if
        // - Not in draft folder or recoverable items view
        // - Not in groups mbx
        // - list view has selection
        // - Shared folder has delete all permission
        [MenuItemType.Move]: shouldShowMenuItem([
            folderRestriction([draftsFolderId, notesFolderId, ...dumpsterFolderIds], true),
            mailboxRestriction([MailboxType.GroupMBX], true),
            selectionRestriction([SelectionRestrictionType.HasRealSelection]),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(() => {
                return doesUserHaveSharedFolderPermissionFor(MenuItemType.Move);
            }),
        ]),

        // Show copy to if
        // - Not in draft folder or recoverable items view
        // - Not in groups mbx
        // - list view has selection
        // - Shared folder has delete all permission
        [MenuItemType.Copy]: shouldShowMenuItem([
            folderRestriction([draftsFolderId, notesFolderId, ...dumpsterFolderIds], true),
            mailboxRestriction([MailboxType.GroupMBX], true),
            selectionRestriction([SelectionRestrictionType.HasRealSelection]),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(() => {
                return doesUserHaveSharedFolderPermissionFor(MenuItemType.Copy);
            }),
        ]),

        // Show inbox rule if
        // - not in sent items or drafts folders (until 'sent to' rule field is supported) or recoverable items view, and not a group
        // - and list view has single selection
        [MenuItemType.InboxRule]: shouldShowMenuItem([
            folderRestriction(
                [sentItemsFolderId, draftsFolderId, notesFolderId, ...dumpsterFolderIds],
                true
            ),
            mailboxRestriction(
                [
                    MailboxType.ArchiveMBX,
                    MailboxType.GroupMBX,
                    MailboxType.SharedFolderMBX,
                    MailboxType.ShadowMBX,
                ],
                true
            ),
            itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection),
            searchScopeRestriction(
                [SearchScopeKind.ArchiveMailbox, SearchScopeKind.SharedFolders],
                true
            ),
            selectionRestriction([SelectionRestrictionType.SingleSelection]),
            staticFolderSearchScopeRestriction(
                [sentItemsFolderId, notesFolderId, draftsFolderId],
                true
            ),
            customRestriction(() => {
                return isInboxRuleEnabledByAdmin() && doesSingleSelectionHasSmtp();
            }),
        ]),

        // Show move to Focused inbox menu item
        // - when is in Other inbox
        // - and list view has items
        // - and list view has selection
        // - and when not in search
        [MenuItemType.MoveToFocusedInbox]: shouldShowMenuItem([
            folderRestriction([inboxFolderId]),
            focusedViewFilterRestriction([FocusedViewFilter.Other]),
            listRestrictionType(ListRestrictionType.WithItems),
            itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection),
            tableQueryTypeRestriction([TableQueryType.Search], true),
            selectionRestriction([SelectionRestrictionType.HasRealSelection]),
        ]),

        // Show move to Other inbox menu item
        // - when in Focused inbox
        // - and list view has items
        // - and list view has selection
        // - and when not in search
        [MenuItemType.MoveToOtherInbox]: shouldShowMenuItem([
            folderRestriction([inboxFolderId]),
            focusedViewFilterRestriction([FocusedViewFilter.Focused]),
            itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection),
            listRestrictionType(ListRestrictionType.WithItems),
            tableQueryTypeRestriction([TableQueryType.Search], true),
            selectionRestriction([SelectionRestrictionType.HasRealSelection]),
        ]),

        // Show always move to Focused inbox menu item
        // - when not in search
        // - list view has items
        // - and list view has single selection
        // - is in Other inbox
        [MenuItemType.AlwaysMoveToFocusedInbox]: shouldShowMenuItem([
            folderRestriction([inboxFolderId]),
            focusedViewFilterRestriction([FocusedViewFilter.Other]),
            itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection),
            listRestrictionType(ListRestrictionType.WithItems),
            tableQueryTypeRestriction([TableQueryType.Search], true),
            selectionRestriction([SelectionRestrictionType.SingleSelection]),
        ]),

        // Show always move to Other inbox menu item
        // - is in Focused inbox
        // - and list view has items
        // - and list view has single selection
        // - and when not in search
        [MenuItemType.AlwaysMoveToOtherInbox]: shouldShowMenuItem([
            folderRestriction([inboxFolderId]),
            focusedViewFilterRestriction([FocusedViewFilter.Focused]),
            itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection),
            listRestrictionType(ListRestrictionType.WithItems),
            tableQueryTypeRestriction([TableQueryType.Search], true),
            selectionRestriction([SelectionRestrictionType.SingleSelection]),
        ]),

        [MenuItemType.UpNext]: shouldShowMenuItem([
            mailboxRestriction([MailboxType.GroupMBX], true),
        ]),

        // Show Print menu
        // - in all folders except draft folder and recoverable items view
        // - and list view has single selection
        // - in 'Notes' folder unless 'notes-folder-view' flight is enabled
        [MenuItemType.Print]: shouldShowMenuItem([
            itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection),
            folderRestriction([draftsFolderId, ...dumpsterFolderIds, notesFolderId], true),
            selectionRestriction([SelectionRestrictionType.SingleSelection]),
            staticFolderSearchScopeRestriction(dumpsterFolderIds, true),
        ]),

        // Show "Translate" menu
        // - in all folders except draft folder and recoverable items view
        // - and list view has single selection
        [MenuItemType.Translate]: shouldShowMenuItem([
            folderRestriction([draftsFolderId, notesFolderId, ...dumpsterFolderIds], true),
            mailboxRestriction([MailboxType.GroupMBX], true),
            itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection),
            selectionRestriction([SelectionRestrictionType.SingleSelection]),
            readingPaneRestrictionType(ReadingPaneRestrictionType.Right),
            staticFolderSearchScopeRestriction([notesFolderId], true),
            customRestriction(() => {
                return isFeatureEnabled('gsx-translator-translateMessage') && isTranslatorEnabled();
            }),
        ]),

        // Show "Show in immersive reader" menu
        // - list view has single selection
        // - not in recoverable items view
        [MenuItemType.ShowInImmersiveReader]: shouldShowMenuItem([
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection),
            selectionRestriction([SelectionRestrictionType.SingleSelection]),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(() => {
                return isFeatureEnabled('rp-immersiveReader');
            }),
        ]),

        // Show "Open in new tab" menu
        // - list view has single or multiple real selection
        // - not in recoverable items view
        [MenuItemType.OpenInNewTab]: shouldShowMenuItem([
            folderRestriction(dumpsterFolderIds, true),
            itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection),
            selectionRestriction([
                SelectionRestrictionType.SingleSelection,
                SelectionRestrictionType.MultipleRealSelection,
            ]),
            staticFolderSearchScopeRestriction(dumpsterFolderIds, true),
        ]),

        // Show assign policy if
        // - not in recoverable items view
        // - list view has a only a single selection
        [MenuItemType.AssignPolicy]: shouldShowMenuItem([
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(
                () =>
                    !isMultipleItemPartSelection() &&
                    selectionRestriction([SelectionRestrictionType.SingleSelection])()
            ),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(() => {
                if (isConsumer()) {
                    return false;
                }

                const tableView = getSelectedTableView();
                if (tableView && isGroupTableQuery(tableView.tableQuery)) {
                    const getRetentionPolicyTagListForGroupTableQuery = lazyGetRetentionPolicyTagListForGroupTableQuery.tryImportForRender();
                    const retentionTagsList = getRetentionPolicyTagListForGroupTableQuery
                        ? getRetentionPolicyTagListForGroupTableQuery(tableView.tableQuery)
                        : [];

                    return retentionTagsList && retentionTagsList.length > 0;
                }

                return mailboxRestriction([MailboxType.ShadowMBX], true)();
            }),
        ]),

        // Enable ribbon assign policy if
        // - not in recoverable items view
        // - has a selection
        [MenuItemType.Ribbon_AssignPolicy]: shouldShowMenuItem([
            folderRestriction([notesFolderId, ...dumpsterFolderIds], true),
            selectionRestriction([SelectionRestrictionType.HasAnySelection]),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(() => {
                if (isConsumer()) {
                    return false;
                }

                const tableView = getSelectedTableView();
                if (tableView && isGroupTableQuery(tableView.tableQuery)) {
                    const getRetentionPolicyTagListForGroupTableQuery = lazyGetRetentionPolicyTagListForGroupTableQuery.tryImportForRender();
                    const retentionTagsList = getRetentionPolicyTagListForGroupTableQuery
                        ? getRetentionPolicyTagListForGroupTableQuery(tableView.tableQuery)
                        : [];

                    return retentionTagsList && retentionTagsList.length > 0;
                }

                return mailboxRestriction([MailboxType.ShadowMBX], true)();
            }),
        ]),

        // Show "Find email messages from sender" menu
        [MenuItemType.FindEmailFromSender]: shouldShowMenuItem([
            folderRestriction([...dumpsterFolderIds, sentItemsFolderId, draftsFolderId], true),
            listViewTypeRestrictionType(ListViewTypeRestrictionType.Message),
            customRestriction(() => {
                return (
                    !isMultipleItemPartSelection() &&
                    selectionRestriction([SelectionRestrictionType.SingleSelection])() &&
                    doesSingleSelectionHasSmtp()
                );
            }),
        ]),

        // Show "View Message Details" menu
        // - we are in an items view
        // - or in conversations menu but with one item
        // - not in sent folders or drafts folder as there is nothing to show there.
        [MenuItemType.ViewMessageDetails]: shouldShowMenuItem([
            folderRestriction([sentItemsFolderId, draftsFolderId], true),
            selectionRestriction([SelectionRestrictionType.SingleSelection]),
            customRestriction(() => {
                const tableView = getSelectedTableView();
                const rowKeys = [...tableView.selectedRowKeys.keys()];
                const rowId = MailRowDataPropertyGetter.getItemIds(rowKeys[0], tableView);
                return (
                    (listViewTypeRestrictionType(ListViewTypeRestrictionType.Conversation)() &&
                        rowId.length === 1) ||
                    listViewTypeRestrictionType(ListViewTypeRestrictionType.Message)()
                );
            }),
        ]),

        // Show customize toolbar menu items
        // - in all folders except the ones in the restriction list
        // - and not in archive group or shared mbx
        // - and list view has real selection
        [MenuItemType.CustomizeToolbar]: shouldShowMenuItem([
            folderRestriction(
                [
                    draftsFolderId,
                    sentItemsFolderId,
                    clutterFolderId,
                    junkFolderId,
                    deletedItemsFolderId,
                    archiveFolderId,
                    notesFolderId,
                    ...dumpsterFolderIds,
                ],
                true
            ),
            mailboxRestriction(
                [MailboxType.ArchiveMBX, MailboxType.GroupMBX, MailboxType.SharedFolderMBX],
                true
            ),
            itemPartSelectionRestrictionType(ItemPartSelectionRestrictionType.NoSelection),
            selectionRestriction([SelectionRestrictionType.HasRealSelection]),
            searchScopeRestriction(
                [SearchScopeKind.ArchiveMailbox, SearchScopeKind.SharedFolders],
                true
            ),
            staticFolderSearchScopeRestriction([notesFolderId, ...dumpsterFolderIds], true),
            customRestriction(() => {
                return (
                    getIsViewModeSelected(CommandingViewMode.CommandBar) &&
                    isFeatureEnabled('tri-commandBarCustomization') &&
                    !isBrowserIE()
                );
            }),
        ]),
    };
}

function shouldShowRibbon_IgnoreStopIgnore(): boolean {
    const shouldShowBehaviorMap = getMailMenuItemShouldShowMap();
    return (
        shouldShowBehaviorMap[MenuItemType.Ignore]() ||
        shouldShowBehaviorMap[MenuItemType.StopIgnoring]()
    );
}

function shouldShowRibbon_JunkNotJunk(): boolean {
    const shouldShowBehaviorMap = getMailMenuItemShouldShowMap();
    return (
        shouldShowBehaviorMap[MenuItemType.MarkAsJunk]() ||
        shouldShowBehaviorMap[MenuItemType.JunkEmailSafetyAction]()
    );
}

function shouldShowRibbon_Sweep(): boolean {
    const shouldShowBehaviorMap = getMailMenuItemShouldShowMap();
    return (
        shouldShowBehaviorMap[MenuItemType.Sweep]() &&
        !isFolderPaused(getSelectedTableView().tableQuery.folderId)
    );
}

function shouldShowRibbon_Delete(): boolean {
    const shouldShowBehaviorMap = getMailMenuItemShouldShowMap();
    return (
        shouldShowBehaviorMap[MenuItemType.Delete]() &&
        !getMailMenuItemShouldDisable(MenuItemType.Delete)
    );
}

/**
 * Returns true if we are currently showing Folder type table for mail scenario
 */
function isMailFolderTableShown(): boolean {
    const tableView = getSelectedTableView();
    return (
        tableView.tableQuery.type == TableQueryType.Folder &&
        (tableView.tableQuery as MailFolderTableQuery).scenarioType == 'mail'
    );
}

/**
 * Returns true for reply, reply all, forward if they are enabled for selected row.
 * This function needs to work for both Message and Conversation view.
 * This function assumes only single selection.
 */
function checkItemReplyReplyAllForwardRestrictions(isConversationItemPart: boolean): boolean[] {
    let [isReplyDisabled, isReplyAllDisabled, isForwardDisabled] = [false, false, false];
    let item: Message;

    const rowKey = getSingleSelectedRowKey();
    if (!rowKey) {
        // Return if no selection or multi selection
        return [!isReplyDisabled, !isReplyAllDisabled, !isForwardDisabled];
    }

    if (isItemPartOperation()) {
        // Conversation view
        const itemId = getSelectedItemParts()[0]; // [0] for single selection
        item = getItemForMailList(itemId, isFirstLevelExpanded(rowKey));
    } else {
        // Mail list view
        item = MailRowDataPropertyGetter.getItem(rowKey, getSelectedTableView());
    }

    [isReplyDisabled, isReplyAllDisabled, isForwardDisabled] = checkItemReplyForwardDisabled(
        item,
        isConversationItemPart
    );

    return [!isReplyDisabled, !isReplyAllDisabled, !isForwardDisabled];
}

/**
 * Returns a flag indicating whether the current selected folder is not a "Archive"
 * folder for a shadow mail box
 */
function isNotArchiveInShadowMailbox(selectedFolderDistinguishedId: string): boolean {
    const selectedDistinguishedFolder = folderStore.folderTable.get(
        folderNameToId(selectedFolderDistinguishedId)
    );

    // if both selectedDistinguishedFolder and sourceWellKnownFolderType are present
    // return true if the sourceWellKnownFolderType is not of type Archive.
    if (selectedDistinguishedFolder?.sourceWellKnownFolderType) {
        return (
            selectedDistinguishedFolder.sourceWellKnownFolderType !==
            SourceWellKnownFolderType.Archive
        );
    }

    // else return true
    return true;
}

/**
 * Returns true if list view has single selected row and it is read
 */
function isSingleSelectedRowRead() {
    const singleSelectedRowKey = getSingleSelectedRowKey();
    if (!singleSelectedRowKey) {
        // False when there is no selection or multiple selection
        return false;
    }

    const unreadCount = MailRowDataPropertyGetter.getUnreadCount(
        singleSelectedRowKey,
        getSelectedTableView()
    );

    return unreadCount === 0;
}

function isAnySelectedItemPartUnread(): boolean {
    if (!isItemPartOperation()) {
        return false;
    }

    const selectedItempartItemIds: string[] = getSelectedItemParts();
    for (const itemId of selectedItempartItemIds) {
        const item = getItemForMailList(itemId, isFirstLevelExpanded(getSingleSelectedRowKey()));
        if (!item?.IsRead) {
            return true;
        }
    }

    return false;
}

function isAnySelectedItemPartRead(): boolean {
    if (!isItemPartOperation()) {
        return false;
    }

    const selectedItempartItemIds: string[] = getSelectedItemParts();
    for (const itemId of selectedItempartItemIds) {
        const item = getItemForMailList(itemId, isFirstLevelExpanded(getSingleSelectedRowKey()));
        if (item?.IsRead) {
            return true;
        }
    }

    return false;
}

function isAnySelectedItemPartUnflagged(): boolean {
    if (!isItemPartOperation()) {
        return false;
    }

    const selectedItempartItemIds: string[] = getSelectedItemParts();
    for (const itemId of selectedItempartItemIds) {
        const item = getItemForMailList(itemId, isFirstLevelExpanded(getSingleSelectedRowKey()));
        if (item?.Flag?.FlagStatus !== 'Flagged') {
            return true;
        }
    }

    return false;
}

function isAnySelectedItemPartFlagged(): boolean {
    if (!isItemPartOperation()) {
        return false;
    }

    const selectedItempartItemIds: string[] = getSelectedItemParts();
    for (const itemId of selectedItempartItemIds) {
        const item = getItemForMailList(itemId, isFirstLevelExpanded(getSingleSelectedRowKey()));
        if (item?.Flag?.FlagStatus === 'Flagged') {
            return true;
        }
    }

    return false;
}

function isMultipleItemPartSelection(): boolean {
    return isItemPartOperation() && getSelectedItemParts().length > 1;
}
/**
 * Returns true if row in message view is unread or all itemparts in conversation view are unread
 */
function isSingleSelectedRowFullyUnread() {
    const singleSelectedRowKey = getSingleSelectedRowKey();
    if (!singleSelectedRowKey) {
        // False when there is no selection or multiple selection
        return false;
    }
    const tableConversationRelation = getTableConversationRelation(
        singleSelectedRowKey,
        getSelectedTableView()?.id
    );
    // In message view, tableConversationRelation is not defined or null.
    if (!tableConversationRelation) {
        const unreadCount = MailRowDataPropertyGetter.getUnreadCount(
            singleSelectedRowKey,
            getSelectedTableView()
        );
        return unreadCount != 0;
    }

    const localItemIds = tableConversationRelation.itemIds;
    const maxPossibleUnreadCount = localItemIds.length;
    return tableConversationRelation.unreadCount === maxPossibleUnreadCount;
}

/**
 * Returns true if list view has single selected row and it is flagged
 */
function isSingleSelectedRowFlagged() {
    const singleSelectedRowKey = getSingleSelectedRowKey();
    if (!singleSelectedRowKey) {
        // False when there is no selection or multiple selection
        return false;
    }

    const flagStatus = MailRowDataPropertyGetter.getFlagStatus(
        singleSelectedRowKey,
        getSelectedTableView()
    );

    return flagStatus == 'Flagged';
}

/**
 * Returns true if list view has single selected row and it is pinned
 */
function isSingleSelectedRowPinned(): boolean {
    const singleSelectedRowKey = getSingleSelectedRowKey();
    if (!singleSelectedRowKey) {
        // False when there is no selection or multiple selection
        return false;
    }

    return MailRowDataPropertyGetter.getIsPinned(singleSelectedRowKey, getSelectedTableView());
}

/**
 * Returns true if single selected row data has smtp address
 */
function doesSingleSelectionHasSmtp(): boolean {
    const singleSelectedRowKey = getSingleSelectedRowKey();
    if (!singleSelectedRowKey) {
        // Hide 'Block' when there is no selection or multiple selection
        return false;
    }

    return !!MailRowDataPropertyGetter.getLastSenderSMTP(
        singleSelectedRowKey,
        getSelectedTableView()
    );
}

/**
 * Returns true if single selected row belongs to a folder where Snooze/UnSnooze is
 * supported.
 *
 * @param allowedFolders List of folders where Snooze/UnSnooze is supported
 */
function isSingleSelectedRowSnoozable(allowedFolders: string[]): boolean {
    const singleSelectedRowKey = getSingleSelectedRowKey();
    if (!singleSelectedRowKey) {
        return false;
    }

    const parentFolderId = MailRowDataPropertyGetter.getParentFolderId(
        singleSelectedRowKey,
        getSelectedTableView()
    );

    for (let allowedFolderId of allowedFolders) {
        if (parentFolderId === folderNameToId(allowedFolderId)) {
            return true;
        }
    }

    return false;
}

/**
 * Returns true if single selected row belongs to a folder where pin/unpin is
 * supported.
 *
 * @param restrictedFolderIds List of folders where pin/unpin is not supported
 */
function isSingleSelectedRowPinnable(restrictedFolderIds: string[]): boolean {
    const singleSelectedRowKey = getSingleSelectedRowKey();
    if (!singleSelectedRowKey) {
        return false;
    }

    const parentFolderId = MailRowDataPropertyGetter.getParentFolderId(
        singleSelectedRowKey,
        getSelectedTableView()
    );

    for (let restrictedFolderId of restrictedFolderIds) {
        if (parentFolderId === folderNameToId(restrictedFolderId)) {
            return false;
        }
    }

    return true;
}

/**
 * Returns the single selected mail list row id in list view, null if otherwise
 */
function getSingleSelectedRowKey(): string {
    const selectedRowKeys = [...getSelectedTableView().selectedRowKeys.keys()];
    return selectedRowKeys.length == 1 ? selectedRowKeys[0] : null;
}

/**
 * Function return user assigned permission for the given folderId and user email address
 * If no permissions are present for user then return undefined
 * If there is no value in store for PermissionSet or Permissions then let the function throw error implicitly
 * @param folderId - folder for which the permissions will be calculated
 * @param userEmailAddress - user email for which permissions will be filtered
 */
function getUserPermissionForFolderIdWithErr(
    folderId: string,
    userEmailAddress: string
): Permission {
    return mailStoreGetUserPermissionForFolderIdWithErr(folderId, userEmailAddress);
}

/**
 * This function is wrapper over getUserPermissionForFolderIdWithErr function that can handle error.
 * In case of error this function will return null to denote that there are no permissions.
 * @param folderId - folder for which the permissions will be calculated
 * @param userEmailAddress - user email for which permissions will be filtered
 */
export function getUserPermissionForFolderId(
    folderId: string,
    userEmailAddress: string
): Permission {
    return mailStoreGetUserPermissionForFolderId(folderId, userEmailAddress);
}

/**
 * Function checks if the user is given shared folder permission to delete, move or flag items
 * If permissions are present but they are empty then assume user has all permissions
 * If Permissions are not present in store then throw custom error
 * @param actionType - Menu item type for which permission will be calculated
 * @param externalFolderId - Folder id provided externally to this function for which permissions will be checked
 */
export function doesUserHaveSharedFolderPermissionForWithError(
    actionType: MenuItemType,
    externalFolderId?: string
): boolean {
    // If folder Id is not provided in argument then get the selected folder node
    const folderId = externalFolderId || getFolderIdFromTableView(getSelectedTableView());
    const isSharedFolder = isFolderInMailboxType(folderId, 'SharedMailbox');

    // If not shared folder show all triage options
    if (!isSharedFolder) {
        return true;
    }
    const userEmail = getUserConfiguration().SessionSettings.UserEmailAddress;

    // Try getting permissions by calling getUserPermissionForFolderIdWithErr.
    // If there is error then call getFolderData to get this shared folder's permissions.
    // And throw error for the consumer of this function indicating that permissions are currently not present.
    try {
        const assignedFolderPermission: Permission = getUserPermissionForFolderIdWithErr(
            folderId,
            userEmail
        );
        return doesUserHaveActionPermission(actionType, assignedFolderPermission);
    } catch (e) {
        getFolderData(folderId);
        throw new Error(
            'Move-To Error: Permissions for destination folder have not been fetched yet'
        );
    }
}

/**
 * Function checks if the user has correct permissions to do certain triage actions
 * @param actionType - Menu item type for which permission will be calculated
 * @param assignedFolderPermission - the folder permission object
 */
export function doesUserHaveActionPermission(
    actionType: MenuItemType,
    assignedFolderPermission: Permission
): boolean {
    // If permission object is null it means all permissions assigned
    if (!assignedFolderPermission) {
        return true;
    }

    switch (actionType) {
        // Show Move to and Delete options if
        // - User has delete all permission
        case MenuItemType.Move:
        case MenuItemType.Copy:
        case MenuItemType.Delete:
            return assignedFolderPermission.DeleteItems === 'All';

        // Show flag and categories options if
        // - User has edit all permission
        case MenuItemType.Flag:
        case MenuItemType.Unflag:
        case MenuItemType.Categories:
            return assignedFolderPermission.EditItems === 'All';
    }

    return false;
}

/**
 * This function is a wrapper over doesUserHaveSharedFolderPermissionForWithError
 * This function assumes that if permissions data is not fetched yet then automatically permission is provided
 * @param actionType - Menu item type for which permission will be calculated
 */
export function doesUserHaveSharedFolderPermissionFor(actionType: MenuItemType): boolean {
    try {
        return doesUserHaveSharedFolderPermissionForWithError(actionType, null /* folderId */);
    } catch (e) {
        return true;
    }
}
