import getScopedPath from './getScopedPath';

let indexedReactPath: string;
export default function getFilesHubPath(): string {
    if (!indexedReactPath) {
        indexedReactPath = getScopedPath('/files') + '/';
    }
    return indexedReactPath;
}
