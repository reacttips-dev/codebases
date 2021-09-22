import { trace } from 'owa-trace';
import { initializeLightningIfNecessary } from '../utils/initializeLightningIfNecessary';
import lightupOrReject from '../utils/lightupOrReject';

/**
 * Action to start the lightning process, either reject the request, or show the callout
 * to the end user. When the request is fulfilled, pendingDismiss will be initialized to
 * block further callouts to be shown.
 */
export default function beginLightning(
    id: string,
    trigger: (lightup: () => void) => void,
    series?: string[]
): void {
    trace.info(`beginLightning - id:${id}`);

    // First wait for the trigger to happen
    trigger((): void => {
        initializeLightningIfNecessary()
            .then(() => lightupOrReject(id, series))
            .catch(error => {
                trace.warn(`something is wrong, lightning id:${id}, reason:${error}`);
            });
    });
}
