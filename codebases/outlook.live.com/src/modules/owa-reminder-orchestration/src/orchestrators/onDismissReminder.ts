import dismissReminderAction from '../actions/dismissReminder';
import dismissReminderService from '../services/dismissReminder';
import { orchestrator } from 'satcheljs';
import deleteReminder from '../mutators/deleteReminder';
import pushActiveRemindersAndSetTimeout from './pushActiveRemindersAndSetTimeout';
import type ItemId from 'owa-service/lib/contract/ItemId';
import getReminderByItemId from '../selectors/getReminderByItemId';
import type ParsedReminder from '../store/schema/ParsedReminder';

export default orchestrator(dismissReminderAction, message => {
    let { itemId } = message;

    const itemIds = Array.isArray(itemId) ? itemId : [itemId];
    // find reminders to dismiss based on itemIds
    const remindersToDismiss: ParsedReminder[] = itemIds
        .map(getReminderByItemId)
        .filter(reminder => !!reminder) as ParsedReminder[]; // Filter out any reminders not found

    // create a map of accounts and corresponding itemIds
    const itemIdMap = new Map<string | null, ItemId[]>();
    remindersToDismiss.forEach(r => {
        if (itemIdMap.has(r.userIdentity)) {
            itemIdMap.set(r.userIdentity, itemIdMap.get(r.userIdentity)!.concat([r.ItemId]));
        } else {
            itemIdMap.set(r.userIdentity, [r.ItemId]);
        }

        // delete each reminder to dismiss from the reminder store
        deleteReminder(r);
    });

    // For each account to which the dismissed reminders belong to, call pushActiveRemindersAndSetTimeout and dismissReminderService with its correspondong itemId list
    itemIdMap.forEach((itemIds, account) => {
        pushActiveRemindersAndSetTimeout(account);
        dismissReminderService(account, itemIdMap.get(account)!);
    });
});

export type { ItemId };
