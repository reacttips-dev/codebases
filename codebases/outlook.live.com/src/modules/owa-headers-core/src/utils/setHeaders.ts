import type { HeadersWithoutIterator } from 'owa-service/lib/RequestOptions';

export function setHeaders(
    headers: HeadersWithoutIterator,
    headerVals: { [headerName: string]: string }
) {
    Object.keys(headerVals).forEach(headerName => headers.set(headerName, headerVals[headerName]));
}
