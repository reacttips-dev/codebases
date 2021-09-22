import { trace } from 'owa-trace';
import initializeLightning from '../actions/initializeLightning';

/**
 * Initialize lightning from override query parameter
 * @param id override lightning id
 */
export function initializeLightningFromOverride(id: string) {
    trace.info('initialize lightning from override query parameter');

    let unseenItems = id.split(',').map(identity => {
        return {
            identity: identity,
            visible: false,
        };
    });

    initializeLightning(unseenItems);

    return Promise.resolve();
}
