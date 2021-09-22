import isSonoraPluginFileSuggestionsEnabled from 'owa-editor-sonora-common/lib/utils/file/isSonoraPluginFileSuggestionsEnabled';
import isSonoraPluginStickyNoteSuggestionsEnabled from 'owa-editor-sonora-common/lib/utils/stickyNotes/isSonoraPluginStickyNoteSuggestionsEnabled';
import { isFeatureEnabled } from 'owa-feature-flags';

/**
 * Note that honeybee-sonora-stickyNotes is the master flight for sticky notes.
 * The honeybee-sonora-richStickyNotes flight has no effect if the master flight is off.
 */
export default function isSonoraPluginEnabled(): boolean {
    if (
        isFeatureEnabled('honeybee-sonora') &&
        isFeatureEnabled('honeybee-sonora-plugin') &&
        (isSonoraPluginFileSuggestionsEnabled() || isSonoraPluginStickyNoteSuggestionsEnabled())
    ) {
        return true;
    }
    return false;
}
