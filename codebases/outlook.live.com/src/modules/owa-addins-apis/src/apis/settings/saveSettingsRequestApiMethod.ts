import ApiErrorCode from '../ApiErrorCode';
import saveExtensionSettings from '../../services/saveExtensionSettings';
import type { ApiMethodCallback } from '../ApiMethod';
import { createErrorResult, createSuccessResult } from '../ApiMethodResponseCreator';
import {
    getAddinCommandForControl,
    IAddinCommand,
    updateExtensionSettings,
} from 'owa-addins-store';

// Limit for the extension settings length (this is the per extension settings property) in number of characters
// Note this limit should be consistent with Outlook's implementation of Extensibility API.
// Also this should be consistent with the limit enforced by OSF (per O15:358072) when
// extension tries to use saveSettingsAsync API.
export const MAX_EXTENSION_SETTINGS_LENGTH: number = 32 * 1024;

// Settings object (user data) is in array due to legacy support
export interface SaveSettingsRequestArgs {
    0: any;
}

export default async function saveSettingsRequestApiMethod(
    hostItemIndex: string,
    controlId: string,
    data: SaveSettingsRequestArgs,
    callback: ApiMethodCallback
): Promise<void> {
    const settingsToSave: any = data[0];
    const serializedSettings: string = JSON.stringify(settingsToSave);

    if (serializedSettings.length > MAX_EXTENSION_SETTINGS_LENGTH) {
        callback(createErrorResult(ApiErrorCode.GenericSettingsError));
        return;
    }

    try {
        const addinCommand: IAddinCommand = getAddinCommandForControl(controlId);
        await saveExtensionSettings(
            addinCommand.extension.Id,
            addinCommand.extension.Version,
            serializedSettings
        );

        updateExtensionSettings(hostItemIndex, controlId, serializedSettings);

        callback(createSuccessResult());
    } catch (error) {
        callback(createErrorResult(ApiErrorCode.GenericSettingsError));
    }
}
