import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import { getLocationDisplayWithAddressText } from 'owa-location-display-text';

export function containsText(item: CalendarEvent, searchText: string) {
    if (searchText && searchText.length > 0) {
        return (
            (item.Subject && item.Subject.toLowerCase().indexOf(searchText.toLowerCase()) != -1) ||
            (item.Location?.DisplayName &&
                getLocationDisplayWithAddressText(
                    item.Location.DisplayName,
                    item.Location.PostalAddress
                )
                    .toLowerCase()
                    .indexOf(searchText.toLowerCase()) != -1) ||
            (item.Organizer?.Mailbox &&
                item.Organizer.Mailbox.Name.toLowerCase().indexOf(searchText.toLowerCase()) != -1)
        );
    } else {
        return true;
    }
}
