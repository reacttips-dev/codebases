import { getHeaders } from 'owa-headers';
import type SaveExtensionCustomPropertiesParameters from 'owa-service/lib/contract/SaveExtensionCustomPropertiesParameters';
import type SaveExtensionCustomPropertiesResponse from 'owa-service/lib/contract/SaveExtensionCustomPropertiesResponse';
import saveExtensionCustomPropertiesOperation from 'owa-service/lib/operation/saveExtensionCustomPropertiesOperation';

export default function saveExtensionCustomProperties(
    extensionId: string,
    itemId: string,
    itemOwner: string,
    customProperties: string
): Promise<SaveExtensionCustomPropertiesResponse> {
    const parameters: SaveExtensionCustomPropertiesParameters = {
        ExtensionId: extensionId,
        ItemId: itemId,
        CustomProperties: customProperties,
    };
    return saveExtensionCustomPropertiesOperation(
        { request: parameters },
        itemOwner ? { headers: getHeaders(itemOwner) } : {}
    );
}
