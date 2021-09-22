import { getHostLocation } from 'owa-url/lib/hostLocation';
import { trace } from 'owa-trace';
import { logUsage } from 'owa-analytics';
import doHipExceptionRedirect from './doHipExceptionRedirect';
import type { HeadersWithoutIterator } from 'owa-service/lib/RequestOptions';

let isHipErrorHandled: boolean;
export default function checkAndHandleOwaHipError(headers?: HeadersWithoutIterator): boolean {
    if (headers && headers.get('X-OWA-ExtendedErrorCode') == '5') {
        let hipPath = headers.get('X-OWA-ExtendedErrorData');
        if (!isHipErrorHandled) {
            if (hipPath) {
                isHipErrorHandled = true;
                trace.warn('Hip redirect needed.');
                logUsage('ReactHipRedirect', { hipPath });
                doHipExceptionRedirect(getHostLocation(), hipPath);
            } else {
                trace.warn('Missing hip redirection url');
            }
        }
    }

    return isHipErrorHandled;
}

export function resetHipErrorHandledFlag() {
    isHipErrorHandled = false;
}
