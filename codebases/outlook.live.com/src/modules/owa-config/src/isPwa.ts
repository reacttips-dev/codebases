export function isPwa(): boolean {
    return window.matchMedia?.('(display-mode: standalone)')?.matches;
}
