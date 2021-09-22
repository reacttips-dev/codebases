import { action } from 'satcheljs';

export let saveFocusInboxEnable = action(
    'saveFocusInboxEnable',
    (isFocusedInboxEnabled: boolean) => ({
        isFocusedInboxEnabled: isFocusedInboxEnabled,
    })
);
