import type { MailboxInfo } from 'owa-client-ids';
import type MailboxRequestOptions from '../types/MailboxRequestOptions';
import type RequestOptions from 'owa-service/lib/RequestOptions';

export default function getMailboxRequestOptions(
    mailboxInfo?: MailboxInfo | undefined | null,
    requestOptions?: RequestOptions | undefined | null
): MailboxRequestOptions | RequestOptions | undefined {
    if (mailboxInfo) {
        return {
            mailboxInfo: mailboxInfo,
            ...requestOptions,
        } as MailboxRequestOptions;
    } else {
        return requestOptions ?? undefined;
    }
}
