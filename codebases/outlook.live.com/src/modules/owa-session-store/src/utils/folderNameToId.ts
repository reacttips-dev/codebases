import store from '../store/store';

export default function folderNameToId(folderName: string): string {
    if (!folderName) {
        throw new Error('Input parameter to folderNameToId must not be null.');
    }

    return <string>store.defaultFolderNameToIdMap.get(folderName);
}
