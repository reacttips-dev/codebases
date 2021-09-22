let hotkeysEnabled: boolean = true;

export function disableAppModuleHotkeys() {
    hotkeysEnabled = false;
}

export function enableAppModuleHotkeys() {
    hotkeysEnabled = true;
}

export function getHotkeysEnabled() {
    return hotkeysEnabled;
}
