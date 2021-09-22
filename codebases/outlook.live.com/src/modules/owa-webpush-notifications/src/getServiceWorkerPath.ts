import { getIndexedPath } from 'owa-url';

export default function getServiceWorkerPath(rootVdirName: string): string {
    let indexedPath = rootVdirName;
    if (rootVdirName != null) {
        indexedPath = getIndexedPath('/' + rootVdirName);
    }

    return indexedPath;
}
