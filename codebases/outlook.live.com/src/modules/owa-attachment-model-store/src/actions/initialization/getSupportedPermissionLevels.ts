import type AttachmentPermissionLevel from 'owa-service/lib/contract/AttachmentPermissionLevel';
import getDataProviderInfo, {
    AttachmentDataProviderInfo,
} from '../../utils/DataProviderInfo/getDataProviderInfo';

export default function getSupportedPermissionLevels(
    isCloudy: boolean,
    providerType: string,
    individualPermissionLevels: AttachmentPermissionLevel[]
): AttachmentPermissionLevel[] {
    if (!isCloudy) {
        return null;
    }

    if (individualPermissionLevels && individualPermissionLevels.length > 0) {
        return individualPermissionLevels;
    }

    const dataProviderInfo: AttachmentDataProviderInfo = getDataProviderInfo(providerType);
    return dataProviderInfo?.supportedPermissionLevels;
}
