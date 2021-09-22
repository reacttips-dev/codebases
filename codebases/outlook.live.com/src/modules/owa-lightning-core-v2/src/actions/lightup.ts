import { mutator, action, orchestrator } from 'satcheljs';
import { trace } from 'owa-trace';
import { getStore } from '../store/store';
import { logLightningUsage } from './logLightningUsage';

/**
 * Action to show the callout to end user
 */

let lightup = action('lightup', (id: string) => ({ id }));
export default lightup;

mutator(lightup, actionMessage => {
    trace.info(`lightup - id:${actionMessage.id}`);

    getStore().lastShownId = actionMessage.id;
    getStore().lightedCount++;

    const unseenItemId = getStore().unseenItems.get(actionMessage.id);
    unseenItemId && (unseenItemId.visible = true);
});

orchestrator(lightup, function (actionMessage) {
    // log datapoint
    logLightningUsage('LIGHTUP', actionMessage.id);
});
