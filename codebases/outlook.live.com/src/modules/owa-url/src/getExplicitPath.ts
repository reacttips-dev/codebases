import { internalGetScopedPath, isExplicitTest } from './internalGetScopedPath';

/**
 * Gets the explicit path of intended url
 *
 * This will get the explicit path for building URLs in the same scope as the current window taking into account shared mailbox access.
 * Use getScopedPath to account for both multi-identity url as well as explicit logon
 * In the case of a target mailbox path (e.g. /mail/me@contoso.com/) for explicit logon scenarios it will include the target mailbox.
 *
 * This will always return a path with both a leading and trailing slash.
 * Leading/trailing slashes in both arguments are ignored.
 *
 * @param rootPath the application path to build a scoped path for, usually a virtual directory like /mail
 */
export default function getExplicitPath(rootPath: string): string {
    return internalGetScopedPath(rootPath, [isExplicitTest]);
}
