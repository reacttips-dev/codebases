import saveExtensionSettingsOperation from 'owa-service/lib/operation/saveExtensionSettingsOperation';
import type SaveExtensionSettingsParameters from 'owa-service/lib/contract/SaveExtensionSettingsParameters';
import type SaveExtensionSettingsResponse from 'owa-service/lib/contract/SaveExtensionSettingsResponse';

export default function saveExtensionSettings(
    extensionId: string,
    extensionVersion: string,
    settings: string
): Promise<SaveExtensionSettingsResponse> {
    const parameters: SaveExtensionSettingsParameters = {
        ExtensionId: extensionId,
        ExtensionVersion: extensionVersion,
        Settings: settings,
    };
    return saveExtensionSettingsOperation({ request: parameters });
}
