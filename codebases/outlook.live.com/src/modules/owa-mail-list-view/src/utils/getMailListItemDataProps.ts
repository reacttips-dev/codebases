import getCleanPreview from './getCleanPreview';
import type MailListItemDataProps from './types/MailListItemDataProps';
import type MailListTableProps from './types/MailListTableProps';
import { logUsage } from 'owa-analytics';
import { isFeatureEnabled } from 'owa-feature-flags';
import folderStore from 'owa-folders';
import type { MailFolder } from 'owa-graph-schema';
import loc from 'owa-localize';
import { noSubject } from 'owa-locstrings/lib/strings/nosubject.locstring.json';
import { unknownSenderOrRecipient } from 'owa-locstrings/lib/strings/unknownsenderorrecipient.locstring.json';
import { TAG_EMAIL_HASHTAG } from 'owa-mail-fetch-tagged-email';
import shouldAllowDelete from 'owa-mail-filterable-menu-behavior/lib/utils/shouldAllowDelete';
import getItemClassIcon from 'owa-mail-list-actions/lib/utils/conversationProperty/getItemClassIcon';
import doesConversationHaveDrafts from 'owa-mail-list-actions/lib/utils/doesConversationHaveDrafts';
import {
    isSecondLevelExpanded,
    isFirstLevelExpanded,
} from 'owa-mail-list-store/lib/selectors/isConversationExpanded';
import { doesRowBelongToNudgeSection, getNudgedReason } from 'owa-mail-nudge-store';
import isMessageUnauthenticated from 'owa-mail-sender-persona-view/lib/utils/isMessageUnauthenticated';
import { isSpotlightItem } from 'owa-mail-spotlight';
import { ClientItem, mailStore } from 'owa-mail-store';
import { externalInOutlookEnabled } from 'owa-nonboot-userconfiguration-manager';
import type Message from 'owa-service/lib/contract/Message';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import getSmimeType, { getSmimeTypeForConversation } from 'owa-smime/lib/utils/getSmimeType';
import * as trace from 'owa-trace';
import {
    getUserCategoryName,
    getTableConversationRelation,
    isFavoritesSearchFolderScenario,
    isItemOfMessageType,
    listViewStore,
    MailRowDataPropertyGetter,
    TableView,
    MailFolderTableQuery,
    TableQuery,
    MailFolderScenarioType,
    TableQueryType,
} from 'owa-mail-list-store';

export default function getMailListItemDataProps(
    rowKey: string,
    mailListTableProps: MailListTableProps
): MailListItemDataProps {
    const tableView = listViewStore.tableViews.get(mailListTableProps.tableViewId);
    const listViewType = tableView.tableQuery.listViewType;
    const isNudged = doesRowBelongToNudgeSection(
        rowKey,
        tableView.id,
        MailRowDataPropertyGetter.getLastDeliveryOrRenewTimeStamp(rowKey, tableView)
    );
    // VSO 20477: Combine getMailListItemPropsForConversation and getMailListItemPropsForItem
    switch (listViewType) {
        case ReactListViewType.Conversation:
            return getMailListItemPropsForConversation(
                rowKey,
                tableView,
                mailListTableProps,
                isNudged
            );
        case ReactListViewType.Message:
            return getMailListItemPropsForItem(rowKey, tableView, mailListTableProps, isNudged);

        default:
            trace.trace.warn('Not supported listViewType:' + listViewType);
            return null;
    }
}

