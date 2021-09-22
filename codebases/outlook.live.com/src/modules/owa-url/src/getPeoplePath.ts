import getScopedPath from './getScopedPath';

let indexedReactPath: string;
export default function getPeoplePath(): string {
    if (!indexedReactPath) {
        indexedReactPath = getScopedPath('/people') + '/';
    }
    return indexedReactPath;
}
