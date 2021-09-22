import { getCalendarPath } from './index';

export default function getCalendarEventPeekDeepLinkUrl(itemId: string): string {
    // DeepLink to show the calendar event peek in context of other items on the preferred surface view
    return (
        window.location.origin + getCalendarPath() + 'showPeek/item/' + encodeURIComponent(itemId)
    );
}
