import { assertNever } from 'owa-assert';

const enum InsightsDataFetchSource {
    ReadingPane = 1,
    ItemPeek = 2,
    PrefetchOnCalendarSelected = 3,
    AgendaView = 4,
    Reminder = 5,
    Deeplink = 6,
    PrefetchOnAgendaView = 7,
    TimePanelEventDetails = 8,
    /* Do not reuse TabbedDetailsForm = 9, */
    /* Do not reuse UpNext = 10, */
    CalendarCard = 11,
}

export default InsightsDataFetchSource;

export function convertInsightsEntrySourceEnumToName(entrySource: InsightsDataFetchSource): string {
    switch (entrySource) {
        case InsightsDataFetchSource.ReadingPane:
            return 'ReadingPane';
        case InsightsDataFetchSource.ItemPeek:
            return 'ItemPeek';
        case InsightsDataFetchSource.PrefetchOnCalendarSelected:
            return 'PrefetchOnCalendarSelected';
        case InsightsDataFetchSource.AgendaView:
            return 'AgendaView';
        case InsightsDataFetchSource.Reminder:
            return 'Reminder';
        case InsightsDataFetchSource.Deeplink:
            return 'Deeplink';
        case InsightsDataFetchSource.PrefetchOnAgendaView:
            return 'PrefetchOnAgendaView';
        case InsightsDataFetchSource.TimePanelEventDetails:
            return 'TimePanelEventDetails';
        case InsightsDataFetchSource.CalendarCard:
            return 'CalendarCard';
        default:
            return assertNever(entrySource as never);
    }
}
