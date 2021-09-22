import strings, { keyboardShortcutThen } from './convertHotkeyStringToReadableText.locstring.json';
import loc, { format } from 'owa-localize';
import { isMac } from 'owa-user-agent/lib/userAgent';

export interface HotkeyTranslationOptions {
    useMacSymbols?: boolean;
}

/**
 * Converts the given hotkey (i.e. "ctrl+n") to the Readable form to
 * be shown to the user.
 * @param hotkey The hotkey or array of hotkeys for a command
 * @param options Overrides for the translation options, which are otherwise
 *    inferred from the environment
 * @return A Readable string of the given hotkey(s)
 */
export function convertHotkeyStringToReadableText(
    hotkey: string | string[],
    options?: HotkeyTranslationOptions
): string {
    /**
     * If there's only 1 hotkey, return the Readable version. If there
     * are multiple hotkeys, iterate over them and return a single Readable
     * string.
     */
    if (typeof hotkey === 'string') {
        return convertSingleHotkeyStringToReadableText(hotkey, options);
    } else if (hotkey instanceof Array) {
        return hotkey
            .map((hotkey: string) => convertSingleHotkeyStringToReadableText(hotkey, options))
            .join(' / '); // Add space so that the hotkey string breaks on new line at logical place
    } else {
        return '';
    }
}

/**
 * Helper function for convertToReadableHotkey that actually creates the
 * readable version of the hotkey string for a single hotkey.
 * @param hotkey The hotkey for a command
 * @return A readable string of the given hotkey
 */
function convertSingleHotkeyStringToReadableText(
    hotkey: string,
    options?: HotkeyTranslationOptions
): string {
    // Attempt to split on "+" which signifies a combination of keys.
    const individualKeys = hotkey.split('+');

    /**
     * If there's no "+" present (i.e. individualKeys === 1), continue
     * processing the string.
     *
     * If is a "+" present, the hotkey is a combination, so iterate over
     * individual keys, stylize them, join them back together with a "+",
     * and return (i.e. Ctrl+N).
     */
    if (individualKeys.length === 1) {
        // Attempt to split on " " which signifies a 2 stroke hotkey.
        const individualKeys = hotkey.split(' ');

        /**
         * If there's no " " present (i.e. individualKeys === 1), stylize
         * the string and return.
         *
         * If there is a " " present, the hotkey is 2 strokes, so stylize
         * the individual keys and join them with "then" (i.e. G then I).
         */
        if (individualKeys.length === 1) {
            return localizeKey(individualKeys[0], options);
        } else {
            return format(
                loc(keyboardShortcutThen),
                localizeKey(individualKeys[0], options),
                localizeKey(individualKeys[1], options)
            );
        }
    } else {
        const ReadableKeys = [];

        individualKeys.forEach(key => {
            ReadableKeys.push(localizeKey(key, options));
        });

        return ReadableKeys.join('+');
    }
}

function localizeKey(key: string, { useMacSymbols = isMac() }: HotkeyTranslationOptions = {}) {
    if (useMacSymbols) {
        switch (key.toLowerCase()) {
            case 'command':
                return '⌘';
            case 'alt':
                return '⌥';
            case 'shift':
                return '⇧';
            default:
        }
    }
    return loc(strings[`hotkey_keyword_${key}`]) || capitalizeFirstLetter(key);
}

/**
 * Helper function to capitalize a string.
 * https://stackoverflow.com/a/1026087/4581361
 * @param string The string to capitalize
 * @return A string whose first letter is capitalized
 */
function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
