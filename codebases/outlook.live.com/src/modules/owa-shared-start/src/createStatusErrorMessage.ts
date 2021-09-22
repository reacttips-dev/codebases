import type BootError from './interfaces/BootError';
import getHeader from './getHeader';
import { appendMiscData } from './miscData';
import type { TraceErrorObject } from 'owa-trace/lib/TraceErrorObject';

const headersToCheck = ['X-BEServer', 'X-FEServer', 'X-MSEdge-Ref'];
const statusesToAddHeaders: number[] = [403, 404, 503];

export function createStatusErrorMessage(response: Response): BootError {
    let message = '';
    if (response.status) {
        message += response.status;
        if (statusesToAddHeaders.indexOf(response.status) > -1) {
            message += '|';
            for (let ii = 0; ii < headersToCheck.length; ii++) {
                const header = headersToCheck[ii];
                if (getHeader(response, header)) {
                    message += header;
                    break;
                }
            }
        }
    } else if (((response as unknown) as TraceErrorObject).networkError) {
        message = 'NetworkResponseError';
    } else {
        message = 'UnknownResponseError';
        appendMiscData('bres', Object.keys(response).join('|'));
    }

    return attachResponse(new Error(message), response);
}

function attachResponse(e: BootError, r: Response): BootError {
    e.response = r;
    e.status = r.status;
    return e;
}
