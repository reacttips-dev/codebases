import initializeLightning from '../actions/initializeLightning';
import { trace } from 'owa-trace';

export function initializeLightningFromSessionData(unseenItems: any): Promise<void> {
    trace.info('initialize lightning from session data');
    initializeLightning(
        unseenItems.map(unseenItem => {
            return {
                identity: unseenItem.id,
                visible: false,
                category: unseenItem.category,
            };
        })
    );
    return Promise.resolve();
}
