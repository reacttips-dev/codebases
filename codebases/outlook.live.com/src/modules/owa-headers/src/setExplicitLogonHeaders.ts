import type { HeadersWithoutIterator } from 'owa-service/lib/RequestOptions';
import { setHeaders } from 'owa-headers-core';
import { getExplicitLogonHeaders } from './getExplicitLogonHeaders';

export default function setExplicitLogonHeaders(
    smtp: string | undefined | null,
    headers: HeadersWithoutIterator | undefined | null,
    prefixedId?: string
) {
    if (headers && (smtp || prefixedId)) {
        setHeaders(headers, getExplicitLogonHeaders(smtp, prefixedId));
    }
}