function getMailListItemPropsForItem(
    rowKey: string,
    tableView: TableView,
    mailListTableProps: MailListTableProps,
    isNudged: boolean
): MailListItemDataProps {
    if (!rowKey) {
        throw new Error('getMailListItemPropsForItem: ItemId should be present for given rowKey');
    }

    const rowId = MailRowDataPropertyGetter.getRowIdString(rowKey, tableView);
    const item = mailStore.items.get(rowId);
    if (!item) {
        trace.errorThatWillCauseAlert('getMailListItemDataProps: item does not exist in cache.');
        return null;
    }

    if (!item.ParentFolderId) {
        trace.errorThatWillCauseAlert('getMailListItemDataProps: item.ParentFolderId is null.');
    }

    let message;

    if (isItemOfMessageType(item)) {
        message = item as Message;
    } else {
        message = null;
    }

    const userConfiguration = getUserConfiguration();

    // Calculate first two line displays
    const isItemPinned = MailRowDataPropertyGetter.getIsPinned(rowKey, tableView);
    const subject = item.Subject ? item.Subject : loc(noSubject);
    const draftsId = folderNameToId('drafts');
    const notesFolderId = folderNameToId('notes');
    const archiveFolderId = folderNameToId('archive');
    const isDraftsFolder = tableView.tableQuery.folderId == draftsId;
    const parentFolderId = item.ParentFolderId?.Id;
    const isItemInDraftsFolder = isDraftsFolder || parentFolderId == draftsId;
    const isItemInSentItemsFolder = checkIfItemInSentItemsFolder(tableView, parentFolderId);
    const isItemInNotesFolder =
        tableView.tableQuery.folderId == notesFolderId || parentFolderId == notesFolderId;
    const isItemInArchiveFolder =
        tableView.tableQuery.folderId == archiveFolderId || parentFolderId == archiveFolderId;
    const isGroupItem = tableView.tableQuery.type == TableQueryType.Group;

    let senderName = message?.From?.Mailbox?.Name || '';

    //Canceled appointments (type IPM.Appointment) can have an empty sender name.
    //So we will show the recipients and senders. In parity.
    if (!senderName && isItemOfAppointmentType(item.ItemClass)) {
        senderName = item.DisplayTo;
    }

    const { sendersOrRecipients, singleLastSenderSMTP } = getSendersOrRecipients(
        [item.DisplayTo],
        [senderName],
        MailRowDataPropertyGetter.getLastSenderSMTP(rowKey, tableView),
        isItemInSentItemsFolder,
        isItemInDraftsFolder,
        mailListTableProps.isSearchNotInDraftOrSentItemFolder,
        tableView.tableQuery
    );
    let firstLineText: string;
    let firstLineTooltipText: string;
    let secondLineText: string;
    let secondLineTooltipText: string;

    let unreadCount = 0;
    if (message) {
        unreadCount = message.IsRead ? 0 : 1;
    }

    // Show pinned items rows in condensed view when
    // table supports it and
    // item is pinned
    // item is already read
    const showCondensedView =
        !isFeatureEnabled('mon-tri-readPinnedItems') &&
        mailListTableProps.showCondensedPinnedRows &&
        isItemPinned &&
        unreadCount === 0;

    // When in condensed view we only show subject of the row and render only first line.
    // Therefore we assign subject to first (top) line regardless of the user setting.
    const shouldShowSenderOnTop =
        userConfiguration.UserOptions.ShowSenderOnTopInListView && !showCondensedView;

    if (
        mailListTableProps.isSingleLine ||
        shouldShowSenderOnTop ||
        isDraftsFolder // When in Drafts folder we always show recipients on the first line irrespective of user's settings
    ) {
        firstLineText = sendersOrRecipients;
        firstLineTooltipText = singleLastSenderSMTP;
        secondLineText = subject;
        secondLineTooltipText = null;
    } else {
        secondLineText = sendersOrRecipients;
        secondLineTooltipText = singleLastSenderSMTP;
        firstLineText = subject;
        firstLineTooltipText = null;
    }

    const scenarioType = (tableView.tableQuery as MailFolderTableQuery).scenarioType;

    const shouldShowAsSpotlight = shouldShowAsSpotlight_0(scenarioType, rowKey, tableView);

    // Do not populate preview text if preview is disabled
    const previewText = userConfiguration.UserOptions.ShowPreviewTextInListView
        ? getCleanPreview(item.Preview)
        : null;

    const thirdLineText = getThirdLineText(previewText, isNudged, rowKey);

    // We make the assumption that if a ReceivedOrRenewTime != DateTimeReceived the item must either be pinned or snoozed.
    // If the item has a return time or is NOT pinned and has the above inequality, we will mark the item as snoozed.
    const isSnoozed =
        mailListTableProps.supportsSnooze &&
        (!!item.ReturnTime ||
            (!isItemPinned &&
                item.ReceivedOrRenewTime &&
                !isTimestampEqual(item.ReceivedOrRenewTime, item.DateTimeReceived)));

    const isTaggedForBigScreen = item.Hashtags && item.Hashtags.indexOf(TAG_EMAIL_HASHTAG) >= 0;
    const itemClassIcon = getItemClassIcon([item.ItemClass], item.IconIndex, false /* hasIrm */);

    const showAttachmentPreviews =
        userConfiguration.UserOptions.ShowInlinePreviews && item.shouldShowAttachmentPreviews;

    return {
        canDelete: shouldAllowDelete(tableView),
        categories: getCategoriesToShow(tableView, item.Categories),
        conversationId: item.ConversationId?.Id,
        effectiveMentioned: item.MentionedMe,
        firstLineText: firstLineText,
        firstLineTooltipText: firstLineTooltipText,
        hasAttachment: item.HasAttachments,
        importance: item.Importance,
        isComplete: item.Flag ? item.Flag.FlagStatus === 'Complete' : false, // item.Flag could be undefined in search results
        isFlagged: item.Flag ? item.Flag.FlagStatus === 'Flagged' : false, // item.Flag could be undefined in search results
        isPinned: isItemPinned,
        isNudged: isNudged,
        isSelected: tableView.selectedRowKeys.has(rowKey),
        itemClassIcon: itemClassIcon,
        lastDeliveryTimestamp: isDraftsFolder
            ? item.LastModifiedTime
            : isItemInSentItemsFolder
            ? item.DateTimeSent
            : item.DateTimeReceived,
        lastSender: message?.From,
        latestItemId: item.ItemId?.Id,
        likeCount: message?.LikeCount ? message.LikeCount : null,
        parentFolderId: parentFolderId,
        rowId: rowId,
        rowKey: rowKey,
        secondLineText: secondLineText,
        secondLineTooltipText: secondLineTooltipText,
        showAttachmentPreview: showAttachmentPreviews,
        isUnauthenticatedSender: message && isMessageUnauthenticated(message),
        isSnoozed: isSnoozed,
        returnTime: getItemReturnTime(item, isSnoozed),
        showCondensedView: showCondensedView,
        showDraftsIndicator: item.IsDraft,
        subject: subject,
        thirdLineText: thirdLineText,
        unreadCount: unreadCount,
        validCouponIndexes: item.validCouponIndexes,
        smimeType: getSmimeType(item),
        sendersOrRecipients: sendersOrRecipients,
        shouldShowTwisty: false,
        isInNotesFolder: isItemInNotesFolder,
        isInArchiveFolder: isItemInArchiveFolder,
        shouldShowRSVP: item.shouldShowRSVP,
        shouldShowAsSpotlight: shouldShowAsSpotlight,
        shouldShowTxpButton: !item.shouldShowRSVP && item.shouldShowTxpButton,
        shouldShowUnsubscribe: !item.shouldShowTxpButton,
        shouldShowExternalLabel: item.IsExternalSender && externalInOutlookEnabled(),
        hasSharepointLink: item.HasProcessedSharepointLink,
        canPin: canPin(tableView, mailListTableProps.supportsPinning, parentFolderId),
        isInGroup: isGroupItem,
        isTaggedForBigScreen: isTaggedForBigScreen,
    };
}

