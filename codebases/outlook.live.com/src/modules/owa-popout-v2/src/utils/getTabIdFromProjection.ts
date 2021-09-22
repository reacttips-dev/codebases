import getProjection from './getProjection';

export default function getTabIdFromProjection(targetWindow: Window): string | null {
    const projection = getProjection(targetWindow);
    return projection ? projection.tabId : null;
}
