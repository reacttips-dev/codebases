export function setItem(windowObj: Window, key: string, value: string): void {
    if (localStorageExists(windowObj)) {
        try {
            windowObj.localStorage.setItem(key, value);
        } catch (e) {
            // suppress quota exception
        }
    }
}

export function getItem(windowObj: Window, key: string): string | null {
    if (localStorageExists(windowObj)) {
        try {
            return windowObj.localStorage.getItem(key);
        } catch {
            return null;
        }
    }
    return null;
}

export function removeItem(windowObj: Window, key: string): void {
    if (localStorageExists(windowObj)) {
        return windowObj.localStorage.removeItem(key);
    }
}

export function itemExists(windowObj: Window, key: string): boolean {
    return getItem(windowObj, key) !== null;
}

export function localStorageExists(windowObj: Window): boolean {
    try {
        return windowObj && !!windowObj.localStorage;
    } catch {
        return false;
    }
}
