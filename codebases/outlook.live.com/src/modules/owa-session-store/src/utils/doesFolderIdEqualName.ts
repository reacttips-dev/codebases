import store from '../store/store';
import type DistinguishedFolderIdName from 'owa-service/lib/contract/DistinguishedFolderIdName';

export default function doesFolderIdEqualName(
    folderId: string,
    distinguishedFolderName: DistinguishedFolderIdName
): boolean {
    if (!folderId || !distinguishedFolderName) {
        throw new Error('Input parameters to doesFolderIdEqualName must not be null.');
    }

    return store.defaultFolderNameToIdMap.get(distinguishedFolderName) == folderId;
}
