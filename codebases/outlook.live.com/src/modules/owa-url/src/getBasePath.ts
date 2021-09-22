import getRootVdirName from './getRootVdirName';
import getScopedPath from './getScopedPath';

/**
 * Gives the base path with the following format: mail/ or mail/0/
 */
export default function getBasePath(vdir?: string) {
    return (getScopedPath('/' + (vdir || getRootVdirName())) + '/').replace(/^\//, '');
}
