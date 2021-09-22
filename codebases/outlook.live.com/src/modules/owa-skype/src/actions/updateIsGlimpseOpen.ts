import store from '../store/store';
import { logUsage } from 'owa-analytics';
import { action } from 'satcheljs/lib/legacy';

export default action('updateIsGlimpseOpen ')(function updateIsGlimpseOpen(isGlimpseOpen: boolean) {
    store.isGlimpseOpen = isGlimpseOpen;

    // Call swc methods for telemetry
    if (window.swc) {
        if (isGlimpseOpen) {
            window.swc.API.triggerEvent('recentsShown');
        } else {
            window.swc.API.triggerEvent('recentsHidden');
        }
    }

    // Log whether skype glimpse was opened/closed
    logUsage('Skype_Recents', [isGlimpseOpen]);
});
