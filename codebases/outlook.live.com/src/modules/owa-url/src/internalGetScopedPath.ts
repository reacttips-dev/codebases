import { default as joinPath, ensureLeadingSlash } from './joinPath';
import { getHostLocation } from './hostLocation';
import getRootVdirName from './getRootVdirName';

type PostVdirTest = (input: string) => boolean;

export const isIndexTest: PostVdirTest = (input: string) => !isNaN(parseInt(input));
export const isExplicitTest: PostVdirTest = (input: string) => !!input.match(/.+@.+/);

/**
 * Gets the scoped path of intended url
 *
 * This will get the scoped path for building URLs in the same scope as the current window.
 *
 * In the case of an indexed path (e.g. /mail/0/) for multiple account scenarios (Outlook/Gmail) it will include the index.
 *
 * In the case of a target mailbox path (e.g. /mail/me@contoso.com/) for explicit logon scenarios it will include the target mailbox.
 *
 * This will always return a path with both a leading and trailing slash.
 * Leading/trailing slashes in both arguments are ignored.
 *
 * @param rootPath the application path to build a scoped path for, usually a virtual directory like /mail
 */
export function internalGetScopedPath(rootPath: string, postVdirTests: PostVdirTest[]): string {
    let scopedPath = rootPath;

    const windowUrlPath = getHostLocation()?.pathname;
    if (windowUrlPath) {
        // Normalize by trimming the slashes from start and end of windowUrlPath
        const postVdirPath = windowUrlPath.split('/' + getRootVdirName() + '/')[1];
        if (postVdirPath) {
            const postVdirSegment = postVdirPath.split('/')[0];
            // Indexed path /mail/0/ or Target Mailbox segment /mail/me@contoso.com/
            if (postVdirSegment && postVdirTests.filter(t => t(postVdirSegment)).length > 0) {
                scopedPath = joinPath(scopedPath, postVdirSegment);
            }
        }
    }

    return ensureLeadingSlash(scopedPath);
}
