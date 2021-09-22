import { getHostHub } from './getHostHub';
import { getTestHostHub } from './getTestHostHub';

export function getCurrentHostHub() {
    let hostHub = getHostHub();
    if (!hostHub) {
        hostHub = getTestHostHub();
    }

    return hostHub;
}
