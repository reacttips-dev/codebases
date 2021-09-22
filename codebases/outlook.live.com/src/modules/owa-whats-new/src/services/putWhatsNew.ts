import { makePutRequest } from 'owa-ows-gateway';

const PUT_WHATS_NEW_URL: string = 'ows/api/v1.0/whatsnew/items';

export function putWhatsNew(identity: number | string): Promise<void> {
    return makePutRequest(
        `${PUT_WHATS_NEW_URL}/${identity}`,
        { id: identity },
        undefined,
        undefined,
        undefined,
        false
    );
}
