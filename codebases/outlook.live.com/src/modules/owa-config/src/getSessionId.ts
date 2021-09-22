import { getQueryStringParameter } from 'owa-querystring';
const GuidRegex = /[xy]/g;

let sessionId: string;

export function getSessionId(): string {
    if (!sessionId) {
        sessionId = getQueryStringParameter('sessionId') || newGuid();
    }
    return sessionId;
}

export function overrideSessionId(value: string) {
    sessionId = value;
}

function newGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(GuidRegex, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
