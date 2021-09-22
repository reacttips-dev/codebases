import { isOneOf } from './isOneOf';

const nonOwaErrors: string[] = [
    'chrome-extension://',
    'file:///',
    'btglss.net/',
    '(/Users/',
    '(/Applications/',
];
export function isNonOwaError(callstack: string | undefined): boolean {
    return isOneOf(nonOwaErrors, callstack);
}
