import { setCanaryHeader } from './setCanaryHeader';
import type { HeadersWithoutIterator } from './RequestOptions';

const ATTEMPT_HEADER: string = 'X-OWA-Attempt';

export default function addFetchRetryHeaders(
    attemptCount: number,
    headers: HeadersWithoutIterator
) {
    setCanaryHeader(headers);
    headers.set(ATTEMPT_HEADER, '' + attemptCount);
}
