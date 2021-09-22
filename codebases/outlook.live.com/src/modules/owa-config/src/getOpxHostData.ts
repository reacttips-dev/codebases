import type { OpxSessionInfo } from './types/OpxSessionInfo';
import { overrideSessionId } from './getSessionId';

let promise: Promise<OpxSessionInfo> | undefined;
let hostApp: string | undefined = '(none)';

export function getOpxHostData() {
    return promise;
}

export function getOpxHostApp(): string {
    if (!hostApp) {
        throw new Error('Opx has not responded with the config yet');
    }
    return hostApp;
}

export function setOpxHostData(value: Promise<OpxSessionInfo>) {
    hostApp = undefined;
    promise = value.then(opxHostData => {
        hostApp = opxHostData.hostApp;
        const sessionId = opxHostData.sessionId;
        if (sessionId) {
            overrideSessionId(sessionId);
        }
        return opxHostData;
    });
}
