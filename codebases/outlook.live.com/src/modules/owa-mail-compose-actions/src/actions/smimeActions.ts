import { action } from 'satcheljs';
import type { ComposeViewState } from 'owa-mail-compose-store';

/**
 *Action triggered when S/MIME options are changed
 */
export const onSmimeOptionsChange = action(
    'onSmimeOptionsChange',
    (
        viewState: ComposeViewState,
        shouldEncryptMessageAsSmime: boolean,
        shouldSignMessageAsSmime: boolean
    ) => ({
        viewState,
        shouldEncryptMessageAsSmime,
        shouldSignMessageAsSmime,
    })
);

/**
 * Action triggered to mutate the viewstate when S/MIME option is changed
 */
export const onSmimeOptionsDirty = action(
    'onSmimeOptionsDirty',
    (
        viewState: ComposeViewState,
        shouldEncryptMessageAsSmime: boolean,
        shouldSignMessageAsSmime: boolean
    ) => ({
        viewState,
        shouldEncryptMessageAsSmime,
        shouldSignMessageAsSmime,
    })
);

/**
 * Action triggered when smime mode is enabled in compose.
 */
export const onSmimeModeEnabled = action(
    'onSmimeModeEnabled',
    (composeViewState: ComposeViewState) => ({
        composeViewState,
    })
);

/**
 * Action called to reset the composeItemId to null in Bcc forking scenario.
 */
export const resetComposeItemId = action('resetComposeItemId', (viewState: ComposeViewState) => ({
    viewState,
}));

/**
 * Action called to applySmimeSettings when user/admin settings are enabled.
 */
export const applySmimeSettings = action(
    'applySmimeSettings',
    (composeViewState: ComposeViewState) => ({
        composeViewState,
    })
);
