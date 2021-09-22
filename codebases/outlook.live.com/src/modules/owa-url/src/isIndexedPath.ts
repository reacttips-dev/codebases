import { getHostLocation } from './hostLocation';
import getRootVdirName from './getRootVdirName';

/**
 * Gets if the url specified is an indexed path
 *
 * In the case of an indexed path (e.g. /mail/0/) for multiple account scenarios (Outlook/Gmail) it will return true else false.
 *
 */
export default function isIndexedPath(): boolean {
    const windowUrlPath = getHostLocation()?.pathname;
    if (windowUrlPath) {
        // Normalize by trimming the slashes from start and end of windowUrlPath
        const postVdirPath = windowUrlPath.split('/' + getRootVdirName() + '/')[1];
        if (postVdirPath) {
            const postVdirSegment = postVdirPath.split('/')[0];
            // Indexed path /mail/0/ or Target Mailbox segment /mail/me@contoso.com/
            if (postVdirSegment && !isNaN(parseInt(postVdirSegment))) {
                return true;
            }
        }
    }

    return false;
}
