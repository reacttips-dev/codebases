import { initializeWhatsNew } from '../orchestrators/initializeWhatsNew';

let initializeWhatsNewPromise: Promise<void> = null;

export function initializeWhatsNewIfNecessary(): Promise<void> {
    if (!initializeWhatsNewPromise) {
        initializeWhatsNewPromise = initializeWhatsNew();
    }

    return initializeWhatsNewPromise;
}
