export default function refreshRecents(recentsWrapper: HTMLElement): void {
    if (window.swc) {
        window.swc.SDK.Recents.refreshDOM(recentsWrapper);
    }
}
