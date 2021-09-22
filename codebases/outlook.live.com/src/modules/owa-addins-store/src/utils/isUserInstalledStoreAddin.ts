import type Extension from 'owa-service/lib/contract/Extension';
import type ExtensionInstallScope from 'owa-service/lib/contract/ExtensionInstallScope';
import type ExtensionType from 'owa-service/lib/contract/ExtensionType';

const UserInstallScope: ExtensionInstallScope = 'User';
const MarketPlaceExtensionType: ExtensionType = 'MarketPlace';

export default function isUserInstalledStoreAddin(extension: Extension) {
    if (
        extension?.MarketplaceAssetID &&
        extension?.OriginString == UserInstallScope &&
        extension?.TypeString == MarketPlaceExtensionType
    ) {
        return true;
    }
    return false;
}
