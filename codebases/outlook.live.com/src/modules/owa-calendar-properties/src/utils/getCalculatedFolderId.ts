import type FolderId from 'owa-service/lib/contract/FolderId';
import type { CalendarEntry, LocalCalendarEntry, LinkedCalendarEntry } from 'owa-graph-schema';

export function getCalculatedFolderId(calendar: CalendarEntry | LocalCalendarEntry): FolderId {
    if ((calendar as LocalCalendarEntry).FolderId) {
        // local calendar entry
        return (calendar as LocalCalendarEntry).FolderId;
    }
    let linkedCalendarEntry: LinkedCalendarEntry = calendar as LinkedCalendarEntry;
    return linkedCalendarEntry.IsGeneralScheduleCalendar
        ? { Id: linkedCalendarEntry.OwnerEmailAddress, ChangeKey: '' }
        : linkedCalendarEntry.SharedFolderId
        ? {
              Id: linkedCalendarEntry.SharedFolderId.Id,
              ChangeKey:
                  linkedCalendarEntry.SharedFolderId.ChangeKey != null
                      ? linkedCalendarEntry.SharedFolderId.ChangeKey
                      : '',
          }
        : null;
}