function getMailListItemPropsForConversation(
    rowKey: string,
    tableView: TableView,
    mailListTableProps: MailListTableProps,
    isNudged: boolean
): MailListItemDataProps {
    const tableConversationRelation = getTableConversationRelation(rowKey, tableView.id);
    const rowId = tableConversationRelation.id;
    const conversationItem = listViewStore.conversationItems.get(rowId);
    const userConfiguration = getUserConfiguration();

    if (!conversationItem) {
        // Converting exception to trace error here to prevent app crash.
        // VSO 25058: Investigate why conversationItem not found in store in getMailListItemDataProps
        const sort = (tableView.tableQuery as MailFolderTableQuery).sortBy.sortColumn;
        logUsage('ConversationNotFound', { sort });
        trace.trace.warn('getProps Conversation not found in store. sortColumn ' + sort);
        return null;
    }

    // Get item status
    const isComplete = tableConversationRelation.flagStatus === 'Complete';
    const isPinned = MailRowDataPropertyGetter.getIsPinned(rowKey, tableView);
    const isFlagged = tableConversationRelation.flagStatus === 'Flagged';
    const effectiveMentioned = tableConversationRelation.effectiveMentioned;

    // Calculate first two line displays
    const subject = conversationItem.subject ? conversationItem.subject : loc(noSubject);
    const draftsId = folderNameToId('drafts');
    const notesFolderId = folderNameToId('notes');
    const archiveFolderId = folderNameToId('archive');
    const isDraftsFolder = tableView.tableQuery.folderId == draftsId;
    const parentFolderId = tableConversationRelation.parentFolderId;
    const isItemInDraftsFolder = isDraftsFolder || parentFolderId == draftsId;
    const isItemInSentItemsFolder = checkIfItemInSentItemsFolder(tableView, parentFolderId);
    const isItemInNotesFolder =
        tableView.tableQuery.folderId == notesFolderId || parentFolderId == notesFolderId;
    const isItemInArchiveFolder =
        tableView.tableQuery.folderId == archiveFolderId || parentFolderId == archiveFolderId;
    const isGroupItem = tableView.tableQuery.type == TableQueryType.Group;

    const { sendersOrRecipients, singleLastSenderSMTP } = getSendersOrRecipients(
        tableConversationRelation.uniqueRecipients,
        tableConversationRelation.uniqueSenders,
        MailRowDataPropertyGetter.getLastSenderSMTP(rowKey, tableView),
        isItemInSentItemsFolder,
        isItemInDraftsFolder,
        mailListTableProps.isSearchNotInDraftOrSentItemFolder,
        tableView.tableQuery
    );
    const unreadCount = tableConversationRelation.unreadCount;
    // Show conversation row in condensed view when
    // table supports condensed view
    // they are pinned and
    // not expanded
    // items are all read
    const showCondensedView =
        !isFeatureEnabled('mon-tri-readPinnedItems') &&
        mailListTableProps.showCondensedPinnedRows &&
        isPinned &&
        !(isSecondLevelExpanded(rowKey) || isFirstLevelExpanded(rowKey)) &&
        unreadCount === 0;

    // When in condensed view we only show subject of the row and render only first line.
    // Therefore we assign subject to first (top) line regardless of the user setting.
    const shouldShowSenderOnTop =
        userConfiguration.UserOptions.ShowSenderOnTopInListView && !showCondensedView;

    let firstLineText: string;
    let firstLineTooltipText: string;
    let secondLineText: string;
    let secondLineTooltipText: string;

    if (
        mailListTableProps.isSingleLine ||
        shouldShowSenderOnTop ||
        isDraftsFolder // When in Drafts folder we always show recipients on the first line irrespective of user's settings
    ) {
        firstLineText = sendersOrRecipients;
        firstLineTooltipText = singleLastSenderSMTP;
        secondLineText = subject;
        secondLineTooltipText = null;
    } else {
        secondLineText = sendersOrRecipients;
        secondLineTooltipText = singleLastSenderSMTP;
        firstLineText = subject;
        firstLineTooltipText = null;
    }

    const scenarioType = (tableView.tableQuery as MailFolderTableQuery).scenarioType;

    const shouldShowAsSpotlight = shouldShowAsSpotlight_0(scenarioType, rowKey, tableView);

    // Do not populate preview text if preview is disabled
    const previewText = userConfiguration.UserOptions.ShowPreviewTextInListView
        ? getCleanPreview(tableConversationRelation.previewText)
        : null;

    const thirdLineText = getThirdLineText(previewText, isNudged, rowKey);

    // Add [Drafts] indicator if the conversation has any drafts
    const showDraftsIndicator =
        doesConversationHaveDrafts(tableConversationRelation) || isItemInDraftsFolder;

    const showAttachmentPreviews =
        userConfiguration.UserOptions.ShowInlinePreviews &&
        conversationItem.shouldShowAttachmentPreviews;

    // We make the assumption that if a lastDeliveryOrRenewTimeStamp != lastDeliveryTimeStamp the conversation must either be pinned or snoozed.
    // If the conversation has a return time or is NOT pinned and has the above inequality, we will mark the conversation as snoozed.
    const isSnoozed =
        mailListTableProps.supportsSnooze &&
        (!!tableConversationRelation.returnTime ||
            (!isPinned &&
                !isTimestampEqual(
                    tableConversationRelation.lastDeliveryOrRenewTimeStamp,
                    tableConversationRelation.lastDeliveryTimeStamp
                )));
    const itemClassIcon = getItemClassIcon(
        tableConversationRelation.itemClasses,
        tableConversationRelation.iconIndex,
        tableConversationRelation.hasIrm
    );

    return {
        rowKey: rowKey,
        rowId: rowId,
        conversationId: rowId,
        firstLineText: firstLineText,
        firstLineTooltipText: firstLineTooltipText,
        secondLineText: secondLineText,
        secondLineTooltipText: secondLineTooltipText,
        thirdLineText: thirdLineText,
        isComplete: isComplete,
        isFlagged: isFlagged,
        isPinned: isPinned,
        isNudged: isNudged,
        isSelected: tableView.selectedRowKeys.has(rowKey),
        canDelete: shouldAllowDelete(tableView),
        unreadCount: unreadCount,
        subject: subject,
        categories: getCategoriesToShow(tableView, tableConversationRelation.categories),
        lastSender: tableConversationRelation.lastSender,
        latestItemId: tableConversationRelation.itemIds[0],
        lastDeliveryTimestamp: isItemInSentItemsFolder
            ? tableConversationRelation.lastSentTimeStamp
            : tableConversationRelation.lastDeliveryTimeStamp,
        itemClassIcon: itemClassIcon,
        importance: tableConversationRelation.importance,
        hasAttachment: tableConversationRelation.hasAttachments,
        showDraftsIndicator: showDraftsIndicator,
        showAttachmentPreview: showAttachmentPreviews,
        validCouponIndexes: conversationItem.validCouponIndexes,
        effectiveMentioned: effectiveMentioned,
        parentFolderId: parentFolderId,
        likeCount: tableConversationRelation.globalLikeCount,
        isUnauthenticatedSender: false,
        isSnoozed: isSnoozed,
        returnTime: getTableConversationRelationReturnTime(tableConversationRelation, isSnoozed),
        showCondensedView: showCondensedView,
        smimeType: getSmimeTypeForConversation(tableConversationRelation.itemClasses),
        sendersOrRecipients: sendersOrRecipients,
        shouldShowTwisty: conversationItem.globalMessageCount > 1,
        shouldShowRSVP: tableConversationRelation.shouldShowRSVP,
        isInNotesFolder: isItemInNotesFolder,
        isInArchiveFolder: isItemInArchiveFolder,
        shouldShowAsSpotlight: shouldShowAsSpotlight,
        // Txp button priority is determined (though very unlikely) rsvp > txp > unsubscribe. Hence we
        // are adding a check with these respective buttons.
        shouldShowTxpButton:
            !tableConversationRelation.shouldShowRSVP && conversationItem.shouldShowTxpButton,
        shouldShowUnsubscribe: !conversationItem.shouldShowTxpButton,
        shouldShowExternalLabel: conversationItem.hasExternalEmails && externalInOutlookEnabled(),
        hasSharepointLink: conversationItem.hasSharepointLink,
        canPin: canPin(tableView, mailListTableProps.supportsPinning, parentFolderId),
        isInGroup: isGroupItem,
        isTaggedForBigScreen: tableConversationRelation.isTaggedForBigScreen,
    };
}

