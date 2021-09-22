let hasHadFocusSince = 0;

if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
        hasHadFocusSince = isDocumentVisible() ? new Date().getTime() : Number.MAX_VALUE;
    });
}

export function hasUserWindowHadFocusSince(time: number) {
    return time >= hasHadFocusSince;
}

export function isDocumentVisible() {
    return window.document.visibilityState == 'visible';
}
