import { makePostRequest } from 'owa-ows-gateway';

const POST_WHATS_NEW_READ_COUNT_URL: string = 'ows/api/v1.0/whatsnew/items/count';

export function postReadCount(identities: string[]): Promise<void> {
    return makePostRequest(`${POST_WHATS_NEW_READ_COUNT_URL}`, { ids: identities });
}
