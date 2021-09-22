export default function shouldPreventCallback(ev: KeyboardEvent, allowHotkeyOnTextFields: boolean) {
    if (allowHotkeyOnTextFields) {
        return false;
    }

    // Otherwise, block if the target is a text area
    let element = ev.target as HTMLElement;
    return (
        element.tagName == 'INPUT' ||
        element.tagName == 'SELECT' ||
        element.tagName == 'TEXTAREA' ||
        (element.contentEditable && element.contentEditable == 'true')
    );
}
