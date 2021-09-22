import type { MailboxRequestOptions } from 'owa-request-options-types';
import type RequestOptions from 'owa-service/lib/RequestOptions';
import { setHeaders } from 'owa-headers-core';
import * as trace from 'owa-trace';

export function getArchiveMailboxRequestOptions(
    mailboxRequestOptions: MailboxRequestOptions
): RequestOptions {
    const mailboxInfo = mailboxRequestOptions.mailboxInfo;

    if (mailboxInfo.mailboxSmtpAddress == null) {
        trace.errorThatWillCauseAlert(
            'getArchiveMailboxRequest: mailboxSmtpAddress should be passed for Archive Mailbox request'
        );
    }

    const req: RequestOptions = mailboxRequestOptions;
    const headers = req.headers?.set ? new Headers(<Headers>req.headers) : new Headers();
    req.datapoint = req.datapoint || {};
    req.datapoint.mailbox = req.datapoint.mailbox || 'Archive';

    setHeaders(headers, {
        'X-AnchorMailbox': mailboxInfo.mailboxSmtpAddress,
    });

    if (mailboxInfo.auxiliaryMailboxGuid) {
        setHeaders(headers, {
            'X-AuxMailbox': mailboxInfo.auxiliaryMailboxGuid,
        });
    }

    return {
        ...req,
        headers,
    };
}
