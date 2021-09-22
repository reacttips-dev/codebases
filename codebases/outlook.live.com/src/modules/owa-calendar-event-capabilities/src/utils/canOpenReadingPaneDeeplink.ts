import hasReadRights from './hasReadRights';
import type { CalendarEvent } from 'owa-calendar-types';
import type { ClientItemId } from 'owa-client-ids';
import { isGuid } from 'owa-guid';

/**
 * Check that there is meaningful information to display in a calendar reading pane popout.
 *
 * For example, F/B items have ItemId set to a random GUID so they can't be loaded in popouts.
 *
 * If the user has read rights, then the item should be safe + useful to open.
 */
export default function canOpenReadingPaneDeeplink(item: CalendarEvent): boolean {
    return item && hasReadRights(item) && canOpenReadingPaneDeeplinkForItemId(item.ItemId);
}

/**
 * Check that there is meaningful information to display in a calendar reading pane popout.
 *
 * For example, F/B items have ItemId set to a random GUID so they can't be loaded in popouts.
 *
 * When possible, prefer calling `canOpenReadingPaneDeeplink` with the calendar event for a
 * fully exhaustive check. This util is intended as a stopgap for scenarios that need a quick
 * fix to avoid exposing deeplink buttons on unsupported events without blocking such a fix on
 * restructuring/refactoring to take a dependency on having/loading a `CalendarEvent` item.
 *
 * TODO: VSO #62270 Consume canOpenReadingPaneDeeplink in Time Panel
 */
export function canOpenReadingPaneDeeplinkForItemId(itemId: ClientItemId): boolean {
    return itemId?.Id && !isGuid(itemId.Id);
}
