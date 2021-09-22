import { default as joinPath, ensureLeadingSlash, ensureTrailingSlash } from './joinPath';
import { getHostLocation } from './hostLocation';
import getRootVdirName from './getRootVdirName';

export default function getFullPathForAuthRedirect(rootPath: string): string {
    let scopedPath = rootPath;
    const windowUrlPath = getHostLocation()?.pathname;

    if (windowUrlPath) {
        // Normalize by trimming the slashes from start and end of windowUrlPath
        const postVdirPath = windowUrlPath.split('/' + getRootVdirName() + '/')[1];
        scopedPath = joinPath(scopedPath, postVdirPath);
    }

    return ensureLeadingSlash(ensureTrailingSlash(scopedPath));
}
