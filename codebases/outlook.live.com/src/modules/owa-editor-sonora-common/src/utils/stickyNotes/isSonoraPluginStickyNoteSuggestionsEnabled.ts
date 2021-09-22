import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * honeybee-sonora-stickyNotes is the master flight for sticky notes
 * When enabled, it allows for plaintext sticky notes
 */
export default function isSonoraPluginStickyNoteSuggestionsEnabled(): boolean {
    return isFeatureEnabled('honeybee-sonora-stickyNotes');
}

/**
 * honeybee-sonora-richStickyNotes enables sticky notes with rich text
 * The flight is ignored if honeybee-sonora-stickyNotes is off.
 */
export function isSonoraPluginRichStickyNoteSuggestionsEnabled(): boolean {
    return (
        isFeatureEnabled('honeybee-sonora-stickyNotes') &&
        isFeatureEnabled('honeybee-sonora-richStickyNotes')
    );
}

/**
 * honeybee-sonora-richStickyNotesUsingGetItem enables sticky notes with rich text
 * The flight is ignored if honeybee-sonora-stickyNotes is off.
 */
export function isSonoraPluginRichStickyNoteViaGetItemSuggestionsEnabled(): boolean {
    return (
        isFeatureEnabled('honeybee-sonora-stickyNotes') &&
        isFeatureEnabled('honeybee-sonora-richStickyNotesUsingGetItem')
    );
}
