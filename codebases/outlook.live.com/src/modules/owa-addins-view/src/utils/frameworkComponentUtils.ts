import getGuid from 'owa-service/lib/getGuid';

export function getNewFrameworkComponentId(targetWindow: Window) {
    return 'exfc_' + (targetWindow == window ? 'main' : getGuid());
}

export function findFrameworkComponentId(targetWindow: Window) {
    return targetWindow == window
        ? 'exfc_main'
        : targetWindow?.document.querySelector('[id^="exfc_"]')?.id;
}
