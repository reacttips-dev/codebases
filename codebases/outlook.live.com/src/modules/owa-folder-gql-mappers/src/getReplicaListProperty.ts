import getExtendedProperty from './getExtendedProperty';
import type BaseFolderType from 'owa-service/lib/contract/BaseFolderType';
import { REPLICA_LIST_EXTENDED_PROPERTY_TAG } from './replicaListConstant';

export function getReplicaListProperty(folderItem: BaseFolderType): string[] | null {
    const replicaListBase64Encoded = getExtendedProperty(
        folderItem,
        REPLICA_LIST_EXTENDED_PROPERTY_TAG
    );

    if (replicaListBase64Encoded) {
        // Decode the Base-64 format encoded (binary form) replica guid to text.
        // The binary form Guids have null character at the end so remove it.
        const decoded = atob(replicaListBase64Encoded);
        const replicaGuid = decoded.substr(0, decoded.length - 1);
        return [replicaGuid];
    }

    return null;
}
