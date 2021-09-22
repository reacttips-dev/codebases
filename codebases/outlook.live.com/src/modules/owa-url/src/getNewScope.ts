import { default as joinPath, ensureLeadingSlash, ensureTrailingSlash } from './joinPath';
import getRootVdirName from './getRootVdirName';

/**
 * Given the current application path, returns a path targeted at a different scope.
 *
 * @param scope The new scope to target
 */
export default function getNewScope(scope: string): string {
    return ensureLeadingSlash(ensureTrailingSlash(joinPath(getRootVdirName() || '', scope)));
}
