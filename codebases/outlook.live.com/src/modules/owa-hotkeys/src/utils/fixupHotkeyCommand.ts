import type { HotkeyCommand, Hotkeys } from '../types/HotkeyCommand';
import { isMac } from 'owa-user-agent';
import processCommand from '../utils/processCommand';
import macCommandProcessors from '../utils/macCommandProcessors';

/**
 * Perform any pre-processing on the keys that we need to based upon platform, browser, etc.
 */
export default function fixUpHotkeyCommand(
    command: HotkeyCommand | Hotkeys
): HotkeyCommand | Hotkeys {
    if (isMac()) {
        // For Mac,
        // - convert any "del" keys to "backspace"
        // - convert all 'ctrl' to 'cmd'
        return processCommand(command, macCommandProcessors);
    } else {
        return command;
    }
}
