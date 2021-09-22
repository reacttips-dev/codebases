import getScopedPath from './getScopedPath';

let indexedReactPath: string;
export default function getCalendarPath(): string {
    if (!indexedReactPath) {
        indexedReactPath = getScopedPath('/calendar') + '/';
    }
    return indexedReactPath;
}
