import triggerApiEvent from './triggerApiEvent';
import { getAllActiveControlIds } from 'owa-addins-store';
import { isControlRegistered } from './storage/ActiveApiEvents';
import type { OutlookEventDispId } from './schema/OutlookEventDispId';

export default function triggerAllApiEvents(
    hostItemIndex: string,
    dispId: OutlookEventDispId,
    getArgs: () => any
) {
    const controlIds = getAllActiveControlIds(hostItemIndex);
    var hasProcessed = false;
    var args = null;
    controlIds.forEach(controlId => {
        if (isControlRegistered(controlId, dispId)) {
            if (!hasProcessed) {
                hasProcessed = true;
                args = getArgs();
            }
            triggerApiEvent(dispId, controlId, args, null, hostItemIndex);
        }
    });
}
