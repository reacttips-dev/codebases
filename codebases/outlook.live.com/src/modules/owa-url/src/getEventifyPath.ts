import getScopedPath from './getScopedPath';

let indexedReactPath: string;
export default function getEventifyPath(): string {
    if (!indexedReactPath) {
        indexedReactPath = getScopedPath('/eventify') + '?entryPoint=owa';
    }
    return indexedReactPath;
}
