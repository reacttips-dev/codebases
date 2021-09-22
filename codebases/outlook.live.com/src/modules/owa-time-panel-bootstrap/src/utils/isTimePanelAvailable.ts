import { isDeepLink } from 'owa-url';

/**
 * Checks whether Time Panel feature is available in current OWA user/window context.
 *
 * OWA features that interact with Time Panel should implement a graceful fallback to handle
 * contexts where Time Panel is not available, e.g. clicking on 'Show Conflicts' in a
 * meeting invite can fallback to showing a short inline summary in contexts where opening
 * Time Panel to Conflicts View is not an option.
 *
 * IMPORTANT: If access to To Do features is also needed, call `isTimePanelWithToDoFeaturesAvailable`
 * util instead.
 */
export function isTimePanelAvailable(): boolean {
    if (isDeepLink() && window.opener) {
        return false;
    }
    return true;
}