function getSendersOrRecipients(
    recipients: string[],
    uniqueSenders: string[],
    lastSenderSMTP: string,
    isItemInSentItemsFolder: boolean,
    isItemInDraftsFolder: boolean,
    isSearchNotInDraftOrSentItemFolder: boolean,
    tableQuery: TableQuery
): { sendersOrRecipients: string; singleLastSenderSMTP: string } {
    let sendersOrRecipients;
    let singleLastSenderSMTP;
    const { scenarioType } = tableQuery as MailFolderTableQuery;
    if (
        (isItemInSentItemsFolder || isItemInDraftsFolder) &&
        !isSearchNotInDraftOrSentItemFolder &&
        !isFavoritesSearchFolderScenario(scenarioType)
    ) {
        // Show recipients for conversations belonging to drafts and sentitems folders
        // EXCEPT when we are in a search scenario since we want the preview text, name, and circle persona to match
        sendersOrRecipients = recipients && recipients.join('; ');
        singleLastSenderSMTP = null;
    } else {
        sendersOrRecipients = uniqueSenders && uniqueSenders.join('; ');

        // Show tooltip text when there is single sender
        singleLastSenderSMTP = uniqueSenders && uniqueSenders.length === 1 ? lastSenderSMTP : null;
    }

    // If there are no senders or no recipients add a default string [Unknown]
    // For an item in a drafts folder user may not have defined any recipients
    // For items (in both sent & drafts) that do not have recipients in To: and
    // have recipients in Cc:/Bcc: we do not receive any recipients today from server.
    if (!sendersOrRecipients) {
        sendersOrRecipients = isItemInDraftsFolder ? '' : loc(unknownSenderOrRecipient);
    }

    return { sendersOrRecipients: sendersOrRecipients, singleLastSenderSMTP: singleLastSenderSMTP };
}

