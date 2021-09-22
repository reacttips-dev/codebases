import type { HotkeyCommand, Hotkeys } from '../types/HotkeyCommand';

export type HotkeyProcessor = (hotkey: Hotkeys) => Hotkeys;

function processHotkeys(
    keys: Hotkeys | undefined,
    processor: HotkeyProcessor
): Hotkeys | undefined {
    if (!keys) {
        return keys;
    } else {
        return processor(keys);
    }
}

export default function processCommand(
    command: HotkeyCommand | Hotkeys,
    processors: HotkeyProcessor[]
): HotkeyCommand | Hotkeys {
    if (Array.isArray(command) || typeof command === 'string') {
        return processors.reduce((mappedCommand, processor) => processor(mappedCommand), command);
    } else {
        return {
            hotmail: processors.reduce(
                (mappedCommand, processor) => processHotkeys(mappedCommand, processor),
                command.hotmail
            ),
            owa: processors.reduce(
                (mappedCommand, processor) => processHotkeys(mappedCommand, processor),
                command.owa
            ),
            gmail: processors.reduce(
                (mappedCommand, processor) => processHotkeys(mappedCommand, processor),
                command.gmail
            ),
            yahoo: processors.reduce(
                (mappedCommand, processor) => processHotkeys(mappedCommand, processor),
                command.yahoo
            ),
        };
    }
}
