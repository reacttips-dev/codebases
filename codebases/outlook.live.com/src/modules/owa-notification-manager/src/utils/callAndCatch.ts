import { emitError } from './emitTrace';

export default function callAndCatch(callback: () => void): void {
    try {
        callback();
    } catch (e) {
        emitError(e);
    }
}
