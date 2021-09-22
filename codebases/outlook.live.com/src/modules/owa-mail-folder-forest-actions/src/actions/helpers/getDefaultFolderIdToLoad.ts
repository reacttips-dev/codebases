import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';

export default function getDefaultFolderIdToLoad(): string {
    // Returns the default folder Id to load at mail module boot
    return folderNameToId('inbox');
}
