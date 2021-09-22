import { sendOwsPrimeRequest } from 'owa-ows-gateway';

/* If modifying these consts please add Spaces to the PR. */
const throwServiceError = true;
const sendPayloadAsBody = true;

export function GET<TResponse>(
    actionName: string,
    targetMailbox: string | null | undefined,
    path: string
) {
    return sendOwsPrimeRequest<TResponse>(actionName, 'GET', path, {
        throwServiceError,
        customHeaders: headers(targetMailbox),
    });
}

export function DELETE(
    actionName: string,
    targetMailbox: string | null | undefined,
    path: string,
    body?: any
) {
    return sendOwsPrimeRequest<void>(actionName, 'DELETE', path, {
        requestObject: body,
        sendPayloadAsBody,
        throwServiceError,
        customHeaders: headers(targetMailbox),
    });
}

export function POST<TResponse>(
    actionName: string,
    targetMailbox: string | null | undefined,
    path: string,
    body: any,
    returnFullObject?: boolean
): Promise<TResponse> {
    return sendOwsPrimeRequest<TResponse>(actionName, 'POST', path, {
        requestObject: body,
        sendPayloadAsBody,
        throwServiceError,
        customHeaders: headers(targetMailbox, returnFullObject),
    });
}

export function PATCH<TResponse>(
    actionName: string,
    targetMailbox: string | null | undefined,
    path: string,
    body: any,
    returnFullObject?: boolean
): Promise<TResponse> {
    return sendOwsPrimeRequest<TResponse>(actionName, 'PATCH', path, {
        requestObject: body,
        sendPayloadAsBody,
        throwServiceError,
        customHeaders: headers(targetMailbox, returnFullObject),
    });
}

function headers(targetMailbox: string | null | undefined, returnFullObject?: boolean) {
    const customHeaders = {};
    if (targetMailbox) {
        customHeaders['x-anchormailbox'] = targetMailbox;
    }
    if (returnFullObject === true) {
        customHeaders['Prefer'] = 'return=representation';
    }
    if (returnFullObject === false) {
        customHeaders['Prefer'] = 'return=minimal';
    }
    return customHeaders;
}
