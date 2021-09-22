import type { HotkeyCommand, Hotkeys } from '../types/HotkeyCommand';
import { getUserConfiguration } from 'owa-session-store';
import KeyboardShortcutsMode from 'owa-service/lib/contract/KeyboardShortcutsMode';
import fixUpHotkeyCommand from './fixupHotkeyCommand';

export default function getKeysForKeyboardShortcutsMode(
    command: HotkeyCommand | Hotkeys
): Hotkeys | undefined {
    command = fixUpHotkeyCommand(command);
    if (typeof command == 'string' || Array.isArray(command)) {
        return command;
    }
    const {
        UserOptions: { KeyboardShortcutsMode: userShortcuts = '' } = {},
    } = getUserConfiguration();

    switch (userShortcuts) {
        case KeyboardShortcutsMode.Hotmail:
            return command.hotmail;
        case KeyboardShortcutsMode.Yahoo:
            return command.yahoo;
        case KeyboardShortcutsMode.Gmail:
            return command.gmail;
        case KeyboardShortcutsMode.Owa:
            return command.owa;
        default:
            return undefined;
    }
}
