import CalendarFolderTypeEnum from 'owa-service/lib/contract/CalendarFolderTypeEnum';
import type { CalendarEntry } from 'owa-graph-schema';

export default function isHolidayCalendar(calendarEntry: CalendarEntry): boolean {
    return calendarEntry?.CalendarFolderType == CalendarFolderTypeEnum.HolidayCalendar;
}
