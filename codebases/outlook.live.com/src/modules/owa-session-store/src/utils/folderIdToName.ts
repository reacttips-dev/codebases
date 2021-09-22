import store from '../store/store';
import type DistinguishedFolderIdName from 'owa-service/lib/contract/DistinguishedFolderIdName';

export default function folderIdToName(folderId: string): DistinguishedFolderIdName {
    if (!folderId) {
        throw new Error('Input parameter to folderIdToName must not be null.');
    }

    return <DistinguishedFolderIdName>store.defaultFolderIdToNameMap.get(folderId) || 'none';
}
