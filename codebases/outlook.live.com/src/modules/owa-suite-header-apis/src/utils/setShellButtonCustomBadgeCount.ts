import getO365ShellShim from './getO365ShellShim';
export default function setShellButtonCustomBadgeCount(buttonId: string, badgeCount: number) {
    // Call after RAF to prevent changing state during render
    requestAnimationFrame(() =>
        getO365ShellShim().Extensibility.SetCustomHeaderButtonBadgeValue(buttonId, badgeCount)
    );
}
