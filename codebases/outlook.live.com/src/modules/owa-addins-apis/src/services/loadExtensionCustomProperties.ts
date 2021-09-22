import { getHeaders } from 'owa-headers';
import type LoadExtensionCustomPropertiesParameters from 'owa-service/lib/contract/LoadExtensionCustomPropertiesParameters';
import type LoadExtensionCustomPropertiesResponse from 'owa-service/lib/contract/LoadExtensionCustomPropertiesResponse';
import loadExtensionCustomPropertiesOperation from 'owa-service/lib/operation/loadExtensionCustomPropertiesOperation';

export default function loadExtensionCustomProperties(
    extensionId: string,
    itemId: string,
    itemOwner: string
): Promise<LoadExtensionCustomPropertiesResponse> {
    const parameters: LoadExtensionCustomPropertiesParameters = {
        ExtensionId: extensionId,
        ItemId: itemId,
    };
    return loadExtensionCustomPropertiesOperation(
        { request: parameters },
        itemOwner ? { headers: getHeaders(itemOwner) } : {}
    );
}
