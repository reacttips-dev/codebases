import { lazyInitializeNotificationSettings } from 'owa-skype-option';

const SWC_READY_EVENT_NAME = 'swc:ready';

export default function createSwcReadyEvent(): void {
    window.addEventListener(SWC_READY_EVENT_NAME, () => {
        onSwcReady();
    });
}

function onSwcReady() {
    window.removeEventListener(SWC_READY_EVENT_NAME, () => {
        onSwcReady();
    });
    lazyInitializeNotificationSettings.importAndExecute();
}
