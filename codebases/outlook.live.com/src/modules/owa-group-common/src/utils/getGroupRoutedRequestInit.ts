import type RequestOptions from 'owa-service/lib/RequestOptions';
import { getHeaders } from 'owa-headers';

export default function getGroupRoutedRequestInit(
    groupSmtp: string,
    prefixedId?: string
): RequestOptions {
    return {
        headers: getHeaders(groupSmtp, 'GroupMailbox', false, prefixedId),
    };
}
