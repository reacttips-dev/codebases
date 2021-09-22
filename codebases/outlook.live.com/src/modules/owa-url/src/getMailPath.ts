import getScopedPath from './getScopedPath';

let indexedMailPath: string;
export default function getMailPath(): string {
    if (!indexedMailPath) {
        indexedMailPath = getScopedPath('/mail') + '/';
    }
    return indexedMailPath;
}
