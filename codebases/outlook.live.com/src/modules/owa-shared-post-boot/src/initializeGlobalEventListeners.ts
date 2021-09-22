import { logUsage } from 'owa-analytics';
import { getOpxHostApp, MAC_OUTLOOK } from 'owa-config';

export const tabOutline = { disable: false };

function disableBrowserContextMenu(this: HTMLBodyElement, ev: MouseEvent) {
    ev.preventDefault();
}

export default function initializeGlobalEventListeners() {
    // disable default browser context menu in Mac OPX host (but still allow custom context menus)
    if (getOpxHostApp() === MAC_OUTLOOK) {
        document.body.addEventListener('contextmenu', disableBrowserContextMenu);
    }

    window?.addEventListener('appinstalled', () => {
        logUsage('PwaInstalled');
    });
}
