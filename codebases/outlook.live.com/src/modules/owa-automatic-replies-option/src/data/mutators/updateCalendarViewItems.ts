import getStore from '../store/store';
import { mutatorAction } from 'satcheljs';
import type CalendarItem from 'owa-service/lib/contract/CalendarItem';
import { getDisplayDateFromEwsDate } from 'owa-datetime';

export default mutatorAction('updateCalendarViewItems', function (items: CalendarItem[]) {
    let optionState = getStore().currentState;
    optionState.calendarViewItems = [];
    const itemsToInitiallySelect: string[] = [];
    if (items) {
        items.forEach(item => {
            if (!item.IsCancelled) {
                const { ItemId, Organizer, Subject } = item;
                optionState.calendarViewItems.push({
                    ItemId: {
                        ...ItemId,
                        mailboxInfo: undefined,
                    },
                    Organizer,
                    Subject,
                    Start: getDisplayDateFromEwsDate(item.Start),
                    End: getDisplayDateFromEwsDate(item.End),
                });

                if (item.IsMeeting) {
                    itemsToInitiallySelect.push(item.ItemId.Id);
                }
            }
        });
    }
    getStore().selectedCalendarIds = itemsToInitiallySelect;
});
