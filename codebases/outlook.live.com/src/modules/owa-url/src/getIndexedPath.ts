import { internalGetScopedPath, isIndexTest } from './internalGetScopedPath';

/**
 * Gets the indexed path of intended url
 *
 * This implementation normalizes and then checks to see if the second part of the path is an index
 *
 * For example, an indexed path version of /owa with url path of /mail/0 would be /owa/0
 *
 * Remark: This method does not account for explicit logon/delegated access in url. You need to use getScopedPath for that sceanrio.
 *
 * @param rootPath a vdir like /mail (not indexed)
 */
export default function getIndexedPath(rootPath: string): string {
    return internalGetScopedPath(rootPath, [isIndexTest]);
}
