import { getStore } from '../store/Store';
import { action } from 'satcheljs/lib/legacy';
import type AriaPolitenessSetting from '../store/schema/AriaPolitenessSetting';

/**
 * This function sets the message for the MailModule's Announced component. An
 * example use case for this component is to announce the status change after
 * a user flags/unflags a mail list item (see announceFlaggedStatus.ts).
 *
 * See the Fabric documentation for more info about the component:
 * https://developer.microsoft.com/en-us/fabric#/controls/web/announced/
 */
export default action('setTriageActionAnnouncement')(function setTriageActionAnnouncement(
    message: string,
    politenessSetting: AriaPolitenessSetting = 'polite'
) {
    const store = getStore();

    /**
     * This check is required to modify the announcement message slightly if the
     * message to be announced is the same as the previous message that was announced.
     * This is required because of how the Announced component works internally - it's
     * an aria-live region. aria-live regions only get read by a screen reader when
     * the content within them changes. If the user performs two identical actions
     * in a row (and thus we announce the same message twice in a row), the second one
     * needs to be different else it will not be read.
     *
     * This can be removed if/when Fabric modifies their Announced component to
     * do this internally.
     *
     * Work Item 57192: Remove duplicate annoucement logic when (if) Fabric
     * modifies Announced component to fix same messages not being read
     */
    store.triageAnnouncement = {
        message: store.triageAnnouncement.message === message ? message + ' ' : message,
        politenessSetting,
    };
});
