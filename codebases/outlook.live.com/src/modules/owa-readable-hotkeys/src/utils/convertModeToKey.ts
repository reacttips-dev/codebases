import KeyboardShortcutsMode from 'owa-service/lib/contract/KeyboardShortcutsMode';

/**
 * Converts the selected mode to the object key to get hotkey information.
 * @param keyboardShortcutsMode The selected user's keyboard shortcut mode
 * @return A command object key
 */
export function convertModeToKey(keyboardShortcutsMode: KeyboardShortcutsMode): string {
    switch (keyboardShortcutsMode) {
        case KeyboardShortcutsMode.Hotmail:
            return 'hotmail';
        case KeyboardShortcutsMode.Gmail:
            return 'gmail';
        case KeyboardShortcutsMode.Yahoo:
            return 'yahoo';
        case KeyboardShortcutsMode.Owa:
            return 'owa';
        case KeyboardShortcutsMode.Off:
            return null;
    }
}

export default convertModeToKey;
