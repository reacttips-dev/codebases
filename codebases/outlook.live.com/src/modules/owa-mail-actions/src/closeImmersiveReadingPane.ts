import { action } from 'satcheljs';
import type { ActionSource } from 'owa-mail-store';

/**
 * Closes reading pane from command bar
 */
export default action('closeImmersiveReadingPane', (source?: ActionSource) => {
    return {
        source,
    };
});
