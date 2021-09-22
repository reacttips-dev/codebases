import { logUsage } from 'owa-analytics';

export const enum SelectionUIHotkey {
    FocusNextItemPart = 1,
    FocusPrevItemPart,
    EnterToToggleExpandCollapse,
}

export default function logSelectionUIHotKeyUsage(hotkey: SelectionUIHotkey) {
    logUsage('RPCountSelectionUIHotkeyUsage', [hotkey]);
}
