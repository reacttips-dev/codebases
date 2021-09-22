import { getActiveContentTab, getSxSIdFromProjection } from 'owa-tab-store';

export default function getActiveSxSId(targetWindow: Window): string {
    if (targetWindow === window) {
        return getActiveContentTab().sxsId;
    }
    return getSxSIdFromProjection(targetWindow);
}
