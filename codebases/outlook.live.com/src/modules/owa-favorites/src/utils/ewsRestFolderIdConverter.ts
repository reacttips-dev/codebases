/**
 * Convert an ews folder id to rest folder id
 * @param ewsFolderId the ews folder id
 */
export function convertEWSFolderIdToRestFolderId(ewsFolderId: string): string {
    return replaceAll(replaceAll(ewsFolderId, '/', '-'), '+', '_');
}

/**
 * Convert an rest folder id to ews folder id
 * @param restFolderId
 */
export function convertRestFolderIdToEWSFolderId(restFolderId: string): string {
    return replaceAll(replaceAll(restFolderId, '-', '/'), '_', '+');
}

/**
 * Helper function to replace all search string with replacement string
 * @param originalString to operation on
 * @param search the words to be replaced
 * @param replacement the replacement
 * @return the replaced string
 */
function replaceAll(originalString: string, search: string, replacement: string): string {
    return originalString.split(search).join(replacement);
}
