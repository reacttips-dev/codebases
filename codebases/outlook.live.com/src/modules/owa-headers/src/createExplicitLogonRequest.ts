import setExplicitLogonHeaders from './setExplicitLogonHeaders';
import type { MailboxRequestOptions } from 'owa-request-options-types';
import type RequestOptions from 'owa-service/lib/RequestOptions';

export default function createExplicitLogonRequest(
    smtp: string,
    mailboxRequestOptions?: MailboxRequestOptions
): RequestOptions {
    const req: RequestOptions = mailboxRequestOptions ?? {};
    const headers = req.headers?.set ? new Headers(<Headers>req.headers) : new Headers();
    req.datapoint = req.datapoint || {};
    req.datapoint.mailbox = req.datapoint.mailbox || 'Explicit';
    setExplicitLogonHeaders(smtp, <Headers>headers);
    return {
        ...req,
        headers,
    };
}
