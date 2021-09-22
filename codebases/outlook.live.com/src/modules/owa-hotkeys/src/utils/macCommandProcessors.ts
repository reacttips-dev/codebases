import type { Hotkeys } from '../types/HotkeyCommand';

export function convertDelKeyToBackspaceForMacProcessor(keys: Hotkeys): Hotkeys {
    if (Array.isArray(keys)) {
        if (keys.includes('del')) {
            return keys.concat('backspace');
        }
        // For any command that contains 'del', keep the original and add the Mac flavor
        // which replaces 'del' with 'backspace' (ex: 'shift+del' -> ['shift+del', 'shift+backspace'])
    } else if (keys.indexOf('del') !== -1) {
        return [keys, keys.replace('del', 'backspace')];
    }

    return keys;
}

export function convertCtrlToCmdForMacProcessor(keys: Hotkeys): Hotkeys {
    if (Array.isArray(keys)) {
        return keys.map(convertCtrlToCmdForMac);
    } else {
        return convertCtrlToCmdForMac(keys);
    }
}

function convertCtrlToCmdForMac(key: string): string {
    return key.replace(/\bctrl\b/, 'command');
}

export default [convertDelKeyToBackspaceForMacProcessor, convertCtrlToCmdForMacProcessor];
