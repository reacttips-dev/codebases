import { DeferrablePromise, DEFERRABLE_PROMISE_TIMEOUT_ERROR } from '../utils/DeferrablePromise';
import type ExtensionEventResult from './schema/ExtensionEventResult';
import InvokeAppAddinCommandStatusCode from './schema/enums/InvokeAppAddinCommandStatusCode';

const UILESS_TIMEOUT_IN_MS = 330000;
const TIMEOUT_EXTEND_IN_MS = 300000;
const pendingUILessAddins: { [key: string]: DeferrablePromise<ExtensionEventResult> } = {};

export function setPendingUILess(controlId: string): Promise<ExtensionEventResult> {
    const pendingUILess = new DeferrablePromise<ExtensionEventResult>(UILESS_TIMEOUT_IN_MS);
    pendingUILessAddins[controlId] = pendingUILess;

    return pendingUILess.catch<ExtensionEventResult>((error: Error) => {
        if (error.message === DEFERRABLE_PROMISE_TIMEOUT_ERROR) {
            return {
                status: InvokeAppAddinCommandStatusCode.TimedOut,
            };
        }
        return {
            status: InvokeAppAddinCommandStatusCode.Unknown,
        };
    });
}

export function resolvePendingUILess(controlId: string, result: ExtensionEventResult): void {
    if (pendingUILessAddins[controlId]) {
        const promise = pendingUILessAddins[controlId];
        promise.resolve(result);
        delete pendingUILessAddins[controlId];
    }
}

export function resetPendingUILess(controlId: string): void {
    if (pendingUILessAddins[controlId]) {
        pendingUILessAddins[controlId].reset(TIMEOUT_EXTEND_IN_MS);
    }
}