// Helper function to normalize and compare date times for isSnoozed calculation. This function is
// required to normalize times returned by search results with millisecond. For the present we will
// simply ignore milliseconds and assume the two times are equal when in search.
function isTimestampEqual(time1: string, time2: string) {
    return new Date(time1).setMilliseconds(0) == new Date(time2).setMilliseconds(0);
}

// Return item's return time IF the item has a defined return time. Otherwise, if we know
// item is snoozed and the return time does not exist (ex: in inbox), we will rely on RoRT.
function getItemReturnTime(item: ClientItem, isSnoozed: boolean) {
    return item.ReturnTime ? item.ReturnTime : isSnoozed ? item.ReceivedOrRenewTime : null;
}

// Return TCR's return time IF the TCR has a defined return time. Otherwise, if we know
// the TCR was snoozed and the return time does not exist (ex: in inbox), we will rely on LDoRT.
function getTableConversationRelationReturnTime(
    tableConversationRelation: MailRowDataPropertyGetter.TableViewConversationRelation,
    isSnoozed: boolean
) {
    return tableConversationRelation.returnTime
        ? tableConversationRelation.returnTime
        : isSnoozed
        ? tableConversationRelation.lastDeliveryOrRenewTimeStamp
        : null;
}

function checkIfItemInSentItemsFolder(tableView: TableView, parentFolderId: string): boolean {
    const sentItemsId = folderNameToId('sentitems');
    const folder: MailFolder = folderStore.folderTable.get(tableView.tableQuery.folderId);

    return (
        parentFolderId === sentItemsId || (folder && folder.DistinguishedFolderId === 'sentitems')
    );
}

