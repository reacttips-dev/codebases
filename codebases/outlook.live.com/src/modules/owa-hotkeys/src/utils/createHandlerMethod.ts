import shouldPreventCallback from './shouldPreventCallback';

export function createHandlerMethod(
    allowHotkeyOnTextFields: boolean,
    isEnabled: ((evt: KeyboardEvent) => boolean) | undefined,
    stopPropagation: boolean,
    preventDefault: boolean,
    handler: (evt: KeyboardEvent) => void
) {
    return (evt: KeyboardEvent) => {
        if (shouldPreventCallback(evt, allowHotkeyOnTextFields) || (isEnabled && !isEnabled(evt))) {
            return;
        }
        if (stopPropagation) {
            evt.stopPropagation();
        }
        if (preventDefault) {
            evt.preventDefault();
        }
        handler(evt);
    };
}
