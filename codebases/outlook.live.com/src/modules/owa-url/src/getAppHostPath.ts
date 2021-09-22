import getScopedPath from './getScopedPath';

let indexedReactPath: string;
export default function getAppHostPath(): string {
    if (!indexedReactPath) {
        indexedReactPath = getScopedPath('/host') + '/';
    }
    return indexedReactPath;
}