// If user has selected a category node , we want to hide that category in the category list.
// This function removes a category given a category list.

function getCategoriesToShow(tableView: TableView, categories: string[]) {
    if (!categories || !isFeatureEnabled('tri-hideSameCategorytagInFavoriteCategory')) {
        return categories;
    }

    const categoryName = getUserCategoryName(tableView);

    if (!categoryName) {
        return categories;
    }

    let filteredCategories = [...categories];
    const categoryNameIndex = filteredCategories.indexOf(categoryName);

    if (categoryNameIndex > -1) {
        filteredCategories.splice(categoryNameIndex, 1);
    }

    return filteredCategories;
}

function getThirdLineText(previewText: string, isNudged: boolean, rowKey: string) {
    return isNudged ? getNudgedReason(rowKey) : previewText;
}

function shouldShowAsSpotlight_0(
    scenarioType: MailFolderScenarioType,
    rowKey: string,
    tableView: TableView
) {
    /**
     * Don't show Spotlight treatment in non "mail" or "spotlight" (Important
     * filter) scenarios.
     */
    if (scenarioType !== 'mail' && scenarioType !== 'spotlight') {
        return false;
    }

    // Don't show Spotlight treatment in search results.
    if (tableView.tableQuery.type === TableQueryType.Search) {
        return false;
    }

    // Don't show Spotlight treatment if item isn't a Spotlight item.
    if (!isSpotlightItem({ rowKey })) {
        return false;
    }

    // Don't show Spotlight treatment when not in Inbox.
    if (tableView.tableQuery.folderId && folderIdToName(tableView.tableQuery.folderId) != 'inbox') {
        return false;
    }

    return true;
}

function isItemOfAppointmentType(itemClass: string) {
    return (
        itemClass && itemClass.indexOf('IPM.Appointment') == 0 // check if null as well
    );
}

/**
 * This function determines if an item can be pinned. This check is required
 * on an item level for scenarios in which a subset of the rows can be pinned
 * and others cannot be (i.e. search).
 */
function canPin(
    tableView: TableView,
    tableSupportsPinning: boolean,
    parentFolderId: string
): boolean {
    /**
     * If the tableView isn't for search, then we can rely on whether or not
     * the table supports pinning. Additionally, we can early return if the
     * table itself doesn't support pinning at all.
     */
    if (tableView.tableQuery.type !== TableQueryType.Search || !tableSupportsPinning) {
        return tableSupportsPinning;
    }

    // Folders where pin is not supported
    const restrictedFoldersForPin = [
        'drafts',
        'sentitems',
        'clutter',
        'junkemail',
        'deleteditems',
        'archive',
        'notes',
        'recoverableitemsdeletions', // PRIMARY_DUMPSTER_DISTINGUISHED_ID
        'archiverecoverableitemsdeletions', // ARCHIVE_DUMPSTER_DISTINGUISHED_ID
    ];

    const parentFolderName = parentFolderId && folderIdToName(parentFolderId);
    for (let restrictedFolder of restrictedFoldersForPin) {
        if (parentFolderName === restrictedFolder) {
            return false;
        }
    }

    return true;
}
