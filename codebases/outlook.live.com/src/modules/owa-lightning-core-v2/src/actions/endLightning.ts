import { mutator, action, orchestrator } from 'satcheljs';
import { trace } from 'owa-trace';
import { hasQueryStringParameter } from 'owa-querystring';
import { updateItemOnServer } from '../services/updateItemOnServer';
import { getStore } from '../store/store';
import type ActionType from '../store/schema/ActionType';
import { logLightningUsage } from './logLightningUsage';
const lightningQueryParamName = 'lightning';

/**
 * Action to complete the lightning callout and make the callout unvisible
 */
let endLightning = action('endLightning', (id: string, actionType?: ActionType) => ({
    id: id,
    actionType: actionType,
}));
export default endLightning;

//orchestrator need to resigtar before mutator so store item delete after orchestrator logic executed.
orchestrator(endLightning, function (actionMessage) {
    // Skip the update because the id didn't lightup or it is already dismissed
    if (isIdAlreadyDismissed(actionMessage.id)) {
        return;
    }
    // log datapoint
    logLightningUsage('Lighted', actionMessage.id);

    if (hasQueryStringParameter(lightningQueryParamName)) {
        trace.info('skipping the update because override exists');
    } else {
        updateItemOnServer(actionMessage.id, actionMessage.actionType);
    }
});

mutator(endLightning, actionMessage => {
    trace.info(`endLightning - id:${actionMessage.id}`);
    let unseen = getStore().unseenItems;

    // Skip the update because the id didn't lightup or it is already dismissed
    if (isIdAlreadyDismissed(actionMessage.id)) {
        return;
    }

    // Remove the lightning from the store
    unseen.delete(actionMessage.id);
});

function isIdAlreadyDismissed(id: string): boolean {
    let unseen = getStore().unseenItems;
    // Skip the update because the id didn't lightup or it is already dismissed
    return !unseen.has(id) || !unseen.get(id)!.visible;
}
