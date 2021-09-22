export function loadState<T>(key): T {
    try {
        const serializedState = localStorage.getItem(`workspace-sidenav-${key}-collapsed`);
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
}

export function saveState(key, state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(`workspace-sidenav-${key}-collapsed`, serializedState);
    } catch (err) {
        // Ignore write errors.
    }
}
