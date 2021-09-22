/**
 * Joins the given path segments into a single path
 *
 * The resulting path string will NOT have a leading or trailing '/' even if the
 * first/last segments have leading/trailing slashes
 *
 * It will make sure that segments are separated by at most one '/' and remove
 * any empty segments that it finds.
 *
 * It will not do anything to a '/' in the middle of meaningful characters
 * passed in as part of a segment.
 *
 * A segment is considered meaningful only if it contains at least one character
 * that is not '/'.
 *
 * @param segments the path segments to join
 */
export default function joinPath(...segments: string[]): string {
    return segments
        .filter(s => s)
        .map(stripSeparators)
        .filter(segment => segment.length !== 0)
        .join('/');
}

/**
 * Ensures that the path begins with '/'
 *
 * @param path the path
 */
export function ensureLeadingSlash(path: string): string {
    if (!path) {
        return '/';
    }
    return path.length > 0 && path[0] !== '/' ? '/' + path : path;
}

/**
 * Ensures that the path ends with '/'
 *
 * @param path the path
 */
export function ensureTrailingSlash(path: string): string {
    return path.length > 0 && path[path.length - 1] !== '/' ? path + '/' : path;
}

function stripSeparators(segment: string): string {
    return segment.replace(/^\/*/, '').replace(/\/*$/, '');
}
